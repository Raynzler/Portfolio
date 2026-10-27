import { useEffect, useSyncExternalStore, type RefObject } from "react"

/**
 * Grid runtime: the small, framework-free clock behind the atmosphere. Every
 * store here is written outside React, so nothing in it causes a per-frame
 * render.
 *
 *  - online   The Grid powers up once: when the boot overlay starts to fade, or
 *             straight away on a repeat visit. Sets html[data-grid="online"]
 *             (CSS brings the atmosphere out of standby) and notifies
 *             useGridOnline() subscribers (the hero sequence, project panels).
 *  - signal   Scroll velocity smoothed into 0..1. Published as --signal on
 *             <html> and to subscribers (trail playback rate), quantised to
 *             0.02 steps and only written when it changes, so an idle page
 *             does no style work at all.
 *  - paused   html[data-motion="paused"] while the tab is hidden, so CSS can
 *             hold every continuous animation instead of ticking unseen.
 */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_QUERY).matches
  )
}

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {}
  const query = window.matchMedia(REDUCED_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** prefers-reduced-motion as render state. Server snapshot is false. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false)
}

// ── Online ──────────────────────────────────────────────────────────────────

let online = false
const onlineListeners = new Set<() => void>()

function subscribeOnline(listener: () => void) {
  onlineListeners.add(listener)
  return () => {
    onlineListeners.delete(listener)
  }
}

/** Power the Grid up. Idempotent: the first call wins. */
export function bringGridOnline() {
  if (online) return
  online = true
  const root = document.documentElement
  root.dataset.grid = "online"
  if (!prefersReducedMotion()) {
    // The staggered power-up timing applies to this first hand-off only, so
    // later zone changes keep their normal, undelayed transitions.
    root.dataset.gridBoot = ""
    window.setTimeout(() => delete root.dataset.gridBoot, 2600)
  }
  onlineListeners.forEach((listener) => listener())
}

export function useGridOnline() {
  return useSyncExternalStore(subscribeOnline, () => online, () => false)
}

// ── Signal ──────────────────────────────────────────────────────────────────

/** Lenis velocity (px per frame) that reads as full signal: a brisk flick. */
const FULL_SIGNAL_VELOCITY = 48

let signal = 0
let surge = 0
let published = 0
const signalListeners = new Set<(value: number) => void>()

export function subscribeSignal(listener: (value: number) => void) {
  signalListeners.add(listener)
  return () => {
    signalListeners.delete(listener)
  }
}

/** A short surge on top of scroll velocity, e.g. when crossing into a zone. */
export function surgeSignal(amount: number) {
  surge = Math.max(surge, Math.min(1, amount))
}

/** Advance one frame. Called from the Lenis rAF loop, so it adds no loop. */
export function tickSignal(velocity: number) {
  const target = Math.min(1, Math.abs(velocity) / FULL_SIGNAL_VELOCITY)
  // Fast attack, slow release: traffic surges with the scroll, then settles.
  signal += (target - signal) * (target > signal ? 0.16 : 0.04)
  surge *= 0.95
  const raw = Math.max(signal, surge)
  const next = raw < 0.02 ? 0 : Math.round(raw * 50) / 50
  if (next === published) return
  published = next
  document.documentElement.style.setProperty("--signal", next.toFixed(2))
  signalListeners.forEach((listener) => listener(next))
}

/**
 * Let the scroll signal speed up CSS animations under `root` whose name starts
 * with `prefix`. updatePlaybackRate() keeps each animation's current position,
 * so trails accelerate without a jump, and the rate only moves in ~0.05 steps:
 * a handful of updates per scroll gesture, never one per frame.
 */
export function coupleToSignal(root: Element, prefix: string, gain: number) {
  if (typeof root.getAnimations !== "function") return () => {}
  const runs = root
    .getAnimations({ subtree: true })
    .filter((run) => "animationName" in run && String(run.animationName).startsWith(prefix))
  if (runs.length === 0) return () => {}
  let applied = 1
  const unsubscribe = subscribeSignal((value) => {
    const rate = 1 + gain * value
    if (value !== 0 && Math.abs(rate - applied) < 0.05) return
    applied = rate
    for (const run of runs) run.updatePlaybackRate(rate)
  })
  return () => {
    unsubscribe()
    for (const run of runs) run.updatePlaybackRate(1)
  }
}

// ── Pausing ─────────────────────────────────────────────────────────────────

/** Hold continuous CSS animation while the tab is hidden. Returns cleanup. */
export function pauseWhileHidden() {
  const root = document.documentElement
  const sync = () => {
    if (document.hidden) root.dataset.motion = "paused"
    else delete root.dataset.motion
  }
  sync()
  document.addEventListener("visibilitychange", sync)
  return () => {
    document.removeEventListener("visibilitychange", sync)
    delete root.dataset.motion
  }
}

/**
 * data-live="on" while the element is near the viewport, "off" once it leaves.
 * Written straight to the DOM, no React state. CSS keys every continuous
 * in-panel animation off it, so offscreen panels stop animating.
 */
export function useLiveAttribute(ref: RefObject<HTMLElement | null>, margin = "20% 0px") {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.live = entry.isIntersecting ? "on" : "off"
      },
      { rootMargin: margin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, margin])
}
