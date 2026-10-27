"use client"

import { MotionConfig } from "framer-motion"
import type { ReactNode } from "react"

/**
 * Site-wide Framer Motion settings. reducedMotion="user" follows the OS
 * prefers-reduced-motion setting: transform animations jump to their end
 * state and only opacity fades remain. CSS animations are handled separately
 * by the reduced-motion block in globals.css.
 */
export function MotionPreferences({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
