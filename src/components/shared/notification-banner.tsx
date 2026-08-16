import * as React from "react";
import { Bell, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBannerProps {
  type?: "info" | "warning" | "success";
  title?: string;
  message: string;
  className?: string;
}

export function NotificationBanner({
  type = "info",
  title,
  message,
  className,
}: NotificationBannerProps) {
  const styles = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />,
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-900",
      icon: <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />,
    },
    success: {
      container: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-sm",
        current.container,
        className
      )}
    >
      {current.icon}
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        <p className="leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
}
