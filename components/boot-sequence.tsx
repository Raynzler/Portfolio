"use client"

/**
 * Boot Sequence — TRON / infrastructure init atmosphere.
 *
 * Timing: ~1.8s total, skippable on any keydown / click.
 * SessionStorage guard: only plays once per browser session.
 *
 * Visual grammar:
 *   1. 0ms   — full obsidian cover, invisible
 *   2. 80ms  — horizontal cyan line sweeps inward from both edges (lightcycle trace)
 *   3. 400ms — vertical counterpart completes a cross-formation
 *   4. 600ms — subsystem labels stagger in (CORE · SYNC · READY)
 *   5. 1000ms — scanline sweep (single pass, top → bottom)
 *   6. 1400ms — cover fades out, handing off to the real UI
 *   7. 1800ms — component unmounts
 *
 * No cinematics. No bikes. Just system-activation geometry.
 */

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SKIP_KEY = "grid_boot_seen"
const TOTAL_MS = 1800

const LABELS = [
  { text: "CORE",  delay: 0.60 },
  { text: "SYNC",  delay: 0.72 },
  { text: "READY", delay: 0.84 },
]

export function BootSequence() {
  const [visible,   setVisible]   = useState(false)
  const [phase,     setPhase]     = useState(0)   // 0=init 1=traces 2=labels 3=fade
  const skipRef = useRef(false)

  useEffect(() => {
    // Skip on repeat visits within the session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SKIP_KEY)) {
      return
    }
    setVisible(true)

    const skip = () => {
      if (skipRef.current) return
      skipRef.current = true
      setPhase(3)
      setTimeout(() => setVisible(false), 280)
    }

    // Keyboard or click to skip
    window.addEventListener("keydown", skip, { once: true })
    window.addEventListener("click",   skip, { once: true })

    // Auto-advance phases
    const t1 = setTimeout(() => setPhase(1), 80)
    const t2 = setTimeout(() => setPhase(2), 600)
    const t3 = setTimeout(() => { setPhase(3) }, 1400)
    const t4 = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem(SKIP_KEY, "1")
    }, TOTAL_MS)

    return () => {
      window.removeEventListener("keydown", skip)
      window.removeEventListener("click",   skip)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#05070A" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 3 ? 0 : 1 }}
          transition={{ duration: 0.30, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          {/* ── Atmospheric grid (same as hero, low opacity) ────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: 0.025,
              backgroundImage: `
                linear-gradient(rgba(79,223,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(79,223,255,1) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
            }}
          />

          {/* ── Horizontal trace — sweeps from edges to center ─────── */}
          {phase >= 1 && (
            <>
              <motion.div
                className="absolute"
                style={{
                  top: "50%",
                  left: 0,
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #4FDFFF 60%, transparent)",
                  boxShadow: "0 0 8px rgba(79,223,255,0.6)",
                  transformOrigin: "left center",
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "50%", opacity: 1 }}
                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <motion.div
                className="absolute"
                style={{
                  top: "50%",
                  right: 0,
                  height: "1px",
                  background: "linear-gradient(to left, transparent, #4FDFFF 60%, transparent)",
                  boxShadow: "0 0 8px rgba(79,223,255,0.6)",
                  transformOrigin: "right center",
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "50%", opacity: 1 }}
                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </>
          )}

          {/* ── Vertical trace — completes the cross after horizontal ─ */}
          {phase >= 1 && (
            <>
              <motion.div
                className="absolute"
                style={{
                  left: "50%",
                  top: 0,
                  width: "1px",
                  background: "linear-gradient(to bottom, transparent, rgba(79,223,255,0.45) 60%, transparent)",
                  transformOrigin: "center top",
                }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "50%", opacity: 1 }}
                transition={{ duration: 0.26, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <motion.div
                className="absolute"
                style={{
                  left: "50%",
                  bottom: 0,
                  width: "1px",
                  background: "linear-gradient(to top, transparent, rgba(79,223,255,0.45) 60%, transparent)",
                  transformOrigin: "center bottom",
                }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "50%", opacity: 1 }}
                transition={{ duration: 0.26, delay: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </>
          )}

          {/* ── Center crosshair dot ────────────────────────────────── */}
          {phase >= 1 && (
            <motion.div
              className="absolute"
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#4FDFFF",
                boxShadow: "0 0 12px rgba(79,223,255,0.9), 0 0 24px rgba(79,223,255,0.4)",
                left: "calc(50% - 2px)",
                top:  "calc(50% - 2px)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.14, delay: 0.28 }}
            />
          )}

          {/* ── Subsystem labels — stagger in below center ─────────── */}
          {phase >= 2 && (
            <div
              className="absolute flex items-center gap-6"
              style={{ top: "calc(50% + 32px)" }}
            >
              {LABELS.map(({ text, delay }) => (
                <motion.span
                  key={text}
                  className="subsystem-label"
                  style={{ color: "rgba(79,223,255,0.55)", letterSpacing: "0.22em" }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.20, delay, ease: [0.0, 0.0, 0.2, 1.0] }}
                >
                  {text}
                </motion.span>
              ))}
            </div>
          )}

          {/* ── Scanline sweep — single pass ───────────────────────── */}
          {phase >= 2 && (
            <motion.div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: "80px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(79,223,255,0.04) 50%, transparent)",
              }}
              initial={{ top: "-80px" }}
              animate={{ top: "100vh" }}
              transition={{ duration: 0.65, delay: 0.1, ease: "linear" }}
            />
          )}

          {/* ── Skip hint ───────────────────────────────────────────── */}
          <motion.p
            className="absolute bottom-8 left-0 right-0 text-center subsystem-label"
            style={{ opacity: 0.2, letterSpacing: "0.18em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.18 : 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            PRESS ANY KEY TO SKIP
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
