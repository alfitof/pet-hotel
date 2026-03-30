"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, Hotel, PawPrint, BarChart3, X } from "lucide-react";

export type NavPage = "dashboard" | "rooms" | "guests" | "reports";

interface Props {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  totalSlots: number;
  occupiedCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV = [
  { id: "dashboard" as NavPage, icon: LayoutDashboard, label: "Dashboard" },
  { id: "rooms" as NavPage, icon: Hotel, label: "Rooms" },
  { id: "guests" as NavPage, icon: PawPrint, label: "Guests" },
  { id: "reports" as NavPage, icon: BarChart3, label: "Reports" },
];

export default function Sidebar({
  activePage,
  onNavigate,
  totalSlots,
  occupiedCount,
  mobileOpen,
  onMobileClose,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    NAV.findIndex((n) => n.id === activePage),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [mobileAnimIn, setMobileAnimIn] = useState(false);
  const rippleCounter = useRef(0);

  const occupancy =
    totalSlots === 0 ? 0 : Math.round((occupiedCount / totalSlots) * 100);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setActiveIndex(NAV.findIndex((n) => n.id === activePage));
  }, [activePage]);

  useEffect(() => {
    if (mobileOpen) {
      setMobileVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMobileAnimIn(true));
      });
    } else {
      setMobileAnimIn(false);
      const t = setTimeout(() => setMobileVisible(false), 320);
      return () => clearTimeout(t);
    }
  }, [mobileOpen]);

  const handleNavClick = (
    id: NavPage,
    idx: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      id: ++rippleCounter.current,
    });
    setTimeout(() => setRipple(null), 600);
    setActiveIndex(idx);
    onNavigate(id);
    onMobileClose();
  };

  const sidebarInner = (isMobile = false) => (
    <aside
      style={{
        width: "220px",
        backgroundColor: "#FFF4E6",
        borderRight: "1.5px solid #FED7AA",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg,#FB923C,#F97316,#EA580C)",
          transform: mounted ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: "transform .6s cubic-bezier(.4,0,.2,1)",
        }}
      />

      {/* Header — tingginya sama persis dengan TopBar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 12px",
          height: "var(--topbar-h)",
          borderBottom: "1.5px solid #FED7AA",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            background: "linear-gradient(135deg,#FB923C,#EA580C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            animation: "pawFloat 3s ease-in-out infinite",
            boxShadow: "0 4px 12px rgba(249,115,22,.35)",
          }}
        >
          <PawPrint size={17} color="white" strokeWidth={2.5} />
        </div>

        <div
          style={{
            overflow: "hidden",
            flex: 1,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "17px",
              fontWeight: 800,
              fontFamily: "'Baloo 2', cursive",
              background:
                "linear-gradient(90deg,#F97316,#FB923C,#EA580C,#F97316)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Pawcation
          </span>
          <span
            style={{
              display: "block",
              fontSize: "11px",
              fontWeight: 600,
              color: "#C2410C",
              opacity: 0.65,
              marginTop: "-1px",
            }}
          >
            Pet Hotel
          </span>
        </div>

        {isMobile && (
          <button
            onClick={onMobileClose}
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "8px",
              border: "1.5px solid #FED7AA",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              color: "#C2410C",
              transition: "all .2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#FFEDD5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "white";
            }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div style={{ padding: "12px 12px 4px" }}>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#FDBA74",
            display: "block",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(4px)",
            transition: "opacity .4s ease .2s, transform .4s ease .2s",
          }}
        >
          Navigation
        </span>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          padding: "0 8px",
          flex: 1,
        }}
      >
        {NAV.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeIndex === idx;
          const isHovered = hoveredIndex === idx;

          return (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(item.id, idx, e)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: "13.5px",
                textAlign: "left",
                width: "100%",
                overflow: "hidden",
                color: isActive ? "white" : "#9A3412",
                background: isActive
                  ? "linear-gradient(135deg,#FB923C,#EA580C)"
                  : isHovered
                    ? "#FFEDD5"
                    : "transparent",
                transform:
                  isHovered && !isActive ? "translateX(3px)" : "translateX(0)",
                boxShadow: isActive
                  ? "0 4px 14px rgba(249,115,22,.35)"
                  : "none",
                transition: "all .2s cubic-bezier(.4,0,.2,1)",
                opacity: mounted ? 1 : 0,
              }}
              ref={(el) => {
                if (el && !mounted) {
                  el.style.transitionDelay = `${idx * 60}ms`;
                }
              }}
            >
              {ripple && isActive && (
                <span
                  style={{
                    position: "absolute",
                    left: ripple.x - 12,
                    top: ripple.y - 12,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,.4)",
                    animation: "rippleOut .6s ease forwards",
                    pointerEvents: "none",
                  }}
                />
              )}

              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "transform .2s ease",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.5 : 2}
                  style={{ transition: "all .2s ease" }}
                />
              </span>

              <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                {item.label}
              </span>

              {isActive && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,.8)",
                    animation: "dotPulse 2s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          margin: "8px",
          padding: "12px",
          borderRadius: "16px",
          backgroundColor: "#FFF0E0",
          border: "1.5px solid #FED7AA",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#9A3412",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            Occupancy
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: "#EA580C",
              fontFamily: "'Baloo 2', cursive",
              transition: "all .4s ease",
            }}
          >
            {occupancy}%
          </span>
        </div>

        <div
          style={{
            height: "6px",
            borderRadius: "99px",
            backgroundColor: "#FED7AA",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "99px",
              width: `${occupancy}%`,
              background: "linear-gradient(90deg,#FDBA74,#F97316,#EA580C)",
              transition: "width .8s cubic-bezier(.4,0,.2,1)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg,transparent 0%,rgba(255,255,255,.4) 50%,transparent 100%)",
                backgroundSize: "200% 100%",
                animation:
                  occupancy > 0 ? "barShimmer 2s linear infinite" : "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "6px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#C2410C",
              opacity: 0.65,
            }}
          >
            {occupiedCount} occupied
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#C2410C",
              opacity: 0.65,
            }}
          >
            {totalSlots} total
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "10px 12px",
          borderTop: "1.5px solid #FED7AA",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "10px",
            background: "linear-gradient(135deg,#FB923C,#C2410C)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PawPrint size={13} color="white" strokeWidth={2.5} />
        </div>
        <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#431407",
              fontFamily: "'Baloo 2', cursive",
            }}
          >
            Admin
          </p>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#C2410C",
              opacity: 0.6,
            }}
          >
            Hotel Manager
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pawFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          33%      { transform: translateY(-3px) rotate(-5deg); }
          66%      { transform: translateY(-5px) rotate(4deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes dotPulse {
          0%,100% { opacity: .5; transform: scale(1); }
          50%     { opacity: 1;  transform: scale(1.4); }
        }
        @keyframes rippleOut {
          0%   { transform: scale(1); opacity: .5; }
          100% { transform: scale(6); opacity: 0; }
        }
        @keyframes barShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </aside>
  );

  return (
    <>
      <div
        className="hidden lg:flex h-screen sticky top-0 flex-shrink-0"
        style={{ width: "220px" }}
      >
        {sidebarInner(false)}
      </div>

      {mobileVisible && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          style={{
            backgroundColor: mobileAnimIn ? "rgba(0,0,0,.35)" : "rgba(0,0,0,0)",
            transition: "background-color .3s ease",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onMobileClose();
          }}
        >
          <div
            style={{
              width: "220px",
              height: "100%",
              transform: mobileAnimIn ? "translateX(0)" : "translateX(-100%)",
              transition: "transform .32s cubic-bezier(.4,0,.2,1)",
              boxShadow: mobileAnimIn
                ? "4px 0 32px rgba(249,115,22,.18)"
                : "none",
            }}
          >
            {sidebarInner(true)}
          </div>
        </div>
      )}
    </>
  );
}
