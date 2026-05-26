"use client"

import { TRAIL, Z_INDEX } from "@/lib/constants"

interface TrailConfig {
  width: number
  top: number
  duration: number
  delay: number
  color: string
  glow: string
  opacity: number
  reverse: boolean
  angle: number
  driftClass: string | null
}

const TRAILS: TrailConfig[] = Array.from({ length: TRAIL.count }, (_, i) => {
  const width = TRAIL.baseWidth + i * TRAIL.widthStep
  const top = TRAIL.baseTop + i * TRAIL.topStep
  const duration = TRAIL.baseDuration + i * TRAIL.durationStep
  const delay = i * TRAIL.baseDelay
  const isOrange = i % 5 === 3 || i === 9
  const reverse = isOrange && i !== 3
  const color = isOrange ? "rgba(255,138,61,0.18)" : "rgba(79,223,255,0.16)"
  const glow = isOrange ? "0 0 18px rgba(255,138,61,0.10)" : "0 0 14px rgba(79,223,255,0.12)"

  let angle = 0
  if (i === 2) angle = 3
  if (i === 5) angle = -4
  if (i === 8) angle = 6

  let driftClass: string | null = null
  if (i === 1 || i === 6) driftClass = "trail-drift-a"
  if (i === 4 || i === 8) driftClass = "trail-drift-b"

  return { width, top, duration, delay, color, glow, opacity: 0.16 + (i % 3) * 0.02, reverse, angle, driftClass }
})

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
          className={trail.driftClass ?? undefined}
          style={{
            position: "absolute",
            top: `${trail.top}%`,
            left: 0,
            right: 0,
            height: "1px",
            transform: trail.angle ? `rotate(${trail.angle}deg)` : undefined,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              width: `${trail.width}px`,
              height: "1px",
              background: trail.color,
              opacity: trail.opacity,
              boxShadow: trail.glow,
              borderRadius: 2,
              animation: `${trail.reverse ? "trail-sweep-reverse" : "trail-sweep"} ${trail.duration}s ${trail.reverse ? "cubic-bezier(0.4, 0, 0.6, 1)" : "linear"} ${trail.delay}s infinite`,
              willChange: "transform",
            }}
          />
        </div>
      ))}
    </div>
  )
}
