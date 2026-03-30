"use client";

import { LogIn, LogOut, PlusCircle, Trash2 } from "lucide-react";
import { ActivityLog } from "@/lib/types";

const TYPE_CONFIG = {
  checkin: {
    Icon: LogIn,
    bg: "#FFF7ED",
    border: "#FED7AA",
    iconColor: "#EA580C",
    iconBg: "#FFEDD5",
  },
  checkout: {
    Icon: LogOut,
    bg: "#F0FDF4",
    border: "#BBF7D0",
    iconColor: "#059669",
    iconBg: "#DCFCE7",
  },
  added: {
    Icon: PlusCircle,
    bg: "#EFF6FF",
    border: "#BFDBFE",
    iconColor: "#2563EB",
    iconBg: "#DBEAFE",
  },
  removed: {
    Icon: Trash2,
    bg: "#FFF1F2",
    border: "#FECDD3",
    iconColor: "#E11D48",
    iconBg: "#FFE4E6",
  },
};

function timeAgo(ts: number) {
  const d = Date.now() - ts;
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}h ago`;
  return `${Math.floor(d / 86400000)}d ago`;
}

export default function ActivityFeed({
  logs,
  fullHeight,
}: {
  logs: ActivityLog[];
  fullHeight?: boolean;
}) {
  return (
    <div
      className={`card p-4 flex flex-col ${fullHeight ? "flex-1 min-h-0" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-extrabold"
          style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
        >
          Recent Activity
        </h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#FFF4E6", color: "#EA580C" }}
        >
          {logs.length}
        </span>
      </div>

      <div
        className={`flex flex-col gap-2 overflow-y-auto ${fullHeight ? "flex-1" : "max-h-64"}`}
      >
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-50 gap-2">
            <LogIn size={28} color="#FB923C" strokeWidth={1.5} />
            <p className="text-sm font-semibold" style={{ color: "#C2410C" }}>
              No activity yet
            </p>
          </div>
        ) : (
          logs.map((log, i) => {
            const cfg = TYPE_CONFIG[log.type];
            const Icon = cfg.Icon;
            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 p-2.5 rounded-xl anim-fade-in"
                style={{
                  backgroundColor: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  animationDelay: `${i * 0.04}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.iconBg }}
                >
                  <Icon size={13} color={cfg.iconColor} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold leading-snug"
                    style={{ color: "#431407" }}
                  >
                    {log.message}
                  </p>
                  <p
                    className="text-xs mt-0.5 font-medium"
                    style={{ color: "#9A3412", opacity: 0.6 }}
                  >
                    {timeAgo(log.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
