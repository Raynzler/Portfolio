import type Lenis from "lenis"

/**
 * Shared scroll state. SmoothScroller writes here; consumers (the Grid shader,
 * nav routing) read from here. A plain module object — SSR-safe, no globals on
 * window, no React state churn. `velocity` is normalised-ish px/frame from Lenis
 * and decays to 0 when scrolling stops.
 */
export const scrollState: {
  lenis: Lenis | null
  velocity: number
} = {
  lenis: null,
  velocity: 0,
}
