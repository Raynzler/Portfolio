"use client"

import { useEffect } from "react"
import { scrollState } from "@/lib/scroll-state"

/**
 * Lenis smooth-scroll foundation. Renders nothing; all work runs client-side in
 * an effect, and Lenis is loaded with a dynamic import so it never touches the
 * server bundle (Vercel SSR-safe).
 *
 * - Honors prefers-reduced-motion: leaves native scroll untouched.
 * - smoothTouch stays off (Lenis default), so mobile keeps native touch scroll.
 * - Runs its own rAF loop and tears it down + destroys Lenis on cleanup.
 * - Publishes the instance + scroll velocity to lib/scroll-state for the Grid
 *   shader and nav routing. The narrative scrubbers read window.scrollY, which
 *   Lenis updates natively, so the Zero-Friction Exit math is unaffected.
 */
export function SmoothScroller() {
  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    let rafId = 0
    let cancelled = false
    let lenisInstance: import("lenis").default | null = null

    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return
        const lenis = new Lenis({
          duration: 1.05,
          // expo-out: quick to settle, no rubber-banding
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.6,
        })
        lenisInstance = lenis
        scrollState.lenis = lenis

        lenis.on("scroll", (e: { velocity: number }) => {
          scrollState.velocity = e.velocity
        })

        const raf = (time: number) => {
          lenis.raf(time)
          rafId = requestAnimationFrame(raf)
        }
        rafId = requestAnimationFrame(raf)
      })
      .catch(() => {
        // If Lenis fails to load, the site falls back to native scroll cleanly.
      })

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (lenisInstance) lenisInstance.destroy()
      scrollState.lenis = null
      scrollState.velocity = 0
    }
  }, [])

  return null
}
