"use client";

import { CargoSlot } from "@/lib/types";

interface Props {
  slots: CargoSlot[];
}

export default function StatsRow({ slots }: Props) {
  const total = slots.length;
  const occupied = slots.filter((s) => s.pet !== null).length;
  const empty = total - occupied;
  const rate = total === 0 ? 0 : Math.round((occupied / total) * 100);

  const cards = [
    {
      icon: "🏨",
      label: "Total Kamar",
      value: total,
      sub: "kamar terdaftar",
      bg: "var(--color-o100)",
      accent: "var(--color-o500)",
      textColor: "var(--color-o700)",
    },
    {
      icon: "😺",
      label: "Sedang Menginap",
      value: occupied,
      sub: "pet aktif",
      bg: "#FEF9C3",
      accent: "#CA8A04",
      textColor: "#854D0E",
    },
    {
      icon: "🔑",
      label: "Kamar Kosong",
      value: empty,
      sub: "tersedia sekarang",
      bg: "#DCFCE7",
      accent: "var(--color-green-d)",
      textColor: "#14532D",
    },
    {
      icon: "📈",
      label: "Tingkat Hunian",
      value: `${rate}%`,
      sub: "occupancy rate",
      bg: "#FEE2E2",
      accent: "var(--color-red-d)",
      textColor: "#7F1D1D",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
      {cards.map((c, i) => (
        <div
          key={i}
          className="card-lift rounded-3xl p-4 flex items-center gap-4 anim-slide-up"
          style={{
            backgroundColor: c.bg,
            boxShadow: "0 4px 16px rgba(0,0,0,.06)",
            opacity: 0,
          }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
            style={{ backgroundColor: "white" }}
          >
            {c.icon}
          </div>
          {/* Text */}
          <div>
            <p
              className="text-xs font-bold opacity-70 mb-0.5"
              style={{ color: c.textColor }}
            >
              {c.label}
            </p>
            <p
              className="text-2xl font-extrabold leading-none"
              style={{ color: c.accent, fontFamily: "'Baloo 2', cursive" }}
            >
              {c.value}
            </p>
            <p
              className="text-xs mt-0.5 opacity-60"
              style={{ color: c.textColor }}
            >
              {c.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
