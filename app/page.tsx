"use client";

import { useState, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import StatsRow from "@/components/dashboard/StatsRow";
import CargoGrid from "@/components/dashboard/CargoGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import CheckInModal from "@/components/CheckInModal";

import { CargoSlot, BookedPet, ActivityLog } from "@/lib/types";
import { DEFAULT_PET_TYPES } from "@/lib/petTypes";

let slotCounter = 3;
let logCounter = 0;

const PAGE_META: Record<string, { title: string; emoji: string }> = {
  dashboard: { title: "Dashboard", emoji: "🏠" },
  kamar: { title: "Manajemen Kamar", emoji: "🏨" },
  tamu: { title: "Daftar Tamu", emoji: "🐾" },
  laporan: { title: "Laporan Hotel", emoji: "📊" },
};

type NavPage = "dashboard" | "kamar" | "tamu" | "laporan";

export default function Home() {
  const [slots, setSlots] = useState<CargoSlot[]>([
    { id: 1, pet: null },
    { id: 2, pet: null },
    { id: 3, pet: null },
  ]);
  const [petTypes] = useState(DEFAULT_PET_TYPES);
  const [activePage, setPage] = useState<NavPage>("dashboard");
  const [openSlotId, setOpen] = useState<number | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [newSlotIds, setNewIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const occupied = slots.filter((s) => s.pet !== null).length;

  /* ── utilities ── */
  const addLog = useCallback(
    (type: ActivityLog["type"], message: string, emoji: string) => {
      setLogs((prev) =>
        [
          { id: ++logCounter, type, message, emoji, timestamp: Date.now() },
          ...prev,
        ].slice(0, 30),
      );
    },
    [],
  );

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }, []);

  /* ── actions ── */
  const addSlot = useCallback(() => {
    const id = ++slotCounter;
    setSlots((prev) => [...prev, { id, pet: null }]);
    setNewIds((prev) => {
      const s = new Set(prev);
      s.add(id);
      return s;
    });
    setTimeout(
      () =>
        setNewIds((prev) => {
          const s = new Set(prev);
          s.delete(id);
          return s;
        }),
      800,
    );
    addLog("added", `Kamar ${id} ditambahkan`, "🏠");
    showToast(`🏠 Kamar ${id} berhasil ditambahkan!`, true);
  }, [addLog, showToast]);

  const deleteEmpty = useCallback(
    (id: number) => {
      setSlots((prev) => prev.filter((s) => !(s.id === id && s.pet === null)));
      addLog("removed", `Kamar ${id} dihapus`, "🗑");
      showToast(`🗑 Kamar ${id} dihapus.`, false);
    },
    [addLog, showToast],
  );

  const handleConfirm = useCallback(
    (pet: BookedPet) => {
      if (openSlotId === null) return;
      setSlots((prev) =>
        prev.map((s) => (s.id === openSlotId ? { ...s, pet } : s)),
      );
      addLog(
        "checkin",
        `${pet.petName} (${pet.petType.name}) check-in di Kamar ${openSlotId}`,
        "🎉",
      );
      showToast(
        `🎉 ${pet.petName} berhasil check-in di Kamar ${openSlotId}!`,
        true,
      );
      setOpen(null);
    },
    [openSlotId, addLog, showToast],
  );

  const handleCheckOut = useCallback(
    (id: number) => {
      setSlots((prev) => {
        const pet = prev.find((s) => s.id === id)?.pet;
        if (pet) {
          addLog("checkout", `${pet.petName} check-out dari Kamar ${id}`, "👋");
          showToast(
            `👋 ${pet.petName} sudah check-out. Sampai jumpa lagi!`,
            false,
          );
        }
        return prev.map((s) => (s.id === id ? { ...s, pet: null } : s));
      });
    },
    [addLog, showToast],
  );

  /* ── first empty slot ── */
  const firstEmpty = slots.find((s) => s.pet === null);
  const checkInFirst = useCallback(() => {
    if (firstEmpty) setOpen(firstEmpty.id);
  }, [firstEmpty]);

  const meta = PAGE_META[activePage];

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setPage}
        totalSlots={slots.length}
        occupiedCount={occupied}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <TopBar
          pageTitle={meta.title}
          pageEmoji={meta.emoji}
          onAddSlot={addSlot}
          occupiedCount={occupied}
        />

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* ── DASHBOARD page ── */}
          {activePage === "dashboard" && (
            <>
              {/* Welcome banner */}
              <WelcomeBanner
                occupiedCount={occupied}
                totalSlots={slots.length}
              />

              {/* Stats */}
              <StatsRow slots={slots} />

              {/* Main 2-col layout */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Cargo grid — takes 2/3 */}
                <div className="xl:col-span-2">
                  <CargoGrid
                    slots={slots}
                    newSlotIds={newSlotIds}
                    onCheckIn={(id) => setOpen(id)}
                    onCheckOut={handleCheckOut}
                    onDeleteEmpty={deleteEmpty}
                    onAddSlot={addSlot}
                  />
                </div>

                {/* Right sidebar panel */}
                <div className="flex flex-col gap-5">
                  <QuickActions
                    onAddSlot={addSlot}
                    onCheckInFirst={checkInFirst}
                    emptySlotExists={!!firstEmpty}
                  />
                  <ActivityFeed logs={logs} />
                </div>
              </div>
            </>
          )}

          {/* ── KAMAR page ── */}
          {activePage === "kamar" && (
            <div className="flex flex-col gap-5">
              <StatsRow slots={slots} />
              <CargoGrid
                slots={slots}
                newSlotIds={newSlotIds}
                onCheckIn={(id) => setOpen(id)}
                onCheckOut={handleCheckOut}
                onDeleteEmpty={deleteEmpty}
                onAddSlot={addSlot}
              />
            </div>
          )}

          {/* ── TAMU page ── */}
          {activePage === "tamu" && (
            <GuestList slots={slots} onCheckOut={handleCheckOut} />
          )}

          {/* ── LAPORAN page ── */}
          {activePage === "laporan" && <ReportPage slots={slots} logs={logs} />}
        </main>
      </div>

      {/* Modal */}
      {openSlotId !== null && (
        <CheckInModal
          slotId={openSlotId}
          petTypes={petTypes}
          onConfirm={handleConfirm}
          onClose={() => setOpen(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          key={toast.msg}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl anim-slide-up font-bold text-sm text-white max-w-xs"
          style={{
            background: toast.ok
              ? "linear-gradient(135deg, var(--color-o500), var(--color-o700))"
              : "linear-gradient(135deg, #16A34A, #15803D)",
            fontFamily: "'Baloo 2', cursive",
            boxShadow: "0 8px 28px rgba(0,0,0,.2)",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function WelcomeBanner({
  occupiedCount,
  totalSlots,
}: {
  occupiedCount: number;
  totalSlots: number;
}) {
  const hour = new Date().getHours();
  const greeting =
    hour < 11
      ? "Selamat Pagi"
      : hour < 15
        ? "Selamat Siang"
        : hour < 19
          ? "Selamat Sore"
          : "Selamat Malam";

  return (
    <div
      className="rounded-3xl p-5 flex items-center gap-5 relative anim-fade-in"
      style={{
        background:
          "linear-gradient(135deg, var(--color-o500) 0%, var(--color-o800) 100%)",
        boxShadow: "0 8px 28px rgba(249,115,22,.35)",
      }}
    >
      {/* BG circles */}
      <div
        className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
        style={{ backgroundColor: "white" }}
      />
      <div
        className="absolute -bottom-12 right-20 w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: "white" }}
      />

      <span className="text-5xl anim-float flex-shrink-0">🐾</span>
      <div className="flex-1 relative z-10">
        <p
          className="text-white/70 text-sm font-bold"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {greeting}, Admin!
        </p>
        <h2
          className="text-2xl font-extrabold text-white leading-tight"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          Selamat datang di Pawcation 🏨
        </h2>
        <p className="text-white/80 text-sm mt-1">
          {occupiedCount === 0
            ? "Hotel masih kosong. Siap menerima tamu berbulu! 🐶🐱"
            : `${occupiedCount} dari ${totalSlots} kamar sedang terisi. Hari yang sibuk! ✨`}
        </p>
      </div>
    </div>
  );
}

function GuestList({
  slots,
  onCheckOut,
}: {
  slots: CargoSlot[];
  onCheckOut: (id: number) => void;
}) {
  const occupied = slots.filter((s) => s.pet !== null);
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-3xl p-5"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,.06)",
          border: "2px solid var(--color-o100)",
        }}
      >
        <h3
          className="text-base font-extrabold mb-4 flex items-center gap-2"
          style={{
            color: "var(--color-o800)",
            fontFamily: "'Baloo 2', cursive",
          }}
        >
          🐾 Daftar Tamu Menginap
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-o100)",
              color: "var(--color-o600)",
            }}
          >
            {occupied.length} tamu
          </span>
        </h3>
        {occupied.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <div className="text-5xl mb-2">🌙</div>
            <p style={{ color: "var(--color-o600)" }}>
              Belum ada tamu menginap
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {occupied.map(
              (slot) =>
                slot.pet && (
                  <div
                    key={slot.id}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{
                      backgroundColor: "var(--color-o50)",
                      border: "1.5px solid var(--color-o200)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: "var(--color-o200)" }}
                    >
                      {slot.pet.petType.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-extrabold"
                        style={{
                          color: "var(--color-o800)",
                          fontFamily: "'Baloo 2', cursive",
                        }}
                      >
                        {slot.pet.petName}
                        <span
                          className="text-xs font-normal ml-2 px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "var(--color-o500)",
                            color: "white",
                          }}
                        >
                          Kamar {slot.id}
                        </span>
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-o600)" }}
                      >
                        {slot.pet.petType.name} · Pemilik: {slot.pet.ownerName}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-o400)" }}
                      >
                        Check-in: {slot.pet.checkIn} · {slot.pet.duration} hari
                      </p>
                    </div>
                    <button
                      onClick={() => onCheckOut(slot.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                      style={{
                        backgroundColor: "#FEE2E2",
                        color: "#DC2626",
                        fontFamily: "'Baloo 2', cursive",
                      }}
                    >
                      Check-Out 👋
                    </button>
                  </div>
                ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReportPage({
  slots,
  logs,
}: {
  slots: CargoSlot[];
  logs: ActivityLog[];
}) {
  const occupied = slots.filter((s) => s.pet !== null).length;
  const checkins = logs.filter((l) => l.type === "checkin").length;
  const checkouts = logs.filter((l) => l.type === "checkout").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {[
          {
            label: "Total Check-In",
            value: checkins,
            icon: "📥",
            color: "var(--color-o500)",
          },
          {
            label: "Total Check-Out",
            value: checkouts,
            icon: "📤",
            color: "#16A34A",
          },
          {
            label: "Tamu Saat Ini",
            value: occupied,
            icon: "😺",
            color: "#9333EA",
          },
          {
            label: "Total Kamar",
            value: slots.length,
            icon: "🏨",
            color: "#0284C7",
          },
        ].map((c, i) => (
          <div
            key={i}
            className="rounded-3xl p-4 text-center anim-slide-up"
            style={{
              backgroundColor: "white",
              border: "2px solid var(--color-o100)",
              opacity: 0,
            }}
          >
            <div className="text-3xl mb-2">{c.icon}</div>
            <p
              className="text-3xl font-extrabold"
              style={{ color: c.color, fontFamily: "'Baloo 2', cursive" }}
            >
              {c.value}
            </p>
            <p
              className="text-xs mt-1 font-semibold"
              style={{ color: "var(--color-o600)" }}
            >
              {c.label}
            </p>
          </div>
        ))}
      </div>
      <ActivityFeed logs={logs} />
    </div>
  );
}
