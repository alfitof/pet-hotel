"use client";

import CargoSlot from "@/components/CargoSlot";
import { CargoSlot as CargoSlotType } from "@/lib/types";

interface Props {
  slots: CargoSlotType[];
  newSlotIds: Set<number>;
  onCheckIn: (id: number) => void;
  onCheckOut: (id: number) => void;
  onDeleteEmpty: (id: number) => void;
  onAddSlot: () => void;
}

export default function CargoGrid({
  slots,
  newSlotIds,
  onCheckIn,
  onCheckOut,
  onDeleteEmpty,
  onAddSlot,
}: Props) {
  const occupied = slots.filter((s) => s.pet).length;

  return (
    <div
      className="rounded-3xl p-5"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,.06)",
        border: "2px solid var(--color-o100)",
      }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-base font-extrabold flex items-center gap-2"
          style={{
            color: "var(--color-o800)",
            fontFamily: "'Baloo 2', cursive",
          }}
        >
          <span>🏠</span> Kamar Pet Hotel
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full ml-1"
            style={{
              backgroundColor: "var(--color-o100)",
              color: "var(--color-o600)",
            }}
          >
            {occupied}/{slots.length} terisi
          </span>
        </h3>
        <button
          onClick={onAddSlot}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background:
              "linear-gradient(135deg, var(--color-o500), var(--color-o700))",
            boxShadow: "0 3px 10px rgba(249,115,22,.35)",
            fontFamily: "'Baloo 2', cursive",
          }}
        >
          <span>+</span> Tambah Kamar
        </button>
      </div>

      {/* Progress bar hunian */}
      <div className="mb-5">
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-o100)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width:
                slots.length === 0
                  ? "0%"
                  : `${(occupied / slots.length) * 100}%`,
              background:
                "linear-gradient(90deg, var(--color-o300), var(--color-o500), var(--color-o700))",
            }}
          />
        </div>
      </div>

      {/* Empty state */}
      {slots.length === 0 ? (
        <div className="text-center py-14">
          <div className="text-6xl mb-3 anim-float inline-block">🏨</div>
          <h4
            className="text-lg font-extrabold mb-1"
            style={{
              color: "var(--color-o700)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            Belum ada kamar!
          </h4>
          <p className="text-sm mb-4" style={{ color: "var(--color-o400)" }}>
            Tambahkan kamar pertama untuk memulai 🐾
          </p>
          <button
            onClick={onAddSlot}
            className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--color-o500), var(--color-o700))",
              boxShadow: "0 4px 14px rgba(249,115,22,.4)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            + Tambah Kamar Pertama!
          </button>
        </div>
      ) : (
        /* Cargo grid */
        <div className="flex flex-wrap gap-4 justify-start stagger">
          {slots.map((slot) => (
            <CargoSlot
              key={slot.id}
              slot={slot}
              isNew={newSlotIds.has(slot.id)}
              onCheckIn={() => onCheckIn(slot.id)}
              onCheckOut={() => onCheckOut(slot.id)}
              onDeleteEmpty={() => onDeleteEmpty(slot.id)}
            />
          ))}

          {/* Tambah slot card */}
          <div
            className="flex flex-col items-center justify-center cursor-pointer group transition-all hover:scale-105"
            style={{ width: "130px" }}
            onClick={onAddSlot}
          >
            <div
              className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-10 transition-all group-hover:border-orange-400"
              style={{
                borderColor: "var(--color-o200)",
                backgroundColor: "var(--color-o50)",
              }}
            >
              <span
                className="text-3xl font-light transition-transform group-hover:scale-125"
                style={{ color: "var(--color-o300)" }}
              >
                +
              </span>
              <span
                className="text-xs font-bold text-center"
                style={{
                  color: "var(--color-o400)",
                  fontFamily: "'Baloo 2', cursive",
                }}
              >
                Kamar Baru
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
