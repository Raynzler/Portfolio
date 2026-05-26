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

const TRAILS: TrailConfig[] = [
  // === CYAN FLYNN-ALIGNED (left to right) ===
  {
    width: "28vw", top: "12%", duration: 9, delay: 0,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.5) 20%, rgba(79,223,255,0.6) 50%, rgba(79,223,255,0.3) 80%, transparent 100%)",
    opacity: 0.38, reverse: false, angle: 0, driftClass: "trail-drift-a", flare: false,
    filter: "drop-shadow(0 0 6px rgba(79,223,255,0.3))",
  },
  {
    width: "35vw", top: "24%", duration: 14, delay: 2.2,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.4) 15%, rgba(79,223,255,0.55) 45%, rgba(79,223,255,0.2) 85%, transparent 100%)",
    opacity: 0.30, reverse: false, angle: 3, driftClass: null, flare: false,
    filter: "drop-shadow(0 0 4px rgba(79,223,255,0.2))",
  },
  {
    width: "18vw", top: "38%", duration: 7, delay: 0.8,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.55) 25%, rgba(79,223,255,0.65) 50%, rgba(79,223,255,0.3) 75%, transparent 100%)",
    opacity: 0.45, reverse: false, angle: 0, driftClass: "trail-drift-b", flare: true,
    filter: "drop-shadow(0 0 8px rgba(79,223,255,0.35))",
  },
  {
    width: "22vw", top: "52%", duration: 11, delay: 4.5,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.35) 20%, rgba(79,223,255,0.5) 50%, rgba(79,223,255,0.2) 80%, transparent 100%)",
    opacity: 0.28, reverse: false, angle: -2, driftClass: null, flare: false,
    filter: "drop-shadow(0 0 5px rgba(79,223,255,0.25))",
  },
  {
    width: "32vw", top: "68%", duration: 16, delay: 1.4,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.3) 10%, rgba(79,223,255,0.45) 40%, rgba(79,223,255,0.15) 90%, transparent 100%)",
    opacity: 0.25, reverse: false, angle: 0, driftClass: "trail-drift-a", flare: false,
    filter: "drop-shadow(0 0 4px rgba(79,223,255,0.18))",
  },
  {
    width: "15vw", top: "81%", duration: 8, delay: 6.2,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.5) 30%, rgba(79,223,255,0.6) 55%, rgba(79,223,255,0.25) 80%, transparent 100%)",
    opacity: 0.35, reverse: false, angle: 4, driftClass: null, flare: true,
    filter: "drop-shadow(0 0 6px rgba(79,223,255,0.28))",
  },
  {
    width: "25vw", top: "92%", duration: 13, delay: 3.1,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.35) 20%, rgba(79,223,255,0.5) 50%, rgba(79,223,255,0.2) 80%, transparent 100%)",
    opacity: 0.26, reverse: false, angle: 0, driftClass: null, flare: false,
    filter: "drop-shadow(0 0 4px rgba(79,223,255,0.2))",
  },

  // === ORANGE CLU-ALIGNED (right to left) ===
  {
    width: "24vw", top: "18%", duration: 10, delay: 3.8,
    gradient: "linear-gradient(to left, transparent 0%, rgba(255,138,61,0.45) 20%, rgba(255,138,61,0.55) 50%, rgba(255,138,61,0.25) 80%, transparent 100%)",
    opacity: 0.34, reverse: true, angle: -3, driftClass: "trail-drift-b", flare: false,
    filter: "drop-shadow(0 0 6px rgba(255,138,61,0.25))",
  },
  {
    width: "30vw", top: "44%", duration: 12, delay: 1.6,
    gradient: "linear-gradient(to left, transparent 0%, rgba(255,138,61,0.4) 15%, rgba(255,138,61,0.5) 45%, rgba(255,138,61,0.2) 85%, transparent 100%)",
    opacity: 0.30, reverse: true, angle: 0, driftClass: null, flare: true,
    filter: "drop-shadow(0 0 5px rgba(255,138,61,0.22))",
  },
  {
    width: "16vw", top: "62%", duration: 8.5, delay: 5.4,
    gradient: "linear-gradient(to left, transparent 0%, rgba(255,138,61,0.5) 25%, rgba(255,138,61,0.6) 50%, rgba(255,138,61,0.3) 75%, transparent 100%)",
    opacity: 0.38, reverse: true, angle: 5, driftClass: "trail-drift-a", flare: false,
    filter: "drop-shadow(0 0 7px rgba(255,138,61,0.3))",
  },
  {
    width: "20vw", top: "76%", duration: 15, delay: 7.2,
    gradient: "linear-gradient(to left, transparent 0%, rgba(255,138,61,0.35) 20%, rgba(255,138,61,0.48) 50%, rgba(255,138,61,0.18) 80%, transparent 100%)",
    opacity: 0.27, reverse: true, angle: 0, driftClass: null, flare: false,
    filter: "drop-shadow(0 0 4px rgba(255,138,61,0.2))",
  },

  // === FAST CLOSE-RANGE (higher speed, higher opacity) ===
  {
    width: "12vw", top: "34%", duration: 6, delay: 0.4,
    gradient: "linear-gradient(to right, transparent 0%, rgba(79,223,255,0.6) 30%, rgba(79,223,255,0.7) 50%, rgba(79,223,255,0.35) 70%, transparent 100%)",
    opacity: 0.50, reverse: false, angle: -5, driftClass: "trail-drift-b", flare: true,
    filter: "drop-shadow(0 0 10px rgba(79,223,255,0.4))",
  },
]

export function LightcycleGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: Z_INDEX.lightcycle, opacity: TRAIL.containerOpacity }}
      aria-hidden="true"
    >
      {TRAILS.map((trail, i) => (
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
              width: trail.width,
              height: "2px",
              background: trail.gradient,
              opacity: trail.opacity,
              borderRadius: 1,
              filter: trail.filter,
              animation: `${trail.reverse ? "trail-sweep-reverse" : "trail-sweep"} ${trail.duration}s ${trail.reverse ? "cubic-bezier(0.4, 0, 0.6, 1)" : "linear"} ${trail.delay}s infinite`,
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  )
}
