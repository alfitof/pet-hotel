"use client";

import Image from "next/image";
import { useState } from "react";
import { PetType } from "@/lib/types";

interface Props {
  petTypes: PetType[];
  selected: PetType | null;
  onSelect: (p: PetType) => void;
}

export default function PetTypeSelector({
  petTypes,
  selected,
  onSelect,
}: Props) {
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  return (
    <div>
      <label
        className="block text-sm font-extrabold mb-2"
        style={{ color: "var(--color-o800)", fontFamily: "'Baloo 2', cursive" }}
      >
        🐾 Pilih Jenis Pet
      </label>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))" }}
      >
        {petTypes.map((pet) => {
          const sel = selected?.id === pet.id;
          return (
            <button
              key={pet.id}
              type="button"
              onClick={() => onSelect(pet)}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all hover:scale-110 active:scale-95"
              style={{
                borderColor: sel ? "var(--color-o500)" : "var(--color-o200)",
                backgroundColor: sel ? "var(--color-o100)" : "white",
                boxShadow: sel
                  ? "0 4px 12px rgba(249,115,22,.35)"
                  : "0 2px 6px rgba(0,0,0,.05)",
              }}
            >
              <div
                className="relative w-11 h-11 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{
                  borderColor: sel ? "var(--color-o500)" : "var(--color-o200)",
                  backgroundColor: "var(--color-o50)",
                }}
              >
                {!errors[pet.id] ? (
                  <Image
                    src={pet.headImage}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    onError={() => setErrors((p) => ({ ...p, [pet.id]: true }))}
                  />
                ) : (
                  <span className="text-2xl">{pet.emoji}</span>
                )}
              </div>
              <span
                className="text-center font-bold leading-tight"
                style={{
                  color: sel ? "var(--color-o600)" : "var(--color-o700)",
                  fontSize: "10px",
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {pet.name}
              </span>
              {sel && (
                <span
                  className="text-white rounded-full px-1.5"
                  style={{
                    backgroundColor: "var(--color-o500)",
                    fontSize: "9px",
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
