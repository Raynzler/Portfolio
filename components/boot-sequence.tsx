"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BOOT, Z_INDEX } from "@/lib/constants"
import { bringGridOnline, usePrefersReducedMotion } from "@/lib/grid-runtime"

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

// sessionStorage never changes under us mid-render, so there is nothing to
// subscribe to; useSyncExternalStore is used for its client/server split.
const subscribeNothing = () => () => {}

// Run `fn` at `offset` ms after the boot started (an absolute point on the
// BOOT timeline), however late the calling effect ran.
function afterBoot(startedAt: number, offset: number, fn: () => void) {
  return window.setTimeout(fn, Math.max(0, startedAt + offset - performance.now()))
}

function bootPending() {
  // A deep link (/#cv, /#contact, ...) is someone heading for one section:
  // land them on it straight away, without the boot.
  const target = window.location.hash.slice(1)
  if (target && document.getElementById(target)) return false
  try {
    return !sessionStorage.getItem(BOOT.storageKey)
  } catch {
    // sessionStorage may be unavailable (private mode); boot simply replays.
    return true
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
 *  6  fade out into the portfolio; the Grid comes online underneath
 *
 * Timing lives in one place, BOOT.timeline (lib/constants): 6s from the first
 * black frame to a finished, usable homepage. Any key, click or tap skips
 * straight to phase 6.
 */
export function BootSequence() {
  // Read on the client only (the server snapshot is false), so the overlay
  // never renders during hydration.
  const pending = useSyncExternalStore(subscribeNothing, bootPending, () => false)
  const [finished, setFinished] = useState(false)
  const visible = pending && !finished
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)
  const [whoami, setWhoami] = useState("")
  const [showHamza, setShowHamza] = useState(false)
  const [cmd, setCmd] = useState("")
  const [progress, setProgress] = useState(0)
  // Random startup routine, chosen once per mount on the client. The overlay
  // never renders during hydration (the server snapshot keeps it hidden), so
  // the client-only randomness cannot cause a hydration mismatch.
  const [seq] = useState(pickSequence)

  const skipRef = useRef(false)
  const tonePlayedRef = useRef(false)
  const reducedRef = useRef(false)
  // performance.now() at the overlay's first frame. Every beat is scheduled
  // against it (not against the previous beat), so render latency between
  // phases never accumulates and the boot lands on BOOT.totalMs.
  const startRef = useRef(0)

  const markSeen = () => {
    try {
      sessionStorage.setItem(BOOT.storageKey, "1")
    } catch {
      // sessionStorage may be unavailable (private mode); boot simply replays.
    }
  }

  // Repeat visit (or the boot has just finished): the Grid comes online with
  // the page. Reads storage live rather than `pending`, which is still the
  // server snapshot during the hydration pass.
  useEffect(() => {
    if (!bootPending()) bringGridOnline()
  }, [pending])

  // Overlay shown: start the clock, wire skip, kick the chain.
  useEffect(() => {
    if (!visible) return

    startRef.current = performance.now()
    reducedRef.current =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // A skip goes straight to the hand-off, whatever the schedule says.
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

    const t = reducedRef.current ? BOOT.reducedTimeline : BOOT.timeline
    const begin = afterBoot(startRef.current, t.prompt, () => setPhase(1))

    return () => {
      window.removeEventListener("keydown", skip)
      window.removeEventListener("click", skip)
      window.clearTimeout(begin)
    }
  }, [visible, seq])

  // Phase 1 — type `whoami`, then ENTER (advance to the printed identity).
  useEffect(() => {
    if (!visible || phase !== 1) return
    const t = reducedRef.current ? BOOT.reducedTimeline : BOOT.timeline
    const start = t.prompt
    const timers: number[] = []

    if (reducedRef.current) {
      setWhoami(WHOAMI)
    } else {
      const lead = 100
      const per = (t.whoami - lead - 260) / WHOAMI.length
      for (let i = 1; i <= WHOAMI.length; i += 1) {
        timers.push(afterBoot(startRef.current, start + lead + i * per, () => setWhoami(WHOAMI.slice(0, i))))
      }
    }
    timers.push(afterBoot(startRef.current, start + t.whoami, () => setPhase(2)))

    return () => timers.forEach(window.clearTimeout)
  }, [phase, visible])

  // Phase 2 — cursor lands on the new line, then `hamza` prints; ENTER again.
  useEffect(() => {
    if (!visible || phase !== 2) return
    const t = reducedRef.current ? BOOT.reducedTimeline : BOOT.timeline
    const start = t.prompt + t.whoami
    const timers = [
      afterBoot(startRef.current, start + (reducedRef.current ? 80 : 180), () => setShowHamza(true)),
      afterBoot(startRef.current, start + t.identity, () => setPhase(3)),
    ]
    return () => timers.forEach(window.clearTimeout)
  }, [phase, visible])

  // Phase 3 — type the random startup command, then run it. The command types
  // inside a fixed window whatever its length, so the total never depends on
  // which routine was picked.
  useEffect(() => {
    if (!visible || phase !== 3) return
    const t = reducedRef.current ? BOOT.reducedTimeline : BOOT.timeline
    const start = t.prompt + t.whoami + t.identity
    const timers: number[] = []

    if (reducedRef.current) {
      setCmd(seq.cmd)
    } else {
      const lead = 100
      const per = (t.command - lead - 240) / seq.cmd.length
      for (let i = 1; i <= seq.cmd.length; i += 1) {
        timers.push(afterBoot(startRef.current, start + lead + i * per, () => setCmd(seq.cmd.slice(0, i))))
      }
    }
    timers.push(afterBoot(startRef.current, start + t.command, () => setPhase(4)))

    return () => timers.forEach(window.clearTimeout)
  }, [phase, visible, seq.cmd])

  // Phase 4 — initialization. Drive a non-linear progress curve: rapid start,
  // slow middle, quick finish (p = t + 0.14·sin(2πt), monotonic over [0,1]),
  // then hold a beat at 100%.
  useEffect(() => {
    if (!visible || phase !== 4) return
    const reduced = reducedRef.current
    const t = reduced ? BOOT.reducedTimeline : BOOT.timeline
    const start = t.prompt + t.whoami + t.identity + t.command

    if (!tonePlayedRef.current) {
      tonePlayedRef.current = true
      if (!reduced) playInterfaceTone()
    }

    const duration = t.progress - (reduced ? 160 : 180)
    const origin = startRef.current + start
    let raf = 0
    let next = 0

    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - origin) / duration))
      const eased = reduced ? p : p + 0.14 * Math.sin(2 * Math.PI * p)
      setProgress(Math.max(0, Math.min(100, Math.round(eased * 100))))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        next = afterBoot(startRef.current, start + t.progress, () => setPhase(5))
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(next)
    }
  }, [phase, visible])

  // Phase 5 — READY holds, then hand off on schedule.
  useEffect(() => {
    if (!visible || phase !== 5) return
    const t = reducedRef.current ? BOOT.reducedTimeline : BOOT.timeline
    const handoffAt = t.prompt + t.whoami + t.identity + t.command + t.progress + t.ready
    const hold = afterBoot(startRef.current, handoffAt, () => setPhase(6))
    return () => window.clearTimeout(hold)
  }, [phase, visible])

  // Phase 6 — the overlay fades and the Grid powers up beneath it, so the hero
  // comes online as the terminal clears. Then unmount and remember the boot.
  // Relative timing on purpose: a skip enters here at any moment.
  useEffect(() => {
    if (!visible || phase !== 6) return
    bringGridOnline()
    const done = window.setTimeout(() => {
      markSeen()
      setFinished(true)
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
          className="fixed inset-0 overflow-hidden"
          // Clicks reach the page as soon as the hand-off starts.
          style={{ zIndex: Z_INDEX.boot, pointerEvents: fading ? "none" : undefined }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* Backdrop and terminal clear first; the progress line stays and
              drops into the Grid horizon as the Grid powers up beneath. */}
          <motion.div
            className="absolute inset-0 bg-[#05070A]"
            initial={false}
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 boot-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: initializing ? 0.05 : 0.012 }}
              transition={{ duration: 0.62, ease: "easeOut" }}
            />
            <div className="scanline-texture opacity-60" />

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

            {/* Skip hint — the skip handler above takes any key, click or tap.
                Pointer and touch wording swap in CSS (globals.css). */}
            <motion.p
              className="boot-skip-hint subsystem-label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
            >
              <span className="boot-skip-pointer">Press any key or click to skip</span>
              <span className="boot-skip-touch">Tap to skip</span>
            </motion.p>
          </motion.div>

          {/* Progress line. On hand-off it drops from centre to the Grid's
              horizon and dissolves there, so the terminal becomes the Grid. */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px bg-[linear-gradient(to_right,transparent,rgba(var(--mode-rgb),0.55),transparent)] shadow-[0_0_14px_rgba(var(--mode-rgb),0.24)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={
              fading
                ? { scaleX: 1, opacity: [1, 1, 0], y: reducedMotion ? 0 : "13vh" }
                : { scaleX: initializing ? 1 : 0, opacity: initializing ? 1 : 0 }
            }
            transition={
              fading
                ? { duration: 0.8, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.8, times: [0, 0.6, 1] } }
                : { duration: 0.54, ease: [0.25, 0.1, 0.25, 1] }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
