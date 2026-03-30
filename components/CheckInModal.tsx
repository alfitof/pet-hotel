"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
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
    if (!petName.trim()) return setError("Pet name is required!");
    if (!ownerName.trim()) return setError("Owner name is required!");
    if (!petType) return setError("Please select a pet avatar!");
    setError("");
    onConfirm({
      petName: petName.trim(),
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim() || undefined,
      petType,
      checkIn: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
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
      style={{ backgroundColor: "rgba(120,53,15,.3)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl anim-pop-in overflow-hidden"
        style={{
          backgroundColor: "#FFFBF5",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#FB923C,#C2410C)" }}
        >
          <div>
            <h2
              className="text-lg font-extrabold text-white"
              style={{ fontFamily: "'Baloo 2', cursive" }}
            >
              Check-In — Room {slotId}
            </h2>
            <p className="text-sm text-white/75 font-semibold">
              Fill in your pet's details
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <PetTypeSelector
            petTypes={petTypes}
            selected={petType}
            onSelect={setPetType}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Pet Name"
              placeholder="e.g. Mochi"
              value={petName}
              onChange={setPetName}
            />
            <Field
              label="Owner Name"
              placeholder="e.g. John"
              value={ownerName}
              onChange={setOwnerName}
            />
          </div>
          <Field
            label="Owner Phone (optional)"
            placeholder="e.g. 0812-xxxx-xxxx"
            value={ownerPhone}
            onChange={setOwnerPhone}
          />

          <div>
            <label
              className="block text-sm font-extrabold mb-2"
              style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
            >
              Stay Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{
                    backgroundColor: duration === d ? "#F97316" : "#FFEDD5",
                    color: duration === d ? "white" : "#C2410C",
                    fontFamily: "'Baloo 2', cursive",
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-extrabold mb-2"
              style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
            >
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Likes wet food, scared of loud noises..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-2xl border-2 text-sm resize-none outline-none transition-all"
              style={{
                borderColor: "#FED7AA",
                fontFamily: "'Nunito', sans-serif",
                color: "#431407",
                backgroundColor: "white",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#FB923C";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#FED7AA";
              }}
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl"
              style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
            >
              <AlertCircle size={14} strokeWidth={2} />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              onClick={submit}
              className="btn-primary flex-1"
              style={{ borderRadius: "14px", padding: "10px 16px" }}
            >
              Confirm Check-In ✓
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
        style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-2xl border-2 text-sm outline-none transition-all"
        style={{
          borderColor: "#FED7AA",
          fontFamily: "'Nunito', sans-serif",
          color: "#431407",
          backgroundColor: "white",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#FB923C";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#FED7AA";
        }}
      />
    </div>
  );
}
