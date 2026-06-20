/**
 * Centralized constants — single source of truth for layout,
 * z-index hierarchy, glow values, trail config, and boot timings.
 */

export const Z_INDEX = {
  atmosphere: -1,
  lightcycle: 0,
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
  count: 7,
  containerOpacity: 0.7,
} as const

export const BOOT = {
  storageKey: 'grid_boot_seen',
  totalMs: 5200,
  skipFadeDuration: 320,
} as const
