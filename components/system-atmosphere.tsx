"use client"

import { useEffect, useState } from "react"
import { Z_INDEX } from "@/lib/constants"

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

export function SystemAtmosphere() {
  const [egg, setEgg] = useState<string | null>(null)
  const [creds, setCreds] = useState(false)

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

    // Section atmosphere states — set data-zone to whichever section is most in
    // view, so the background can shift subtly per zone (see globals.css). This
    // is the "moving through systems" cue: signal up on PROJECTS, archive feel
    // on FIELD LOG, calm shutdown on CONTACT. EXPERIENCE warmth is the CLU pass.
    const ratios = new Map<string, number>()
    const zoneObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio)
        let best = ""
        let bestRatio = 0
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        if (best) root.dataset.zone = best
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
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
        </div>
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
                <dd>Hamza Shaikh · Backend / Infrastructure / SRE</dd>
              </div>
              <div>
                <dt>EDUCATION</dt>
                <dd>M.Sc. Computer Science · Distributed Systems · RPTU</dd>
              </div>
              <div>
                <dt>AWARD</dt>
                <dd>3rd place · Superteam Germany Solana Ideathon</dd>
              </div>
              <div>
                <dt>OWNERSHIP</dt>
                <dd>Former sole DevOps owner · production stack, 3+ yrs</dd>
              </div>
              <div>
                <dt>CORE STACK</dt>
                <dd>Go · Python · AWS · Kubernetes · Prometheus</dd>
              </div>
            </dl>
            <p className="creds-foot">click anywhere or press esc to dismiss</p>
          </div>
        </div>
      )}
    </>
  )
}
