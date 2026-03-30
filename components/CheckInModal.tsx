"use client";

import { useState } from "react";
import PetTypeSelector from "./PetTypeSelector";
import { PetType, BookedPet } from "@/lib/types";

interface Props {
  slotId: number;
  petTypes: PetType[];
  onConfirm: (pet: BookedPet) => void;
  onClose: () => void;
}

const DURATIONS = [1, 2, 3, 5, 7, 10, 14, 30];

export default function CheckInModal({
  slotId,
  petTypes,
  onConfirm,
  onClose,
}: Props) {
  const [petName, setPetName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [petType, setPetType] = useState<PetType | null>(null);
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!petName.trim()) return setError("Nama pet wajib diisi! 🐾");
    if (!ownerName.trim()) return setError("Nama pemilik wajib diisi!");
    if (!petType) return setError("Pilih jenis pet dulu ya! 😊");
    setError("");
    onConfirm({
      petName: petName.trim(),
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim() || undefined,
      petType,
      checkIn: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      checkInTimestamp: Date.now(),
      duration,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      style={{ backgroundColor: "rgba(124,45,18,.35)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-3xl shadow-2xl anim-pop-in overflow-hidden"
        style={{
          backgroundColor: "var(--color-warm)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 relative"
          style={{
            background:
              "linear-gradient(135deg, var(--color-o500), var(--color-o800))",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl anim-wiggle">🏨</span>
            <div>
              <h2
                className="text-xl font-extrabold text-white"
                style={{ fontFamily: "'Baloo 2', cursive" }}
              >
                Check-In — Kamar {slotId}
              </h2>
              <p className="text-sm text-white/70">
                Isi data pet kesayanganmu 🐾
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <PetTypeSelector
            petTypes={petTypes}
            selected={petType}
            onSelect={setPetType}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="🐾 Nama Pet"
              placeholder="cth: Mochi"
              value={petName}
              onChange={setPetName}
            />
            <Field
              label="👤 Nama Pemilik"
              placeholder="cth: Budi"
              value={ownerName}
              onChange={setOwnerName}
            />
          </div>
          <Field
            label="📞 No. HP Pemilik (opsional)"
            placeholder="cth: 0812-xxxx-xxxx"
            value={ownerPhone}
            onChange={setOwnerPhone}
          />

          {/* Durasi */}
          <div>
            <label
              className="block text-sm font-extrabold mb-2"
              style={{
                color: "var(--color-o800)",
                fontFamily: "'Baloo 2', cursive",
              }}
            >
              📅 Durasi Menginap
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className="px-3 py-1.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    backgroundColor:
                      duration === d
                        ? "var(--color-o500)"
                        : "var(--color-o100)",
                    color: duration === d ? "white" : "var(--color-o600)",
                    fontFamily: "'Baloo 2', cursive",
                  }}
                >
                  {d}h
                </button>
              ))}
            </div>
          </div>

          {/* Catatan */}
          <div>
            <label
              className="block text-sm font-extrabold mb-2"
              style={{
                color: "var(--color-o800)",
                fontFamily: "'Baloo 2', cursive",
              }}
            >
              📝 Catatan (opsional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="cth: Suka makan basah, takut bunyi keras..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl border-2 text-sm resize-none outline-none transition-all focus:border-orange-400"
              style={{
                borderColor: "var(--color-o200)",
                fontFamily: "'Nunito', sans-serif",
                color: "var(--color-o800)",
                backgroundColor: "white",
              }}
            />
          </div>

          {error && (
            <p
              className="text-center text-sm font-bold py-2 px-4 rounded-2xl"
              style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--color-o100)",
                color: "var(--color-o700)",
                fontFamily: "'Baloo 2', cursive",
              }}
            >
              Batal
            </button>
            <button
              onClick={submit}
              className="flex-1 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-o500), var(--color-o700))",
                fontFamily: "'Baloo 2', cursive",
                boxShadow: "0 6px 20px rgba(249,115,22,.45)",
              }}
            >
              ✓ Check-In Sekarang! 🐾
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        className="block text-sm font-extrabold mb-1.5"
        style={{ color: "var(--color-o800)", fontFamily: "'Baloo 2', cursive" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-2xl border-2 text-sm outline-none transition-all focus:border-orange-400"
        style={{
          borderColor: "var(--color-o200)",
          fontFamily: "'Nunito', sans-serif",
          color: "var(--color-o800)",
          backgroundColor: "white",
        }}
      />
    </div>
  );
}
