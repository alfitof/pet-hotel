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
              onClick={() => {
                setSpecies(s);
              }}
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
        <div className="flex gap-3">
          {filtered.map((pet) => {
            const sel = selected?.id === pet.id;
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => onSelect(pet)}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border-2 transition-all hover:scale-110 active:scale-95"
                style={{
                  borderColor: sel ? "#F97316" : "#FED7AA",
                  backgroundColor: sel ? "#FFF4E6" : "white",
                  boxShadow: sel
                    ? "0 4px 12px rgba(249,115,22,.3)"
                    : "0 1px 4px rgba(0,0,0,.06)",
                  flex: "1",
                }}
              >
                <div
                  className="relative rounded-full overflow-hidden border-2 flex items-center justify-center"
                  style={{
                    width: "52px",
                    height: "52px",
                    borderColor: sel ? "#F97316" : "#FED7AA",
                    backgroundColor: "#FFF7ED",
                  }}
                >
                  {!errors[pet.id] ? (
                    <Image
                      src={pet.headImage}
                      alt={pet.name}
                      fill
                      className="object-cover"
                      onError={() =>
                        setErrors((p) => ({ ...p, [pet.id]: true }))
                      }
                    />
                  ) : (
                    <span className="text-2xl">
                      {pet.species === "dog" ? "🐶" : "🐱"}
                    </span>
                  )}
                </div>
                <span
                  className="text-center font-bold leading-tight"
                  style={{
                    color: sel ? "#EA580C" : "#9A3412",
                    fontSize: "10px",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  {pet.name}
                </span>
                {sel && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#F97316" }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontSize: "9px",
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
