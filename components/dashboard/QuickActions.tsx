"use client";

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
      icon: "🏠",
      label: "Tambah Kamar",
      desc: "Buat slot baru",
      onClick: onAddSlot,
      bg: "linear-gradient(135deg, var(--color-o500), var(--color-o700))",
      disabled: false,
    },
    {
      icon: "🐾",
      label: "Check-In",
      desc: "Daftarkan pet baru",
      onClick: onCheckInFirst,
      bg: "linear-gradient(135deg, #16A34A, #15803D)",
      disabled: !emptySlotExists,
    },
    {
      icon: "📞",
      label: "Hubungi Pemilik",
      desc: "WhatsApp blast",
      onClick: () => alert("Fitur segera hadir! 🎉"),
      bg: "linear-gradient(135deg, #0284C7, #0369A1)",
      disabled: false,
    },
    {
      icon: "📊",
      label: "Cetak Laporan",
      desc: "Export PDF",
      onClick: () => alert("Fitur segera hadir! 🎉"),
      bg: "linear-gradient(135deg, #9333EA, #7E22CE)",
      disabled: false,
    },
  ];

  return (
    <div
      className="rounded-3xl p-5"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,.06)",
        border: "2px solid var(--color-o100)",
      }}
    >
      <h3
        className="text-base font-extrabold mb-3 flex items-center gap-2"
        style={{ color: "var(--color-o800)", fontFamily: "'Baloo 2', cursive" }}
      >
        <span>⚡</span> Aksi Cepat
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            disabled={a.disabled}
            className="flex flex-col items-start gap-1 p-3 rounded-2xl text-left transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: a.disabled ? "var(--color-o100)" : a.bg,
              color: a.disabled ? "var(--color-o400)" : "white",
              boxShadow: a.disabled ? "none" : "0 4px 12px rgba(0,0,0,.15)",
            }}
          >
            <span className="text-xl">{a.icon}</span>
            <span
              className="text-xs font-extrabold"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              {a.label}
            </span>
            <span className="text-xs opacity-75">{a.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
