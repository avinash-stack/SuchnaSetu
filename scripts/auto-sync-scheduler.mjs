import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const SITE_URL = env.SITE_URL || env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CRON_SECRET = env.CRON_SECRET || "";

function getNextSyncTime() {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffsetMs);

  const currentHour = nowIST.getUTCHours();
  const currentMinute = nowIST.getUTCMinutes();
  const currentTotal = currentHour * 60 + currentMinute;

  // Windows: 01:30 AM (90m), 08:00 AM (480m) & 04:00 PM (960m)
  let targetTotal = 90;
  let addDays = 0;

  if (currentTotal < 90) {
    targetTotal = 90;
  } else if (currentTotal < 480) {
    targetTotal = 480;
  } else if (currentTotal < 960) {
    targetTotal = 960;
  } else {
    targetTotal = 90;
    addDays = 1;
  }

  const targetHour = Math.floor(targetTotal / 60);
  const targetMinute = targetTotal % 60;

  const targetDateIST = new Date(
    Date.UTC(
      nowIST.getUTCFullYear(),
      nowIST.getUTCMonth(),
      nowIST.getUTCDate() + addDays,
      targetHour,
      targetMinute,
      0
    )
  );

  return new Date(targetDateIST.getTime() - istOffsetMs);
}

async function triggerSync() {
  console.log(`\n⏰ [${new Date().toISOString()}] Triggering scheduled automatic synchronization...`);
  const endpoint = `${SITE_URL}/api/cron/sync-all-sources`;

  try {
    const headers = {
      "Content-Type": "application/json",
      "User-Agent": "SuchnaSetu-Scheduler-Daemon/1.0",
    };
    if (CRON_SECRET) {
      headers["Authorization"] = `Bearer ${CRON_SECRET}`;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
    });

    const data = await res.json();
    console.log("✅ Sync execution response (HTTP " + res.status + "):", JSON.stringify(data.summary || data, null, 2));
    console.log("Next Scheduled Sync:", data.nextScheduledSync?.formattedIST || "Calculated");
  } catch (err) {
    console.error("❌ Failed to call sync endpoint:", err.message);
  }
}

async function main() {
  console.log("=============================================================================");
  console.log(" SuchnaSetu - Automated Background Scheduler Daemon");
  console.log(" Schedule: 08:00 AM, 04:00 PM & 01:30 AM IST (3x Daily)");
  console.log(" Target: " + SITE_URL + "/api/cron/sync-all-sources");
  console.log("=============================================================================\n");

  const nextSync = getNextSyncTime();
  const diffMs = nextSync.getTime() - Date.now();
  console.log(`Next automatic sync scheduled for: ${nextSync.toISOString()} (in ${Math.round(diffMs / 60000)} minutes)`);

  // If passed with --now flag, trigger immediately for testing
  if (process.argv.includes("--now")) {
    await triggerSync();
  }
}

main().catch(console.error);
