"use client";

import { useState, useEffect } from "react";

interface Props {
  pageTitle: string;
  pageEmoji: string;
  onAddSlot: () => void;
  occupiedCount: number;
}

export default function TopBar({
  pageTitle,
  pageEmoji,
  onAddSlot,
  occupiedCount,
}: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-6 py-4 sticky top-0 z-30"
      style={{
        backgroundColor: "rgba(253,243,231,.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "2px solid var(--color-o200)",
      }}
    >
      {/* Page title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm"
          style={{ backgroundColor: "var(--color-o500)", color: "white" }}
        >
          {pageEmoji}
        </div>
        <div>
          <h2
            className="text-lg font-extrabold leading-none"
            style={{
              color: "var(--color-o800)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            {pageTitle}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-o400)" }}>
            Pawcation Pet Hotel Management
          </p>
        </div>
      </div>

      {/* Right area */}
      <div className="flex items-center gap-3">
        {/* Time */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold"
          style={{
            backgroundColor: "var(--color-o100)",
            color: "var(--color-o600)",
          }}
        >
          <span>🕐</span>
          <span style={{ fontFamily: "'Baloo 2', cursive" }}>{time}</span>
        </div>

        {/* Notif badge */}
        {occupiedCount > 0 && (
          <div
            className="relative flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold"
            style={{ backgroundColor: "var(--color-o500)", color: "white" }}
          >
            <span>😺</span>
            <span style={{ fontFamily: "'Baloo 2', cursive" }}>
              {occupiedCount} tamu
            </span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={onAddSlot}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
          style={{
            background:
              "linear-gradient(135deg, var(--color-o500), var(--color-o700))",
            fontFamily: "'Baloo 2', cursive",
            boxShadow: "0 4px 14px rgba(249,115,22,.4)",
          }}
        >
          <span>+</span>
          <span>Tambah Kamar</span>
        </button>
      </div>
    </header>
  );
}
