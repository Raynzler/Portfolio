"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * Scroll scrubber — drives a 0..1 progress value as the target travels through
 * the viewport, returning the active step index and writing progress to the
 * target's `--p` CSS variable (so rails/fills/playheads animate with no React
 * re-render). Geometry is cached on mount / resize / reflow, so the scroll
 * handler reads only window.scrollY (no per-frame layout reads, no thrash).
 *
 * Deliberately avoids requestAnimationFrame (some embedded/background renderers
 * pause it) and framer's useScroll. Honors prefers-reduced-motion by pinning to
 * the final state. Only the active index is React state, and it changes at most
 * `count` times.
 */
export function useScrollScrub(
  ref: RefObject<HTMLElement | null>,
  count: number,
  options?: { enter?: number; exit?: number }
): number {
  const enter = options?.enter ?? 0.82
  const exit = options?.exit ?? 0.4
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced) {
      el.style.setProperty("--p", "1")
      setActive(count - 1)
      return
    }

    let docTop = 0
    let height = 0
    let vh = 0
    const measure = () => {
      const r = el.getBoundingClientRect()
      docTop = r.top + window.scrollY
      height = r.height
      vh = window.innerHeight
    }
    const update = () => {
      const elTop = docTop - window.scrollY
      const enterPx = vh * enter
      const exitTop = exit * vh - height
      const denom = enterPx - exitTop || 1
      const p = Math.max(0, Math.min(1, (enterPx - elTop) / denom))
      el.style.setProperty("--p", p.toFixed(4))
      const idx = Math.max(0, Math.min(count - 1, Math.floor(p * count)))
      setActive((prev) => (prev === idx ? prev : idx))
    }
    const onResize = () => {
      measure()
      update()
    }

    measure()
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", onResize)
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null
    ro?.observe(document.body)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", onResize)
      ro?.disconnect()
    }
  }, [ref, count, enter, exit])

  return active
}
