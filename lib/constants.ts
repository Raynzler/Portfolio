/**
 * Centralized constants — single source of truth for layout,
 * z-index hierarchy, glow values, trail config, and boot timings.
 */

export const Z_INDEX = {
  atmosphere: -1,
  // Same layer as the atmosphere (it renders later, so it paints on top):
  // traffic stays behind all page content, positioned or not.
  lightcycle: -1,
  content: 1,
  footer: 40,
  header: 50,
  diagnostic: 90,
  boot: 200,
} as const

export const SCROLL = {
  headerOffset: 80,
  // Fraction of the viewport height at which a section is considered active.
  // The section whose top has scrolled above this line (measured from the
  // viewport top) wins. ~0.4 means "active once it dominates the upper view",
  // which keeps the highlight in sync with what is actually on screen for
  // tall, full-height sections instead of lagging one section behind.
  activationFraction: 0.4,
} as const

export const GLOW = {
  panelHover: '0 0 0 1px rgba(var(--mode-rgb), 0.06) inset, 0 1px 20px rgba(var(--mode-rgb), 0.035)',
  trailCyan: '0 0 14px rgba(79,223,255,0.12)',
  trailOrange: '0 0 18px rgba(255,138,61,0.10)',
} as const

export const TRAIL = {
  count: 12,
  containerOpacity: 1,
} as const

// First-visit boot, beat by beat (ms). This one schedule drives the boot: each
// beat starts at the sum of the ones before it, measured from the overlay's
// first black frame. `handoff` covers the terminal clearing into the Grid and
// the Grid and hero powering up (their first-power-up transitions are sized to
// fit it), so the homepage is complete and usable when it ends. The startup
// command types inside `command` whatever its length, so every randomly chosen
// routine lands on the same total.
export type BootTimeline = {
  prompt: number    // empty prompt, cursor blinking
  whoami: number    // type `whoami`, enter
  identity: number  // `hamza` prints, next prompt
  command: number   // type the startup command, run it
  progress: number  // initialisation bar, then a beat at 100%
  ready: number     // READY holds
  handoff: number   // terminal clears into the Grid; hero and Grid finish powering up
}

const BOOT_TIMELINE: BootTimeline = {
  prompt: 300,
  whoami: 840,
  identity: 640,
  command: 1000,
  progress: 1480,
  ready: 440,
  handoff: 1300,
}

// Reduced motion: text appears whole instead of typing; a short, still sequence.
const BOOT_TIMELINE_REDUCED: BootTimeline = {
  prompt: 120,
  whoami: 220,
  identity: 320,
  command: 220,
  progress: 460,
  ready: 320,
  handoff: 820,
}

const total = (t: BootTimeline) => Object.values(t).reduce((sum, ms) => sum + ms, 0)

export const BOOT = {
  storageKey: 'grid_boot_seen',
  timeline: BOOT_TIMELINE,
  reducedTimeline: BOOT_TIMELINE_REDUCED,
  // End to end, derived from the beats so the two cannot drift apart: 6000ms.
  totalMs: total(BOOT_TIMELINE),
  // The overlay unmounts this far into the hand-off (or into a skip): the
  // backdrop clears in ~420ms while the progress line drops into the Grid
  // horizon (~800ms). Pointer events pass through from the hand-off's start.
  skipFadeDuration: 820,
} as const
