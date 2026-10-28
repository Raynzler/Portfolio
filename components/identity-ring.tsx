"use client"

import { useEffect, useRef } from "react"
import { coupleToSignal, prefersReducedMotion } from "@/lib/grid-runtime"

/**
 * Identity ring — the hero's identity object. A disc in CSS 3D (rims stacked
 * in Z for thickness, a dashed band, a counter-rotating arc, a core) floating
 * over the Grid in the hero's empty right half. It materialises as the hero
 * comes online, leans a few degrees toward the cursor, spins up a touch while
 * the page is moving (Grid runtime signal), and flattens away as the hero
 * scrolls off.
 *
 * Desktop only (hidden below lg, where there is no free space beside the
 * text). Transforms and opacity only; the spin is CSS on the compositor and
 * pauses with the hero offscreen or the tab hidden. Decorative, aria-hidden.
 */
export function IdentityRing() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage || getComputedStyle(stage).display === "none") return
    const uncouple = coupleToSignal(stage, "ring-spin", 2)
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return uncouple

    // Lean toward the pointer: -1..1 on each axis from the ring's centre,
    // written as CSS variables once per frame at most.
    let frame = 0
    let px = 0
    let py = 0
    const apply = () => {
      frame = 0
      if (stage.closest('[data-live="off"]')) return
      const r = stage.getBoundingClientRect()
      const tx = Math.max(-1, Math.min(1, (px - (r.left + r.width / 2)) / (window.innerWidth / 2)))
      const ty = Math.max(-1, Math.min(1, (py - (r.top + r.height / 2)) / (window.innerHeight / 2)))
      stage.style.setProperty("--tx", tx.toFixed(3))
      stage.style.setProperty("--ty", ty.toFixed(3))
    }
    const onMove = (event: PointerEvent) => {
      px = event.clientX
      py = event.clientY
      if (!frame) frame = requestAnimationFrame(apply)
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
      uncouple()
    }
  }, [])

  return (
    <div ref={stageRef} className="identity-stage" aria-hidden="true">
      <div className="identity-ring">
        <span className="ring-floor" />
        <span className="ring-rim" data-depth="back" />
        <span className="ring-rim" data-depth="mid" />
        <span className="ring-rim" data-depth="front" />
        <span className="ring-segments" />
        <span className="ring-inner" />
        <span className="ring-core" />
      </div>
    </div>
  )
}
