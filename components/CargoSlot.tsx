"use client";

import { useState } from "react";
import Image from "next/image";
import { CargoSlot as CargoSlotType } from "@/lib/types";

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
  const [petImgError, setPetImgError] = useState(false);
  const isEmpty = slot.pet === null;

  return (
    <div
      className={`flex flex-col items-center gap-2 group relative ${isNew ? "anim-pop-in" : ""}`}
      style={{ width: "130px" }}
    >
      {/* Status badge */}
      <div
        className="text-xs font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1"
        style={{
          backgroundColor: isEmpty ? "var(--color-o100)" : "var(--color-o500)",
          color: isEmpty ? "var(--color-o600)" : "white",
          fontFamily: "'Baloo 2', cursive",
        }}
      >
        {isEmpty ? "🔑" : "😺"} {`K.${slot.id}`}
      </div>

      {/* Cargo — 3-layer stack */}
      <div
        className="cargo-wrap relative cursor-pointer"
        style={{ width: "120px", height: "150px" }}
        onClick={() => (isEmpty ? onCheckIn() : setShowDetail((v) => !v))}
      >
        {/* Layer 1 — base */}
        <Image
          src="/assets/cargo-base.svg"
          alt="cargo"
          fill
          className="object-contain"
          style={{ zIndex: 1 }}
          priority
        />

        {/* Layer 2 — pet (between layers) */}
        {!isEmpty && slot.pet && (
          <div
            key={slot.id + "-" + slot.pet.checkInTimestamp}
            className="absolute anim-bounce-in"
            style={{
              zIndex: 2,
              bottom: "30px",
              left: "45%",
              transform: "translateX(-50%)",
              width: "48px",
              height: "65px",
            }}
          >
            {!petImgError ? (
              <Image
                src={slot.pet.petType.petImage}
                alt={slot.pet.petName}
                fill
                className="object-contain"
                onError={() => setPetImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                {slot.pet.petType.emoji}
              </div>
            )}
          </div>
        )}

        {/* Layer 3 — bars/grille (foreground) */}
        <Image
          src="/assets/cargo-bars.svg"
          alt="cargo bars"
          fill
          className="object-contain"
          style={{ zIndex: 3 }}
        />

        {/* Hover overlay kosong */}
        {isEmpty && (
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
            style={{ zIndex: 4, background: "rgba(249,115,22,.15)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xl text-white shadow-lg"
              style={{ backgroundColor: "var(--color-o500)" }}
            >
              +
            </div>
          </div>
        )}
      </div>

      {/* Pet info / actions */}
      {isEmpty ? (
        <div className="w-full flex flex-col gap-1">
          <button
            onClick={onCheckIn}
            className="w-full py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-o200)",
              color: "var(--color-o700)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            + Check-In
          </button>
          <button
            onClick={onDeleteEmpty}
            className="w-full py-1 rounded-xl text-xs font-bold transition-all opacity-0 group-hover:opacity-60 hover:!opacity-100"
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            🗑 Hapus
          </button>
        </div>
      ) : (
        <div className="w-full text-center">
          <p
            className="text-xs font-extrabold truncate"
            style={{
              color: "var(--color-o800)",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            {slot.pet!.petName}
          </p>
          <p
            className="text-xs opacity-60 truncate"
            style={{ color: "var(--color-o700)" }}
          >
            {slot.pet!.petType.name} · {slot.pet!.duration}h
          </p>
          <button
            onClick={onCheckOut}
            className="mt-1 w-full py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            Check-Out 👋
          </button>
        </div>
      )}

      {/* Detail tooltip */}
      {showDetail && slot.pet && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 p-3 rounded-2xl shadow-xl text-xs anim-slide-up whitespace-nowrap"
          style={{
            backgroundColor: "white",
            border: "2px solid var(--color-o200)",
            color: "var(--color-o800)",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <p
            className="font-extrabold text-sm"
            style={{ fontFamily: "'Baloo 2', cursive" }}
          >
            {slot.pet.petType.emoji} {slot.pet.petName}
          </p>
          <p>👤 {slot.pet.ownerName}</p>
          {slot.pet.ownerPhone && <p>📞 {slot.pet.ownerPhone}</p>}
          <p>📅 Masuk: {slot.pet.checkIn}</p>
          <p>🌙 {slot.pet.duration} hari</p>
          {slot.pet.notes && (
            <p className="mt-1 italic opacity-70">📝 {slot.pet.notes}</p>
          )}
          <button
            onClick={() => setShowDetail(false)}
            className="mt-2 w-full text-center opacity-50 hover:opacity-100 text-xs"
          >
            Tutup ✕
          </button>
        </div>
      )}
    </div>
  );
}
