"use client";

import { Home, Users, KeyRound, TrendingUp } from "lucide-react";
import { CargoSlot } from "@/lib/types";

export default function StatsRow({ slots }: { slots: CargoSlot[] }) {
  const total = slots.length;
  const occupied = slots.filter((s) => s.pet !== null).length;
  const empty = total - occupied;
  const rate = total === 0 ? 0 : Math.round((occupied / total) * 100);

  const cards = [
    {
      icon: Home,
      label: "Total Rooms",
      value: total,
      sub: "registered",
      bg: "#FFF7ED",
      iconBg: "#FFEDD5",
      iconColor: "#EA580C",
      valColor: "#EA580C",
    },
    {
      icon: Users,
      label: "Staying Now",
      value: occupied,
      sub: "active pets",
      bg: "#FFFBEB",
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
      valColor: "#D97706",
    },
    {
      icon: KeyRound,
      label: "Available",
      value: empty,
      sub: "rooms open",
      bg: "#F0FDF4",
      iconBg: "#DCFCE7",
      iconColor: "#059669",
      valColor: "#059669",
    },
    {
      icon: TrendingUp,
      label: "Occupancy Rate",
      value: `${rate}%`,
      sub: "of capacity",
      bg: "#EFF6FF",
      iconBg: "#DBEAFE",
      iconColor: "#2563EB",
      valColor: "#2563EB",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="card card-hover anim-slide-up flex items-center gap-3 p-4"
            style={{ backgroundColor: c.bg }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: c.iconBg }}
            >
              <Icon size={20} color={c.iconColor} strokeWidth={2} />
            </div>
            <div>
              <p
                className="text-xs font-semibold mb-0.5"
                style={{ color: "#9A3412", opacity: 0.7 }}
              >
                {c.label}
              </p>
              <p
                className="text-2xl font-extrabold leading-none"
                style={{ color: c.valColor, fontFamily: "'Baloo 2', cursive" }}
              >
                {c.value}
              </p>
              <p
                className="text-xs mt-0.5 font-semibold"
                style={{ color: "#9A3412", opacity: 0.55 }}
              >
                {c.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
