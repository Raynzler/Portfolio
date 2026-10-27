"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { SCROLL, Z_INDEX } from "@/lib/constants"
import { coupleToSignal, prefersReducedMotion, surgeSignal } from "@/lib/grid-runtime"

const COMMANDS: Record<string, string> = {
  whoami: "hamza / infrastructure operator",
  flynn: "FLYNN / user signal acknowledged",
  clu: "CLU / control plane standing by",
  encom: "ENCOM / archived network trace",
  grid: "THE GRID / distant traffic online",
  endofline: "END OF LINE / program terminated",
  disc: "IDENTITY DISC / data secured",
  tron: "TRON / he fights for the users",
  portal: "I/O TOWER / connection open",
}

const ZONE_IDS = ["home", "projects", "experience", "stack", "cv", "fieldlog", "contact"]

// Traffic riding the perspective floor. `lane` counts grid lines from the
// centre (the floor's background is centred to match), so trails ride the
// lines. "in" runs toward the viewer, "out" recedes to the horizon.
const FLOOR_LANES = [
  { lane: -7, dir: "in", tone: "cyan", duration: 7.5, delay: -2 },
  { lane: -3, dir: "out", tone: "cyan", duration: 10, delay: -6.5 },
  { lane: 2, dir: "in", tone: "cyan", duration: 6.5, delay: -4 },
  { lane: 5, dir: "out", tone: "ember", duration: 12, delay: -1 },
  { lane: 9, dir: "in", tone: "cyan", duration: 8.5, delay: -7.5 },
] as const

export function SystemAtmosphere() {
  const [egg, setEgg] = useState<string | null>(null)
  const [creds, setCreds] = useState(false)
  const floorRef = useRef<HTMLDivElement>(null)
  const transitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!floorRef.current) return
    return coupleToSignal(floorRef.current, "floor-", 0.7)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    let forcedClu = false
    let diagnostic = false
    let lastC = 0
    let buffer = ""

    const experience = document.getElementById("experience")
    const observer = experience
      ? new IntersectionObserver(
          ([entry]) => {
            const intensity = forcedClu ? 1 : Math.min(1, Math.max(0, entry.intersectionRatio * 1.35))
            root.style.setProperty("--clu-intensity", intensity.toFixed(2))
            root.classList.toggle("clu-active", (entry.isIntersecting || intensity > 0.18) && !forcedClu)
          },
          {
            rootMargin: "-22% 0px -34% 0px",
            threshold: [0, 0.08, 0.16, 0.28, 0.42, 0.58, 0.74, 0.9, 1],
          }
        )
      : null

    if (experience && observer) observer.observe(experience)

    // Section atmosphere states — data-zone is whichever section crosses a thin
    // band on the nav's activation line, so the background can shift subtly per
    // zone (see globals.css). A band, not intersection ratios: a section taller
    // than the viewport (PROJECTS) can never reach a high ratio, so it used to
    // register late. This is the "moving through systems" cue: signal up on
    // PROJECTS, archive feel on FIELD LOG, calm shutdown on CONTACT. EXPERIENCE
    // warmth is the CLU pass. Each change sends one faint transit sweep through
    // the Grid in the direction of travel, with a short traffic surge.
    const transit = (down: boolean) => {
      const sweep = transitRef.current
      if (!sweep || document.hidden || prefersReducedMotion()) return
      const [from, to] = down ? ["-30vh", "104vh"] : ["104vh", "-30vh"]
      sweep.animate(
        [
          { transform: `translate3d(0, ${from}, 0)`, opacity: 0 },
          { opacity: 1, offset: 0.25 },
          { opacity: 1, offset: 0.7 },
          { transform: `translate3d(0, ${to}, 0)`, opacity: 0 },
        ],
        { duration: 1500, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      )
      surgeSignal(0.45)
    }

    const line = SCROLL.activationFraction * 100
    const crossing = new Map<string, number>()
    let zone = ""
    const zoneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.set(entry.target.id, entry.intersectionRect.height)
          else crossing.delete(entry.target.id)
        }
        let next = zone
        let best = -1
        for (const [id, height] of crossing) {
          if (height >= best) {
            best = height
            next = id
          }
        }
        if (!next || next === zone) return
        const from = ZONE_IDS.indexOf(zone)
        zone = next
        root.dataset.zone = next
        if (from !== -1) transit(ZONE_IDS.indexOf(next) > from)
      },
      { rootMargin: `-${line}% 0px -${99 - line}% 0px`, threshold: 0 }
    )
    for (const id of ZONE_IDS) {
      const el = document.getElementById(id)
      if (el) zoneObserver.observe(el)
    }

    const showEgg = (value: string) => {
      setEgg(value)
      window.setTimeout(() => setEgg(null), 1800)
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCreds(false)
      if (event.metaKey || event.altKey) return

      // Ctrl+Shift+D: diagnostic mode toggle
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault()
        diagnostic = !diagnostic
        root.classList.toggle("diagnostic-active", diagnostic)
        showEgg(diagnostic ? "DIAGNOSTIC MODE / subsystems visible" : "DIAGNOSTIC MODE / disengaged")
        return
      }

      if (event.ctrlKey) return
      const key = event.key.toLowerCase()

      // Double-tap C: CLU/Flynn toggle
      if (key === "c") {
        const now = Date.now()
        if (now - lastC < 420) {
          forcedClu = !forcedClu
          root.classList.toggle("clu-forced", forcedClu)
          root.classList.toggle("clu-active", forcedClu)
          root.style.setProperty("--clu-intensity", forcedClu ? "1" : "0")
          showEgg(forcedClu ? "CLU MODE / manual override" : "FLYNN MODE / restored")
        }
        lastC = now
      }

      if (/^[a-z0-9]$/.test(key)) {
        buffer = (buffer + key).slice(-16)
        for (const [command, response] of Object.entries(COMMANDS)) {
          if (buffer.endsWith(command)) showEgg(response)
        }
        // Recruiter command palette — type "credentials" or "whois" to surface
        // a fast credential read-out. Hidden by design; no UI advertises it.
        if (buffer.endsWith("credentials") || buffer.endsWith("whois")) {
          setCreds(true)
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => {
      observer?.disconnect()
      zoneObserver.disconnect()
      window.removeEventListener("keydown", onKey)
      root.style.removeProperty("--clu-intensity")
      delete root.dataset.zone
      root.classList.remove("clu-active", "clu-forced", "diagnostic-active")
    }
  }, [])

  return (
    <>
      <div className="system-atmosphere" aria-hidden="true">
        <div className="grid-field" />
        <div className="grid-horizon">
          <div className="grid-horizon-plane" />
          <div className="grid-floor" ref={floorRef}>
            {FLOOR_LANES.map((trail) => (
              <span
                key={trail.lane}
                className="floor-trail"
                data-dir={trail.dir}
                data-tone={trail.tone}
                style={
                  {
                    "--lane": trail.lane,
                    animationDuration: `${trail.duration}s`,
                    animationDelay: `${trail.delay}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
        <div className="grid-horizon-glow" />
        <div className="zone-transit" ref={transitRef} />
        <div className="traffic-layer traffic-layer-a" />
        <div className="traffic-layer traffic-layer-b" />
        <div className="traffic-layer traffic-layer-c" />
        <div className="trace-highway trace-highway-a" />
        <div className="trace-highway trace-highway-b" />
        <div className="scanline-texture" />
      </div>

      {egg && (
        <div className="diagnostic-overlay" role="status" aria-live="polite" style={{ zIndex: Z_INDEX.diagnostic }}>
          <span>{egg}</span>
        </div>
      )}

      {creds && (
        <div
          className="creds-backdrop"
          style={{ zIndex: Z_INDEX.diagnostic }}
          role="dialog"
          aria-modal="true"
          aria-label="Operator credentials"
          onClick={() => setCreds(false)}
        >
          <div className="creds-card" onClick={(event) => event.stopPropagation()}>
            <div className="creds-head">
              <span className="subsystem-label">OPERATOR CREDENTIALS</span>
              <button type="button" className="creds-close" onClick={() => setCreds(false)} aria-label="Close">
                ESC
              </button>
            </div>
            <dl className="creds-list">
              <div>
                <dt>IDENTITY</dt>
                <dd>Hamza Shaikh · Site Reliability / DevOps / Cloud Infrastructure</dd>
              </div>
              <div>
                <dt>EDUCATION</dt>
                <dd>M.Sc. Computer Science · Distributed Systems · RPTU</dd>
              </div>
              <div>
                <dt>AWARD</dt>
                <dd>Winner · Superteam Germany Solana Ideathon</dd>
              </div>
              <div>
                <dt>OWNERSHIP</dt>
                <dd>Former sole DevOps owner · production stack</dd>
              </div>
              <div>
                <dt>CORE STACK</dt>
                <dd>Go · Python · AWS · Docker · Prometheus</dd>
              </div>
            </dl>
            <p className="creds-foot">click anywhere or press esc to dismiss</p>
          </div>
        </div>
      )}
    </>
  )
}
