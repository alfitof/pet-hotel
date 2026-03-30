"use client";

import { useState } from "react";
import Image from "next/image";
import { LogIn, Trash2, LogOut, Info, X } from "lucide-react";
import { CargoSlot as CargoSlotType } from "@/lib/types";
import { PET_BOTTOM_OFFSET } from "@/lib/petTypes";

interface Props {
  slot: CargoSlotType;
  onCheckIn: () => void;
  onCheckOut: () => void;
  onDeleteEmpty: () => void;
  isNew?: boolean;
}

export default function CargoSlot({
  slot,
  onCheckIn,
  onCheckOut,
  onDeleteEmpty,
  isNew,
}: Props) {
  const [showDetail, setShowDetail] = useState(false);
  const [petImgErr, setPetImgErr] = useState(false);
  const isEmpty = slot.pet === null;

  const petBottom = slot.pet
    ? (PET_BOTTOM_OFFSET[slot.pet.petType.id] ?? 30)
    : 30;

  return (
    <div
      className={`flex flex-col items-center gap-1.5 group relative ${isNew ? "anim-pop-in" : ""}`}
      style={{ width: "120px" }}
    >
      <div
        className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
        style={{
          backgroundColor: isEmpty ? "#FFEDD5" : "#FB923C",
          color: isEmpty ? "#C2410C" : "white",
          fontFamily: "'Baloo 2', cursive",
        }}
      >
        {isEmpty ? "Room" : "🐾"} {slot.id}
      </div>

      <div
        className="cargo-wrap relative cursor-pointer"
        style={{ width: "110px", height: "140px" }}
        onClick={() => (isEmpty ? onCheckIn() : setShowDetail((v) => !v))}
      >
        <Image
          src="/assets/cargo-base.svg"
          alt="cargo"
          fill
          className="object-contain"
          style={{ zIndex: 1 }}
          priority
        />

        {!isEmpty && slot.pet && !petImgErr && (
          <div
            key={slot.id + "-" + slot.pet.checkInTimestamp}
            className="absolute anim-bounce-in"
            style={{
              zIndex: 2,
              bottom: `${petBottom}px`,
              left: "46%",
              transform: "translateX(-50%)",
              width: "43px",
              height: "60px",
            }}
          >
            <Image
              src={slot.pet.petType.petImage}
              alt={slot.pet.petName}
              fill
              className="object-contain"
              onError={() => setPetImgErr(true)}
            />
          </div>
        )}

        {!isEmpty && slot.pet && petImgErr && (
          <div
            className="absolute flex items-center justify-center text-4xl"
            style={{
              zIndex: 2,
              bottom: `${petBottom}px`,
              left: "46%",
              transform: "translateX(-50%)",
              width: "43px",
              height: "60px",
            }}
          >
            {slot.pet.petType.species === "dog" ? "🐶" : "🐱"}
          </div>
        )}

        <Image
          src="/assets/cargo-bars.svg"
          alt="bars"
          fill
          className="object-contain"
          style={{ zIndex: 3 }}
        />

        {isEmpty && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
            style={{ zIndex: 4, background: "rgba(249,115,22,.12)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F97316" }}
            >
              <LogIn size={16} color="white" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="w-full flex flex-col gap-1">
          <button
            onClick={onCheckIn}
            className="w-full py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1"
            style={{
              backgroundColor: "#FFEDD5",
              color: "#EA580C",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            <LogIn size={11} strokeWidth={2.5} /> Check-In
          </button>
          <button
            onClick={onDeleteEmpty}
            className="w-full py-1 rounded-xl text-xs font-bold transition-all opacity-0 group-hover:opacity-70 hover:!opacity-100 flex items-center justify-center gap-1"
            style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
          >
            <Trash2 size={10} strokeWidth={2} /> Delete
          </button>
        </div>
      ) : (
        <div className="w-full text-center">
          <p
            className="text-xs font-extrabold truncate"
            style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
          >
            {slot.pet!.petName}
          </p>
          <p
            className="text-xs font-semibold truncate"
            style={{ color: "#FB923C" }}
          >
            {slot.pet!.petType.name}
          </p>
          <div className="flex gap-1 mt-1.5">
            <button
              onClick={() => setShowDetail((v) => !v)}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 flex items-center justify-center gap-1"
              style={{ backgroundColor: "#FFEDD5", color: "#EA580C" }}
            >
              <Info size={10} strokeWidth={2} />
            </button>
            <button
              onClick={onCheckOut}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1"
              style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                fontFamily: "'Baloo 2', cursive",
              }}
            >
              <LogOut size={10} strokeWidth={2} /> Out
            </button>
          </div>
        </div>
      )}

      {showDetail && slot.pet && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 p-3 rounded-2xl shadow-xl anim-slide-up"
          style={{
            backgroundColor: "white",
            border: "1.5px solid #FED7AA",
            color: "#431407",
            fontFamily: "'Nunito', sans-serif",
            minWidth: "170px",
            whiteSpace: "nowrap",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-sm font-extrabold"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              {slot.pet.petType.species === "dog" ? "🐶" : "🐱"}{" "}
              {slot.pet.petName}
            </p>
            <button
              onClick={() => setShowDetail(false)}
              className="opacity-40 hover:opacity-100 transition-opacity"
            >
              <X size={12} strokeWidth={2} />
            </button>
          </div>
          <div
            className="flex flex-col gap-1 text-xs font-semibold"
            style={{ color: "#9A3412" }}
          >
            <p>Owner: {slot.pet.ownerName}</p>
            {slot.pet.ownerPhone && <p>Phone: {slot.pet.ownerPhone}</p>}
            <p>Check-in: {slot.pet.checkIn}</p>
            <p>
              Duration: {slot.pet.duration} day
              {slot.pet.duration > 1 ? "s" : ""}
            </p>
            {slot.pet.notes && (
              <p className="italic opacity-70">"{slot.pet.notes}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
