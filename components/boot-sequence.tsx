"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BOOT, Z_INDEX } from "@/lib/constants"

const WHOAMI = "whoami"
const PROGRESS_CELLS = 16

// A pool of operational, infrastructure-flavoured startup routines. One is
// chosen at random per session so the boot reads like a live system coming
// online rather than the same scripted animation on every visit. Each command
// is paired with the status line a real operator would expect it to emit.
const SEQUENCES = [
  { cmd: "bin/identity-sync", status: "AUTHENTICATING OPERATOR" },
  { cmd: "bin/control-plane-init", status: "INITIALIZING CONTROL PLANE" },
  { cmd: "bin/cluster-bootstrap", status: "BOOTSTRAPPING CLUSTER" },
  { cmd: "bin/quorum-establish", status: "ESTABLISHING QUORUM" },
  { cmd: "bin/telemetry-sync", status: "SYNCING TELEMETRY" },
  { cmd: "bin/observability-init", status: "LOADING OBSERVABILITY LAYERS" },
  { cmd: "bin/health-check", status: "VERIFYING SYSTEM HEALTH" },
  { cmd: "bin/node-discovery", status: "DISCOVERING NODES" },
  { cmd: "bin/grid-init", status: "ESTABLISHING GRID LINK" },
  { cmd: "bin/sentinel-init", status: "INITIALIZING CONTROL SYSTEMS" },
  { cmd: "bin/signal-verify", status: "VALIDATING SIGNAL INTEGRITY" },
] as const

function pickSequence() {
  return SEQUENCES[Math.floor(Math.random() * SEQUENCES.length)]
}

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

/**
 * Boot phases — each maps to a discrete beat of a believable terminal session:
 *  0  empty prompt, cursor blinking            > _
 *  1  typing the whoami command                > whoami_
 *  2  command submitted, identity printed       hamza_
 *  3  typing the operator's startup command    > bin/<cmd>_
 *  4  command running: status + init progress  SYSTEM INITIALIZING [▓▓░░] 42%
 *  5  initialization complete                  100%  READY
 *  6  fade out into the portfolio
 */
export function BootSequence() {
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0)
  const [whoami, setWhoami] = useState("")
  const [showHamza, setShowHamza] = useState(false)
  const [cmd, setCmd] = useState("")
  const [progress, setProgress] = useState(0)
  // Random startup routine, chosen once per mount on the client. The overlay
  // never renders during hydration (visible starts false and only flips inside
  // an effect), so the client-only randomness cannot cause a hydration mismatch.
  const [seq] = useState(pickSequence)

  const skipRef = useRef(false)
  const tonePlayedRef = useRef(false)
  const reducedRef = useRef(false)
  const progressHoldRef = useRef<number | undefined>(undefined)

  const markSeen = () => {
    try {
      sessionStorage.setItem(BOOT.storageKey, "1")
    } catch {
      // sessionStorage may be unavailable (private mode); boot simply replays.
    }
  }

  // Mount: gate on sessionStorage, reveal the overlay, wire skip, kick the chain.
  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(BOOT.storageKey)) return

    reducedRef.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    setVisible(true)

    const skip = () => {
      if (skipRef.current) return
      skipRef.current = true
      setWhoami(WHOAMI)
      setShowHamza(true)
      setCmd(seq.cmd)
      setProgress(100)
      setPhase(6)
    }

    window.addEventListener("keydown", skip)
    window.addEventListener("click", skip)

    const startDelay = reducedRef.current ? 120 : 320
    const begin = window.setTimeout(() => setPhase(1), startDelay)

    return () => {
      window.removeEventListener("keydown", skip)
      window.removeEventListener("click", skip)
      window.clearTimeout(begin)
    }
  }, [seq])

  // Phase 1 — type `whoami`, then ENTER (advance to the printed identity).
  useEffect(() => {
    if (!visible || phase !== 1) return
    const reduced = reducedRef.current
    const timers: number[] = []

    if (reduced) {
      setWhoami(WHOAMI)
      timers.push(window.setTimeout(() => setPhase(2), 220))
    } else {
      const lead = 120
      const per = 82
      for (let i = 1; i <= WHOAMI.length; i += 1) {
        timers.push(window.setTimeout(() => setWhoami(WHOAMI.slice(0, i)), lead + i * per))
      }
      const typedAt = lead + WHOAMI.length * per
      timers.push(window.setTimeout(() => setPhase(2), typedAt + 360))
    }

    return () => timers.forEach(window.clearTimeout)
  }, [phase, visible])

  // Phase 2 — cursor lands on the new line, then `hamza` prints; ENTER again.
  useEffect(() => {
    if (!visible || phase !== 2) return
    const reduced = reducedRef.current
    const timers: number[] = []

    timers.push(window.setTimeout(() => setShowHamza(true), reduced ? 80 : 210))
    timers.push(window.setTimeout(() => setPhase(3), reduced ? 320 : 880))

    return () => timers.forEach(window.clearTimeout)
  }, [phase, visible])

  // Phase 3 — type the random startup command, then run it.
  useEffect(() => {
    if (!visible || phase !== 3) return
    const reduced = reducedRef.current
    const timers: number[] = []

    if (reduced) {
      setCmd(seq.cmd)
      timers.push(window.setTimeout(() => setPhase(4), 220))
    } else {
      const lead = 150
      const per = 46
      for (let i = 1; i <= seq.cmd.length; i += 1) {
        timers.push(window.setTimeout(() => setCmd(seq.cmd.slice(0, i)), lead + i * per))
      }
      const typedAt = lead + seq.cmd.length * per
      timers.push(window.setTimeout(() => setPhase(4), typedAt + 330))
    }

    return () => timers.forEach(window.clearTimeout)
  }, [phase, visible, seq.cmd])

  // Phase 4 — initialization. Drive a non-linear progress curve: rapid start,
  // slow middle, quick finish (p = t + 0.14·sin(2πt), monotonic over [0,1]).
  useEffect(() => {
    if (!visible || phase !== 4) return
    const reduced = reducedRef.current

    if (!tonePlayedRef.current) {
      tonePlayedRef.current = true
      if (!reduced) playInterfaceTone()
    }

    const duration = reduced ? 300 : 1500
    const startTs = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTs) / duration)
      const eased = reduced ? t : t + 0.14 * Math.sin(2 * Math.PI * t)
      setProgress(Math.max(0, Math.min(100, Math.round(eased * 100))))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        progressHoldRef.current = window.setTimeout(() => setPhase(5), reduced ? 160 : 240)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      if (progressHoldRef.current) window.clearTimeout(progressHoldRef.current)
    }
  }, [phase, visible])

  // Phase 5 — READY holds briefly, then hand off to the fade.
  useEffect(() => {
    if (!visible || phase !== 5) return
    const reduced = reducedRef.current
    const hold = window.setTimeout(() => setPhase(6), reduced ? 320 : 580)
    return () => window.clearTimeout(hold)
  }, [phase, visible])

  // Phase 6 — fade complete: unmount the overlay and remember we have booted.
  useEffect(() => {
    if (!visible || phase !== 6) return
    const done = window.setTimeout(() => {
      setVisible(false)
      markSeen()
    }, BOOT.skipFadeDuration)
    return () => window.clearTimeout(done)
  }, [phase, visible])

  const fading = phase >= 6
  const initializing = phase >= 4
  const filledCells = Math.round((progress / 100) * PROGRESS_CELLS)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 overflow-hidden bg-[#05070A]"
          style={{ zIndex: Z_INDEX.boot }}
          initial={{ opacity: 1 }}
          animate={{ opacity: fading ? 0 : 1 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 boot-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: initializing ? 0.05 : 0.012 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          />
          <div className="scanline-texture opacity-60" />

          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px bg-[linear-gradient(to_right,transparent,rgba(var(--mode-rgb),0.55),transparent)] shadow-[0_0_14px_rgba(var(--mode-rgb),0.24)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: initializing ? 1 : 0, opacity: initializing ? 1 : 0 }}
            transition={{ duration: 0.54, ease: [0.25, 0.1, 0.25, 1] }}
          />

          <div className="absolute left-1/2 top-1/2 w-[min(82vw,560px)] -translate-x-1/2 -translate-y-1/2">
            <div className="font-mono text-sm leading-[1.9] text-[rgba(230,241,255,0.85)]">
              {/* Line 1 — the whoami prompt */}
              <div className="flex items-center min-h-[1.9em]">
                <span className="mr-2 text-[rgba(var(--mode-rgb),0.55)]">&gt;</span>
                <span>{whoami}</span>
                {phase <= 1 && <span className="boot-cursor" />}
              </div>

              {/* Line 2 — printed identity */}
              {phase >= 2 && (
                <div className="flex items-center min-h-[1.9em]">
                  <span className="text-[rgba(var(--mode-rgb),0.72)]">{showHamza ? "hamza" : ""}</span>
                  {phase === 2 && <span className="boot-cursor" />}
                </div>
              )}

              {/* Line 3 — the operator startup command */}
              {phase >= 3 && (
                <div className="flex items-center min-h-[1.9em]">
                  <span className="mr-2 text-[rgba(var(--mode-rgb),0.55)]">&gt;</span>
                  <span>{cmd}</span>
                  {phase === 3 && <span className="boot-cursor" />}
                </div>
              )}
            </div>

            {/* Initialization block */}
            <motion.div
              className="mt-6 font-mono text-sm"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: initializing ? 1 : 0, y: initializing ? 0 : 4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="subsystem-label mb-3" style={{ color: "rgba(var(--mode-rgb),0.6)" }}>
                {seq.status}
              </div>

              <div className="mb-2 text-[0.7rem] tracking-[0.22em] text-[rgba(230,241,255,0.5)]">
                SYSTEM INITIALIZING
              </div>

              <div className="boot-bar flex items-center gap-3">
                <span>
                  <span style={{ color: "rgba(var(--mode-rgb),0.35)" }}>[</span>
                  <span
                    style={{
                      color: "rgb(var(--mode-rgb))",
                      textShadow: "0 0 8px rgba(var(--mode-rgb),0.5)",
                    }}
                  >
                    {"█".repeat(filledCells)}
                  </span>
                  <span style={{ color: "rgba(var(--mode-rgb),0.16)" }}>
                    {"░".repeat(PROGRESS_CELLS - filledCells)}
                  </span>
                  <span style={{ color: "rgba(var(--mode-rgb),0.35)" }}>]</span>
                </span>
                <span className="tabular-nums text-[rgba(230,241,255,0.7)]">{progress}%</span>
                {phase >= 5 && (
                  <span
                    className="tracking-[0.2em]"
                    style={{
                      color: "rgb(var(--mode-rgb))",
                      textShadow: "0 0 10px rgba(var(--mode-rgb),0.45)",
                    }}
                  >
                    READY
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
