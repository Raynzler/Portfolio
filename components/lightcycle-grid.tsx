"use client"

import { useEffect, useRef } from "react"
import { Z_INDEX } from "@/lib/constants"
import { coupleToSignal } from "@/lib/grid-runtime"

/**
 * Lightcycle traffic: distant operational routes crossing the Grid.
 *
 * Trails sit in three depth tiers. Far traffic is thin, dim and slow; near
 * traffic is rare, brighter and quick. Each trail is brightest at its head and
 * fades along its wake, so direction reads at a glance. Cyan (Flynn) runs left
 * to right and is the majority; ember (CLU) runs right to left and stays
 * restrained until the CLU pass around EXPERIENCE turns it up (globals.css
 * weights both tones by --clu-intensity).
 *
 * Motion is CSS keyframes on transform, so it runs on the compositor and starts
 * before hydration; negative delays spread the trails along their routes from
 * the first frame. Scroll velocity nudges playback rate through the Grid
 * runtime's signal. Hidden entirely under prefers-reduced-motion.
 */
type Tier = "far" | "mid" | "near"
type Tone = "cyan" | "ember"

interface Trail {
  tier: Tier
  tone: Tone
  width: number // vw
  top: number // % of the viewport
  duration: number // s
  delay: number // s, negative = already under way
  angle: number // deg
  drift?: "a" | "b"
}

const TRAILS: Trail[] = [
  // far: thin, slow, sparse
  { tier: "far", tone: "cyan", width: 14, top: 14, duration: 24, delay: -6, angle: 0 },
  { tier: "far", tone: "cyan", width: 10, top: 29, duration: 28, delay: -19, angle: 1 },
  { tier: "far", tone: "ember", width: 9, top: 21, duration: 30, delay: -4, angle: -1 },
  { tier: "far", tone: "cyan", width: 12, top: 47, duration: 22, delay: -11, angle: -1 },
  { tier: "far", tone: "cyan", width: 11, top: 71, duration: 26, delay: -15, angle: 0 },
  // mid: the body of the traffic
  { tier: "mid", tone: "cyan", width: 22, top: 9, duration: 13, delay: -2, angle: 0, drift: "a" },
  { tier: "mid", tone: "cyan", width: 26, top: 38, duration: 15, delay: -9, angle: 2 },
  { tier: "mid", tone: "ember", width: 18, top: 56, duration: 17, delay: -5, angle: -2, drift: "b" },
  { tier: "mid", tone: "cyan", width: 20, top: 64, duration: 14, delay: -12, angle: 0 },
  { tier: "mid", tone: "cyan", width: 24, top: 86, duration: 16, delay: -7, angle: 3, drift: "a" },
  // near: rare and quick, the clearest direction cue
  { tier: "near", tone: "cyan", width: 30, top: 33, duration: 8, delay: -1, angle: -4, drift: "b" },
  { tier: "near", tone: "ember", width: 22, top: 78, duration: 11, delay: -6, angle: 4 },
]

function trailAnimation({ tone, duration, delay, drift }: Trail) {
  const run =
    tone === "cyan"
      ? `lc-run ${duration}s linear ${delay}s infinite`
      : `lc-run-reverse ${duration}s cubic-bezier(0.4, 0, 0.6, 1) ${delay}s infinite`
  if (!drift) return run
  return `${run}, lc-drift-${drift} ${drift === "a" ? 8.2 : 11.4}s ease-in-out infinite`
}

export function LightcycleGrid() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    return coupleToSignal(rootRef.current, "lc-run", 0.9)
  }, [])

  return (
    <div
      ref={rootRef}
      className="lc-root pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: Z_INDEX.lightcycle }}
      aria-hidden="true"
    >
      {TRAILS.map((trail, i) => (
        <div
          key={i}
          className={`lc-lane lc-${trail.tier}`}
          data-tone={trail.tone}
          style={{
            top: `${trail.top}%`,
            transform: trail.angle ? `rotate(${trail.angle}deg)` : undefined,
          }}
        >
          <div
            className="lc-trail"
            style={{ width: `${trail.width}vw`, animation: trailAnimation(trail) }}
          >
            <span className="lc-head" />
          </div>
        </div>
      ))}
    </div>
  )
}
