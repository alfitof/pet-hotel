"use client";

import { Plus } from "lucide-react";
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
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3
            className="text-sm font-extrabold"
            style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
          >
            Pet Rooms
          </h3>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: "#FB923C" }}
          >
            {occupied} / {slots.length} occupied
          </p>
        </div>
        <button
          onClick={onAddSlot}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add Room
        </button>
      </div>

      <div
        className="h-1.5 rounded-full overflow-hidden mb-5"
        style={{ backgroundColor: "#FFEDD5" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width:
              slots.length === 0 ? "0%" : `${(occupied / slots.length) * 100}%`,
            background: "linear-gradient(90deg,#FDBA74,#F97316,#C2410C)",
          }}
        />
      </div>

      {slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center anim-float"
            style={{ backgroundColor: "#FFEDD5" }}
          >
            <Plus size={28} color="#F97316" strokeWidth={2} />
          </div>
          <div className="text-center">
            <p
              className="text-sm font-extrabold mb-1"
              style={{ color: "#C2410C", fontFamily: "'Baloo 2', cursive" }}
            >
              No rooms yet
            </p>
            <p className="text-xs font-semibold" style={{ color: "#FB923C" }}>
              Add your first room to get started
            </p>
          </div>
          <button onClick={onAddSlot} className="btn-primary mt-1">
            Add First Room
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-around">
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

          <div
            className="flex flex-col items-center justify-center cursor-pointer group transition-all hover:scale-104"
            style={{ width: "120px" }}
            onClick={onAddSlot}
          >
            <div
              className="w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-10 transition-all group-hover:border-orange-400 group-hover:bg-orange-50"
              style={{ borderColor: "#FED7AA", backgroundColor: "#FFF7ED" }}
            >
              <Plus
                size={22}
                color="#FDBA74"
                strokeWidth={2}
                className="group-hover:text-orange-400 transition-colors"
              />
              <span
                className="text-xs font-bold text-center"
                style={{ color: "#FDBA74", fontFamily: "'Baloo 2', cursive" }}
              >
                New Room
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
