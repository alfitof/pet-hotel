"use client";

import { useEffect, useState } from "react";
import { Menu, Plus, Clock, Users } from "lucide-react";
import { NavPage } from "./Sidebar";

interface Props {
  activePage: NavPage;
  onAddSlot: () => void;
  occupiedCount: number;
  onMobileMenuOpen: () => void;
}

const PAGE_META: Record<NavPage, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Admin!" },
  rooms: { title: "Rooms", subtitle: "Manage your pet rooms" },
  guests: { title: "Guests", subtitle: "Current staying guests" },
  reports: { title: "Reports", subtitle: "Hotel performance overview" },
};

export default function TopBar({
  activePage,
  onAddSlot,
  occupiedCount,
  onMobileMenuOpen,
}: Props) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const meta = PAGE_META[activePage];

  return (
    <header
      className="flex items-center justify-between px-5 sticky top-0 z-30"
      style={{
        height: "var(--topbar-h)",
        backgroundColor: "rgba(255,251,245,.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1.5px solid #FED7AA",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-orange-100"
          style={{ color: "#EA580C" }}
        >
          <Menu size={18} strokeWidth={2} />
        </button>
        <div>
          <h2
            className="text-base font-extrabold leading-tight"
            style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
          >
            {meta.title}
          </h2>
          <p className="text-xs font-semibold" style={{ color: "#FB923C" }}>
            {meta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
          style={{
            backgroundColor: "#FFF4E6",
            color: "#EA580C",
            border: "1.5px solid #FED7AA",
          }}
        >
          <Clock size={13} strokeWidth={2} />
          <span style={{ fontFamily: "'Baloo 2', cursive" }}>{time}</span>
        </div>

        {occupiedCount > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{
              backgroundColor: "#FFF4E6",
              color: "#C2410C",
              border: "1.5px solid #FED7AA",
            }}
          >
            <Users size={13} strokeWidth={2} />
            <span style={{ fontFamily: "'Baloo 2', cursive" }}>
              {occupiedCount} guests
            </span>
          </div>
        )}

        <button
          onClick={onAddSlot}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Room</span>
        </button>
      </div>
    </header>
  );
}
