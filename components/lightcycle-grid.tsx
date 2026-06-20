"use client"

import { TRAIL, Z_INDEX } from "@/lib/constants"

interface TrailConfig {
  width: string
  top: string
  duration: number
  delay: number
  gradient: string
  opacity: number
  reverse: boolean
  angle: number
  driftClass: string | null
  flare: boolean
  filter: string
}

// Calmer, sparser traffic — distant by default with one occasional close pass.
// Slower durations + larger, spread-out delays mean you notice movement after
// ~30s of dwell, not on arrival. Fewer lanes = signal over noise.
const TRAILS: TrailConfig[] = [
  // === CYAN FLYNN-ALIGNED (left to right) — distant lanes ===
  {
    width: "35vw", top: "22%", duration: 18, delay: 3,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.4) 15%, rgba(79,223,255,0.52) 45%, rgba(79,223,255,0.2) 85%, transparent 100%)",
    opacity: 0.20, reverse: false, angle: 2, driftClass: "trail-drift-a", flare: false,
    filter: "drop-shadow(0 0 4px rgba(79,223,255,0.18))",
  },
  {
    width: "18vw", top: "40%", duration: 13, delay: 8.5,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.5) 25%, rgba(79,223,255,0.6) 50%, rgba(79,223,255,0.28) 78%, transparent 100%)",
    opacity: 0.26, reverse: false, angle: 0, driftClass: "trail-drift-b", flare: true,
    filter: "drop-shadow(0 0 6px rgba(79,223,255,0.26))",
  },
  {
    width: "30vw", top: "67%", duration: 21, delay: 1.5,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.3) 10%, rgba(79,223,255,0.42) 45%, rgba(79,223,255,0.15) 90%, transparent 100%)",
    opacity: 0.16, reverse: false, angle: 0, driftClass: "trail-drift-a", flare: false,
    filter: "drop-shadow(0 0 4px rgba(79,223,255,0.15))",
  },
  {
    width: "22vw", top: "86%", duration: 17, delay: 5.5,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.34) 20%, rgba(79,223,255,0.46) 50%, rgba(79,223,255,0.18) 82%, transparent 100%)",
    opacity: 0.17, reverse: false, angle: 0, driftClass: null, flare: false,
    filter: "drop-shadow(0 0 4px rgba(79,223,255,0.16))",
  },

  // === ORANGE CLU-ALIGNED (right to left) — counter-traffic ===
  {
    width: "24vw", top: "16%", duration: 16, delay: 6.5,
    gradient: "linear-gradient(to left, transparent 0%, rgba(255,138,61,0.4) 20%, rgba(255,138,61,0.5) 50%, rgba(255,138,61,0.22) 80%, transparent 100%)",
    opacity: 0.18, reverse: true, angle: -2, driftClass: "trail-drift-b", flare: false,
    filter: "drop-shadow(0 0 5px rgba(255,138,61,0.2))",
  },
  {
    width: "16vw", top: "57%", duration: 14, delay: 11,
    gradient: "linear-gradient(to left, transparent 0%, rgba(255,138,61,0.48) 25%, rgba(255,138,61,0.58) 50%, rgba(255,138,61,0.28) 75%, transparent 100%)",
    opacity: 0.22, reverse: true, angle: 3, driftClass: "trail-drift-a", flare: false,
    filter: "drop-shadow(0 0 6px rgba(255,138,61,0.24))",
  },

  // === OCCASIONAL CLOSE PASS — a single faster pursuit, rarely on screen ===
  {
    width: "12vw", top: "31%", duration: 7.5, delay: 13.5,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.58) 30%, rgba(79,223,255,0.68) 50%, rgba(79,223,255,0.32) 70%, transparent 100%)",
    opacity: 0.30, reverse: false, angle: -4, driftClass: "trail-drift-b", flare: true,
    filter: "drop-shadow(0 0 9px rgba(79,223,255,0.36))",
  },
]

export function LightcycleGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: Z_INDEX.lightcycle, opacity: TRAIL.containerOpacity }}
      aria-hidden="true"
    >
      {TRAILS.map((trail, i) => {
        const headColor = trail.reverse ? "rgb(255,170,90)" : "rgb(120,230,255)"
        const headGlow = trail.reverse ? "rgba(255,138,61,0.7)" : "rgba(79,223,255,0.75)"
        return (
          <div
            key={i}
            className={[trail.driftClass, trail.flare ? "trail-flare" : null].filter(Boolean).join(" ") || undefined}
            style={{
              position: "absolute",
              top: trail.top,
              left: 0,
              right: 0,
              height: "1px",
              transform: trail.angle ? `rotate(${trail.angle}deg)` : undefined,
              transformOrigin: "center center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: trail.width,
                height: "2px",
                background: trail.gradient,
                opacity: trail.opacity,
                borderRadius: 1,
                filter: trail.filter,
                animation: `${trail.reverse ? "trail-sweep-reverse" : "trail-sweep"} ${trail.duration}s ${trail.reverse ? "cubic-bezier(0.4, 0, 0.6, 1)" : "linear"} ${trail.delay}s infinite`,
                willChange: "transform",
              }}
            >
              {/* Bright leading head — right edge for forward, left edge for reverse */}
              <span
                className="trail-head"
                style={{
                  [trail.reverse ? "left" : "right"]: "-1px",
                  background: headColor,
                  boxShadow: `0 0 6px 1px ${headGlow}, 0 0 12px ${headGlow}`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
