/**
 * Ingestion Scheduler Configuration
 * Configurable schedules, execution time windows, timezone management, and concurrency locks.
 * Default: Twice daily at 06:00 AM IST and 06:00 PM IST (30 0,12 * * * in UTC).
 */

export interface SyncWindowConfig {
  hourIST: number;
  minuteIST: number;
  label: string;
}

export interface SchedulerConfig {
  enabled: boolean;
  cronExpression: string;
  timezone: string;
  windows: SyncWindowConfig[];
  concurrencyLimit: number;
  jobTimeoutMinutes: number;
  maxRetries: number;
}

export const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  enabled: process.env.SYNC_ENABLED !== "false",
  cronExpression: process.env.SYNC_SCHEDULE_CRON || "30 0,12 * * *", // 06:00 AM IST & 06:00 PM IST
  timezone: "Asia/Kolkata",
  windows: [
    { hourIST: 6, minuteIST: 0, label: "06:00 AM IST" },
    { hourIST: 18, minuteIST: 0, label: "06:00 PM IST" },
  ],
  concurrencyLimit: parseInt(process.env.SYNC_CONCURRENCY_LIMIT || "4", 10),
  jobTimeoutMinutes: parseInt(process.env.SYNC_JOB_TIMEOUT_MINUTES || "15", 10),
  maxRetries: 3,
};

/**
 * Returns current scheduler configuration from environment overrides.
 */
export function getSchedulerConfig(): SchedulerConfig {
  return {
    ...DEFAULT_SCHEDULER_CONFIG,
    enabled: process.env.SYNC_ENABLED !== "false",
    cronExpression: process.env.SYNC_SCHEDULE_CRON || DEFAULT_SCHEDULER_CONFIG.cronExpression,
    concurrencyLimit: parseInt(
      process.env.SYNC_CONCURRENCY_LIMIT || String(DEFAULT_SCHEDULER_CONFIG.concurrencyLimit),
      10
    ),
    jobTimeoutMinutes: parseInt(
      process.env.SYNC_JOB_TIMEOUT_MINUTES || String(DEFAULT_SCHEDULER_CONFIG.jobTimeoutMinutes),
      10
    ),
  };
}

/**
 * Calculates the next upcoming scheduled sync window in IST.
 */
export function getNextScheduledSync(): {
  date: Date;
  label: string;
  timeRemaining: string;
  formattedIST: string;
} {
  const config = getSchedulerConfig();
  const now = new Date();

  // Convert current UTC time to IST (UTC + 5 hours 30 mins)
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffsetMs);

  const currentHour = nowIST.getUTCHours();
  const currentMinute = nowIST.getUTCMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  let nextWindow: SyncWindowConfig | null = null;
  let daysToAdd = 0;

  for (const win of config.windows) {
    const winTotalMinutes = win.hourIST * 60 + win.minuteIST;
    if (winTotalMinutes > currentTotalMinutes) {
      nextWindow = win;
      break;
    }
  }

  if (!nextWindow) {
    // Wrap to the first window on the next day
    nextWindow = config.windows[0];
    daysToAdd = 1;
  }

  // Build target Date in IST
  const targetYear = nowIST.getUTCFullYear();
  const targetMonth = nowIST.getUTCMonth();
  const targetDate = nowIST.getUTCDate() + daysToAdd;

  const targetISTMs = Date.UTC(
    targetYear,
    targetMonth,
    targetDate,
    nextWindow.hourIST,
    nextWindow.minuteIST,
    0
  );

  // Convert back to UTC Date object
  const nextSyncDateUTC = new Date(targetISTMs - istOffsetMs);

  const diffMs = Math.max(0, nextSyncDateUTC.getTime() - now.getTime());
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  let timeRemaining = "";
  if (diffHours > 0) {
    timeRemaining = `in ${diffHours}h ${diffMinutes}m`;
  } else {
    timeRemaining = `in ${diffMinutes}m`;
  }

  const isToday = daysToAdd === 0;
  const dayPrefix = isToday ? "Today" : "Tomorrow";
  const formattedIST = `${dayPrefix} at ${nextWindow.label}`;

  return {
    date: nextSyncDateUTC,
    label: nextWindow.label,
    timeRemaining,
    formattedIST,
  };
}
