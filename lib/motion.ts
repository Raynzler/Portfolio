/**
 * Motion config — low-latency, infrastructural, tactile.
 * Every curve measured against perceived fluidity, not academic correctness.
 */

export const ease = {
  /** Deceleration — general UI */
  out:         [0.0,  0.0,  0.2,  1.0 ] as const,
  /** Gentle spring-like deceleration — section reveals */
  outSoft:     [0.22, 1.0,  0.36, 1.0 ] as const,
  /** Balanced transition — backdrop, color */
  inOut:       [0.4,  0.0,  0.2,  1.0 ] as const,
  /** Sharp operational snap — panel edges, trace lines */
  sharp:       [0.25, 0.1,  0.25, 1.0 ] as const,
  /** Slight anticipation — nav trace, interactive accents */
  anticipate:  [0.34, 1.56, 0.64, 1.0 ] as const,
}

/** Viewport reveal — 4px travel, clean fade. Low motion distance = premium feel. */
export const fadeUp = {
  hidden:  { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: ease.outSoft },
  },
}

/** Stagger container — tight operational rhythm */
export const staggerContainer = (staggerChildren = 0.05, delayChildren = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
})

/** Stagger child — 4px travel max */
export const staggerItem = {
  hidden:  { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: ease.outSoft },
  },
}

/** Durations in seconds */
export const duration = {
  micro:  0.12,   // 120ms — instant color/icon feedback
  hover:  0.16,   // 160ms — border glow, backdrop
  panel:  0.20,   // 200ms — panel activations
  reveal: 0.24,   // 240ms — section reveals
  trace:  0.18,   // 180ms — nav trace movement
}
