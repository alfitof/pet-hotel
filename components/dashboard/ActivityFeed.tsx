"use client";

import { ActivityLog } from "@/lib/types";

interface Props {
  logs: ActivityLog[];
}

const TYPE_STYLE: Record<ActivityLog["type"], { bg: string; border: string }> =
  {
    checkin: { bg: "#FEF3C7", border: "#FCD34D" },
    checkout: { bg: "#DCFCE7", border: "#86EFAC" },
    added: { bg: "#DBEAFE", border: "#BAE6FD" },
    removed: { bg: "#FEE2E2", border: "#FCA5A5" },
  };

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "baru saja";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} menit lalu`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} jam lalu`;
  return `${Math.floor(diff / 86400000)} hari lalu`;
}

export default function ActivityFeed({ logs }: Props) {
  return (
    <div
      className="rounded-3xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,.06)",
        border: "2px solid var(--color-o100)",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3
          className="text-base font-extrabold flex items-center gap-2"
          style={{
            color: "var(--color-o800)",
            fontFamily: "'Baloo 2', cursive",
          }}
        >
          <span>📋</span> Aktivitas Terbaru
        </h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--color-o100)",
            color: "var(--color-o600)",
          }}
        >
          {logs.length} log
        </span>
      </div>

      {logs.length === 0 && (
        <div className="text-center py-8 opacity-50">
          <div className="text-4xl mb-2">🌙</div>
          <p className="text-sm" style={{ color: "var(--color-o600)" }}>
            Belum ada aktivitas
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {logs.map((log, i) => {
          const style = TYPE_STYLE[log.type];
          return (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-2xl anim-fade-in"
              style={{
                backgroundColor: style.bg,
                border: `1.5px solid ${style.border}`,
                animationDelay: `${i * 0.05}s`,
                opacity: 0,
              }}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{log.emoji}</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-bold leading-snug"
                  style={{
                    color: "var(--color-o800)",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {log.message}
                </p>
                <p
                  className="text-xs mt-0.5 opacity-60"
                  style={{ color: "var(--color-o700)" }}
                >
                  {timeAgo(log.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
