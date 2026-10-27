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

/**
 * Hero power-on — the identity block comes online as the boot overlay clears.
 * A slower, more deliberate rhythm than section reveals: subsystems reporting
 * in one at a time. Still 6px travel max; opacity carries the effect.
 */
export const heroSequence = staggerContainer(0.085, 0.12)

export const heroItem = {
  hidden:  { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: ease.outSoft },
  },
}

/** Second headline line resolves just after the first */
export const heroSubline = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, delay: 0.22, ease: ease.outSoft } },
}

/** Proof rail: the rail lands, then each cell reports in left to right */
export const proofRail = {
  hidden:  { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: ease.outSoft, staggerChildren: 0.11, delayChildren: 0.1 },
  },
}

export const proofCell = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07 } },
}

/** A cell's top edge ignites, then settles to a faint resting line */
export const proofIgnite = {
  hidden:  { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: [0, 1, 1],
    opacity: [0, 1, 0.35],
    transition: { duration: 0.9, times: [0, 0.5, 1], ease: ease.sharp },
  },
}

export const proofText = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.32, ease: ease.out } },
}

/** Section rule — the line beside a section label draws out from the label */
export const ruleDraw = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, delay: 0.08, ease: ease.outSoft } },
}

/** Durations in seconds */
export const duration = {
  micro:  0.12,   // 120ms — instant color/icon feedback
  hover:  0.16,   // 160ms — border glow, backdrop
  panel:  0.20,   // 200ms — panel activations
  reveal: 0.24,   // 240ms — section reveals
  trace:  0.18,   // 180ms — nav trace movement
}
