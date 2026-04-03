"use client";

import Image from "next/image";
import { useState } from "react";
import { PetType, PetSpecies } from "@/lib/types";

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
  const [species, setSpecies] = useState<PetSpecies>("dog");

  const filtered = petTypes.filter((p) => p.species === species);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label
          className="block text-sm font-extrabold mb-2"
          style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
        >
          Pet Type
        </label>
        <div className="flex gap-2">
          {(["dog", "cat"] as PetSpecies[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpecies(s)}
              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: species === s ? "#F97316" : "#FFF4E6",
                color: species === s ? "white" : "#C2410C",
                border: `1.5px solid ${species === s ? "#F97316" : "#FED7AA"}`,
                fontFamily: "'Baloo 2', cursive",
              }}
            >
              <span>{s === "dog" ? "🐶" : "🐱"}</span>
              <span>{s === "dog" ? "Dog" : "Cat"}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-bold mb-2"
          style={{ color: "#9A3412" }}
        >
          Choose Avatar
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
          }}
        >
          {filtered.map((pet) => {
            const sel = selected?.id === pet.id;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => onSelect(pet)}
                className="flex flex-col items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
              >
                <div
                  style={{
                    position: "relative",
                    width: "52px",
                    height: "52px",
                    flexShrink: 0,
                    transition: "all .2s ease",
                    filter: sel
                      ? "drop-shadow(0 4px 8px rgba(249,115,22,.5))"
                      : "none",
                    transform: sel ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {!errors[pet.id] ? (
                    <Image
                      src={pet.headImage}
                      alt={pet.name}
                      fill
                      className="object-contain"
                      onError={() =>
                        setErrors((p) => ({ ...p, [pet.id]: true }))
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {pet.species === "dog" ? "🐶" : "🐱"}
                    </div>
                  )}

                  {sel && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#F97316",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(249,115,22,.5)",
                        border: "1.5px solid white",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "8px",
                          fontWeight: 800,
                        }}
                      >
                        ✓
                      </span>
                    </div>
                  )}
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: sel ? "#EA580C" : "#9A3412",
                    fontFamily: "'Nunito', sans-serif",
                    textAlign: "center",
                    transition: "color .2s ease",
                  }}
                >
                  {pet.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
