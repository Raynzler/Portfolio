"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SKIP_KEY = "grid_boot_seen"
const TOTAL_MS = 1900

const PANELS = ["IDENTITY", "OBSERVABILITY", "RELAY", "DOSSIER"]

function playInterfaceTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(880, context.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1320, context.currentTime + 0.08)
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.018, context.currentTime + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.2)
    window.setTimeout(() => void context.close(), 260)
  } catch {
    // Autoplay policy may keep this silent. The interface remains fully functional.
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export function BootSequence() {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0)
  const skipRef = useRef(false)

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SKIP_KEY)) return

    setVisible(true)
    playInterfaceTone()

    const skip = () => {
      if (skipRef.current) return
      skipRef.current = true
      setPhase(4)
      sessionStorage.setItem(SKIP_KEY, "1")
      window.setTimeout(() => setVisible(false), 220)
    }

    window.addEventListener("keydown", skip, { once: true })
    window.addEventListener("click", skip, { once: true })

    const timers = [
      window.setTimeout(() => setPhase(1), 120),
      window.setTimeout(() => setPhase(2), 560),
      window.setTimeout(() => setPhase(3), 1040),
      window.setTimeout(() => setPhase(4), 1620),
      window.setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem(SKIP_KEY, "1")
      }, TOTAL_MS),
    ]

    return () => {
      window.removeEventListener("keydown", skip)
      window.removeEventListener("click", skip)
      timers.forEach(window.clearTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[200] overflow-hidden bg-[#05070A]"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 4 ? 0 : 1 }}
          transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 opacity-[0.035] boot-grid" />
          <div className="scanline-texture opacity-70" />

          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px bg-[linear-gradient(to_right,transparent,rgba(var(--mode-rgb),0.55),transparent)] shadow-[0_0_14px_rgba(var(--mode-rgb),0.24)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0, opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.34, ease: [0.25, 0.1, 0.25, 1] }}
          />

          <div className="absolute left-1/2 top-1/2 w-[min(82vw,560px)] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="mb-8 font-mono text-sm text-[rgba(230,241,255,0.82)]"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: 0.08 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[rgba(var(--mode-rgb),0.58)]">&gt;</span>
                <span>whoami</span>
                <span className="boot-cursor">_</span>
              </div>
              <motion.div
                className="mt-3 text-[rgba(var(--mode-rgb),0.72)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.16, delay: 0.12 }}
              >
                hamza
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-px bg-[rgba(var(--mode-rgb),0.09)] sm:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={{ duration: 0.18 }}
            >
              {PANELS.map((panel, index) => (
                <motion.div
                  key={panel}
                  className="bg-[#05070A] px-4 py-3"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 3 }}
                  transition={{ duration: 0.18, delay: index * 0.06 }}
                >
                  <span className="subsystem-label">{panel}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-5 h-px origin-left bg-[linear-gradient(to_right,rgb(var(--mode-rgb)),transparent)]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: phase >= 3 ? 1 : 0, opacity: phase >= 3 ? 0.7 : 0 }}
              transition={{ duration: 0.34, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
