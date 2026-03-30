"use client";

import { useState } from "react";

type NavPage = "dashboard" | "kamar" | "tamu" | "laporan";

interface Props {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  totalSlots: number;
  occupiedCount: number;
}

const NAV = [
  { id: "dashboard" as NavPage, icon: "🏠", label: "Dashboard" },
  { id: "kamar" as NavPage, icon: "🏨", label: "Kamar" },
  { id: "tamu" as NavPage, icon: "🐾", label: "Tamu" },
  { id: "laporan" as NavPage, icon: "📊", label: "Laporan" },
];

export default function Sidebar({
  activePage,
  onNavigate,
  totalSlots,
  occupiedCount,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 anim-slide-right"
      style={{
        width: collapsed ? "72px" : "var(--sidebar-w)",
        backgroundColor: "var(--sidebar-bg)",
        flexShrink: 0,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,.1)" }}
      >
        <span className="text-3xl anim-float flex-shrink-0">🐾</span>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1
              className="text-xl font-extrabold leading-none shimmer-text"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Pawcation
            </h1>
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,.5)" }}
            >
              Pet Hotel Dashboard
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:bg-white/20"
          style={{ color: "rgba(255,255,255,.6)" }}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left ${activePage === item.id ? "active" : ""}`}
            style={{
              color: "rgba(255,255,255,.85)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-semibold">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Occupancy gauge */}
      {!collapsed && (
        <div
          className="m-3 p-3 rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,.08)" }}
        >
          <p
            className="text-xs font-bold mb-2"
            style={{
              color: "rgba(255,255,255,.7)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            🏠 Tingkat Hunian
          </p>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg font-extrabold text-white">
              {totalSlots === 0
                ? "0"
                : Math.round((occupiedCount / totalSlots) * 100)}
              %
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,.5)" }}>
              {occupiedCount}/{totalSlots} kamar
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(255,255,255,.15)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width:
                  totalSlots === 0
                    ? "0%"
                    : `${(occupiedCount / totalSlots) * 100}%`,
                background: "linear-gradient(90deg, #FCD34D, #F97316)",
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className="p-4 text-center border-t"
        style={{ borderColor: "rgba(255,255,255,.1)" }}
      >
        {collapsed ? (
          <span className="text-lg">😺</span>
        ) : (
          <p
            className="text-xs"
            style={{
              color: "rgba(255,255,255,.35)",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            © 2026 Pawcation
          </p>
        )}
      </div>
    </aside>
  );
}
