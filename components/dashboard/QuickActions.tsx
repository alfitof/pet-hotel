"use client";

import { PlusSquare, PawPrint, Phone, FileText } from "lucide-react";

interface Props {
  onAddSlot: () => void;
  onCheckInFirst: () => void;
  emptySlotExists: boolean;
}

export default function QuickActions({
  onAddSlot,
  onCheckInFirst,
  emptySlotExists,
}: Props) {
  const actions = [
    {
      Icon: PlusSquare,
      label: "Add Room",
      desc: "New slot",
      onClick: onAddSlot,
      bg: "linear-gradient(135deg,#FB923C,#EA580C)",
      disabled: false,
    },
    {
      Icon: PawPrint,
      label: "Check-In",
      desc: "New guest",
      onClick: onCheckInFirst,
      bg: "linear-gradient(135deg,#34D399,#059669)",
      disabled: !emptySlotExists,
    },
    {
      Icon: Phone,
      label: "Contact",
      desc: "Owners",
      onClick: () => alert("Coming soon!"),
      bg: "linear-gradient(135deg,#60A5FA,#2563EB)",
      disabled: false,
    },
    {
      Icon: FileText,
      label: "Export",
      desc: "PDF report",
      onClick: () => alert("Coming soon!"),
      bg: "linear-gradient(135deg,#C084FC,#9333EA)",
      disabled: false,
    },
  ];

  return (
    <div className="card p-4">
      <h3
        className="text-sm font-extrabold mb-3"
        style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
      >
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => {
          const Icon = a.Icon;
          return (
            <button
              key={i}
              onClick={a.onClick}
              disabled={a.disabled}
              className="flex flex-col items-start gap-2 p-3 rounded-2xl text-left transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: a.disabled ? "#FFF4E6" : a.bg,
                color: a.disabled ? "#FB923C" : "white",
                border: a.disabled ? "1.5px solid #FED7AA" : "none",
                boxShadow: a.disabled ? "none" : "0 3px 10px rgba(0,0,0,.12)",
              }}
            >
              <Icon size={18} strokeWidth={2} />
              <div>
                <p
                  className="text-xs font-extrabold leading-none"
                  style={{ fontFamily: "'Baloo 2', cursive" }}
                >
                  {a.label}
                </p>
                <p className="text-xs mt-0.5 font-medium opacity-80">
                  {a.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
