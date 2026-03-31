"use client";

import { useState, useCallback, useRef } from "react";
import Sidebar, { NavPage } from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import StatsRow from "@/components/dashboard/StatsRow";
import CargoGrid from "@/components/dashboard/CargoGrid";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";
import CheckInModal from "@/components/CheckInModal";
import { CargoSlot, BookedPet, ActivityLog } from "@/lib/types";
import { DEFAULT_PET_TYPES } from "@/lib/petTypes";
import {
  LogIn,
  LogOut,
  PawPrint,
  Users,
  Building2,
  BarChart3,
} from "lucide-react";

const INITIAL_SLOTS: CargoSlot[] = [
  { id: 1, pet: null },
  { id: 2, pet: null },
  { id: 3, pet: null },
];

export default function DashboardPage() {
  const slotCounter = useRef(3);
  const logCounter = useRef(0);

  const [slots, setSlots] = useState<CargoSlot[]>(INITIAL_SLOTS);
  const [activePage, setPage] = useState<NavPage>("dashboard");
  const [openSlotId, setOpen] = useState<number | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [newSlotIds, setNewIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const petTypes = DEFAULT_PET_TYPES;
  const occupied = slots.filter((s) => s.pet !== null).length;

  const addLog = useCallback((type: ActivityLog["type"], message: string) => {
    setLogs((prev) =>
      [
        { id: ++logCounter.current, type, message, timestamp: Date.now() },
        ...prev,
      ].slice(0, 40),
    );
  }, []);

  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const addSlot = useCallback(() => {
    const id = ++slotCounter.current;
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
    addLog("added", `Room ${id} added`);
    showToast(`Room ${id} added successfully!`, true);
  }, [addLog, showToast]);

  const deleteEmpty = useCallback(
    (id: number) => {
      setSlots((prev) => prev.filter((s) => !(s.id === id && s.pet === null)));
      addLog("removed", `Room ${id} removed`);
      showToast(`Room ${id} removed.`, false);
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
        `${pet.petName} (${pet.petType.name}) checked in to Room ${openSlotId}`,
      );
      showToast(`${pet.petName} checked in to Room ${openSlotId}!`, true);
      setOpen(null);
    },
    [openSlotId, addLog, showToast],
  );

  const handleCheckOut = useCallback(
    (id: number) => {
      setSlots((prev) => {
        const pet = prev.find((s) => s.id === id)?.pet;
        if (pet) {
          addLog("checkout", `${pet.petName} checked out from Room ${id}`);
          showToast(`${pet.petName} checked out. See you next time!`, false);
        }
        return prev.map((s) => (s.id === id ? { ...s, pet: null } : s));
      });
    },
    [addLog, showToast],
  );

  const firstEmpty = slots.find((s) => s.pet === null);
  const checkInFirst = useCallback(() => {
    if (firstEmpty) setOpen(firstEmpty.id);
  }, [firstEmpty]);

  return (
    <div
      className="flex h-screen overflow-hidden w-screen max-w-full"
      style={{ backgroundColor: "var(--color-sand)" }}
    >
      <Sidebar
        activePage={activePage}
        onNavigate={setPage}
        totalSlots={slots.length}
        occupiedCount={occupied}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0 w-0">
        <TopBar
          activePage={activePage}
          onAddSlot={addSlot}
          occupiedCount={occupied}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-5 flex flex-col gap-4 overflow-x-hidden">
          {activePage === "dashboard" && (
            <>
              <WelcomeBanner
                occupiedCount={occupied}
                totalSlots={slots.length}
              />
              <StatsRow slots={slots} />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
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
                <div className="flex flex-col gap-4">
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

          {activePage === "rooms" && (
            <div className="flex flex-col gap-4">
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

          {activePage === "guests" && (
            <GuestsPage slots={slots} onCheckOut={handleCheckOut} />
          )}

          {activePage === "reports" && (
            <ReportsPage slots={slots} logs={logs} />
          )}
        </main>
      </div>

      {openSlotId !== null && (
        <CheckInModal
          slotId={openSlotId}
          petTypes={petTypes}
          onConfirm={handleConfirm}
          onClose={() => setOpen(null)}
        />
      )}

      {toast && (
        <div
          key={toast.msg + toast.ok}
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl anim-slide-up text-sm font-bold text-white max-w-xs"
          style={{
            background: toast.ok
              ? "linear-gradient(135deg,#FB923C,#EA580C)"
              : "linear-gradient(135deg,#34D399,#059669)",
            fontFamily: "'Baloo 2', cursive",
            boxShadow: "0 6px 24px rgba(0,0,0,.15)",
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
  const h = new Date().getHours();
  const greeting =
    h < 11
      ? "Good Morning"
      : h < 15
        ? "Good Afternoon"
        : h < 19
          ? "Good Evening"
          : "Good Night";

  return (
    <div
      className="rounded-3xl p-5 flex items-center gap-4 relative anim-fade-in"
      style={{
        background:
          "linear-gradient(135deg,#FB923C 0%,#F97316 40%,#EA580C 100%)",
        boxShadow: "0 6px 24px rgba(249,115,22,.35)",
      }}
    >
      <div
        className="absolute -top-6 -right-6 w-36 h-36 rounded-full opacity-10"
        style={{ backgroundColor: "white" }}
      />
      <div
        className="absolute -bottom-10 right-24 w-28 h-28 rounded-full opacity-10"
        style={{ backgroundColor: "white" }}
      />

      <div
        className="w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0 anim-float"
        style={{ backgroundColor: "rgba(255,255,255,.25)" }}
      >
        <PawPrint size={28} color="white" strokeWidth={2} />
      </div>

      <div className="flex-1 relative z-10">
        <p className="text-sm font-bold text-white/80">{greeting}, Admin!</p>
        <h2
          className="text-xl font-extrabold text-white leading-tight"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          Welcome to Pawcation 🐾
        </h2>
        <p className="text-sm font-semibold text-white/80 mt-0.5">
          {occupiedCount === 0
            ? "No guests yet. Ready to welcome furry visitors!"
            : `${occupiedCount} of ${totalSlots} rooms occupied. Great day!`}
        </p>
      </div>

      <div
        className="hidden sm:flex flex-col items-center justify-center px-4 py-3 rounded-2xl text-center"
        style={{ backgroundColor: "rgba(255,255,255,.2)", flexShrink: 0 }}
      >
        <span
          className="text-2xl font-extrabold text-white"
          style={{ fontFamily: "'Baloo 2', cursive" }}
        >
          {totalSlots === 0
            ? "0"
            : Math.round((occupiedCount / totalSlots) * 100)}
          %
        </span>
        <span className="text-xs font-bold text-white/75">occupancy</span>
      </div>
    </div>
  );
}

function GuestsPage({
  slots,
  onCheckOut,
}: {
  slots: CargoSlot[];
  onCheckOut: (id: number) => void;
}) {
  const occupied = slots.filter((s) => s.pet !== null);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div
        className="card p-4 flex flex-col"
        style={{
          maxHeight: "calc(100vh - var(--topbar-h) - 40px)",
          overflow: "hidden",
        }}
      >
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h3
              className="text-sm font-extrabold"
              style={{ color: "#431407", fontFamily: "'Baloo 2', cursive" }}
            >
              Current Guests
            </h3>
            <p
              className="text-xs font-semibold mt-0.5"
              style={{ color: "#FB923C" }}
            >
              {occupied.length} pet{occupied.length !== 1 ? "s" : ""} staying
              now
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ backgroundColor: "#FFF4E6", color: "#EA580C" }}
          >
            <Users size={13} strokeWidth={2} />
            <span style={{ fontFamily: "'Baloo 2', cursive" }}>
              {occupied.length} guests
            </span>
          </div>
        </div>

        {occupied.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 opacity-60">
            <PawPrint size={40} color="#FB923C" strokeWidth={1.5} />
            <p className="text-sm font-bold" style={{ color: "#C2410C" }}>
              No guests currently staying
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 overflow-y-auto">
            {occupied.map(
              (slot) =>
                slot.pet && (
                  <div
                    key={slot.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl"
                    style={{
                      backgroundColor: "#FFF7ED",
                      border: "1.5px solid #FED7AA",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: "#FFEDD5" }}
                    >
                      {slot.pet.petType.species === "dog" ? "🐶" : "🐱"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className="text-sm font-extrabold"
                          style={{
                            color: "#431407",
                            fontFamily: "'Baloo 2', cursive",
                          }}
                        >
                          {slot.pet.petName}
                        </p>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "#FB923C", color: "white" }}
                        >
                          Room {slot.id}
                        </span>
                      </div>
                      <p
                        className="text-xs font-semibold mt-0.5"
                        style={{ color: "#C2410C" }}
                      >
                        {slot.pet.petType.name} · Owner: {slot.pet.ownerName}
                      </p>
                      <p
                        className="text-xs font-medium mt-0.5"
                        style={{ color: "#9A3412", opacity: 0.7 }}
                      >
                        Since {slot.pet.checkIn} · {slot.pet.duration} day
                        {slot.pet.duration > 1 ? "s" : ""}
                      </p>
                    </div>

                    <button
                      onClick={() => onCheckOut(slot.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 flex-shrink-0"
                      style={{
                        backgroundColor: "#FEE2E2",
                        color: "#DC2626",
                        fontFamily: "'Baloo 2', cursive",
                      }}
                    >
                      <LogOut size={12} strokeWidth={2} />
                      <span className="hidden sm:inline">Check-Out</span>
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

function ReportsPage({
  slots,
  logs,
}: {
  slots: CargoSlot[];
  logs: ActivityLog[];
}) {
  const occupied = slots.filter((s) => s.pet !== null).length;
  const checkins = logs.filter((l) => l.type === "checkin").length;
  const checkouts = logs.filter((l) => l.type === "checkout").length;
  const rate =
    slots.length === 0 ? 0 : Math.round((occupied / slots.length) * 100);

  return (
    <div
      className="flex flex-col gap-4"
      style={{ height: "calc(100vh - var(--topbar-h) - 40px)", minHeight: 0 }}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger flex-shrink-0">
        {[
          {
            label: "Total Check-Ins",
            value: checkins,
            Icon: LogIn,
            iconBg: "#FFEDD5",
            iconColor: "#EA580C",
            bg: "#FFF7ED",
          },
          {
            label: "Total Check-Outs",
            value: checkouts,
            Icon: LogOut,
            iconBg: "#DCFCE7",
            iconColor: "#059669",
            bg: "#F0FDF4",
          },
          {
            label: "Guests Now",
            value: occupied,
            Icon: PawPrint,
            iconBg: "#FEF3C7",
            iconColor: "#D97706",
            bg: "#FFFBEB",
          },
          {
            label: "Occupancy Rate",
            value: `${rate}%`,
            Icon: BarChart3,
            iconBg: "#DBEAFE",
            iconColor: "#2563EB",
            bg: "#EFF6FF",
          },
        ].map((c, i) => {
          const Icon = c.Icon;
          return (
            <div
              key={i}
              className="card anim-slide-up p-4 text-center flex flex-col items-center gap-2"
              style={{ backgroundColor: c.bg, opacity: 0 }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: c.iconBg }}
              >
                <Icon size={18} color={c.iconColor} strokeWidth={2} />
              </div>
              <p
                className="text-2xl font-extrabold"
                style={{ color: c.iconColor, fontFamily: "'Baloo 2', cursive" }}
              >
                {c.value}
              </p>
              <p
                className="text-xs font-semibold"
                style={{ color: "#9A3412", opacity: 0.7 }}
              >
                {c.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <ActivityFeed logs={logs} fullHeight />
      </div>
    </div>
  );
}
