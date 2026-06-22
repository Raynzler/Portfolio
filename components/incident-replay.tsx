"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Incident Replay — a single SentinelSOL detection, scrubbed by scroll.
 *
 * Not a reveal, not a slideshow. As the card scrolls a playhead travels the
 * timeline, each step comes online in order, and the status board (state + T+
 * clock) advances the way it would during a real incident. The automated half
 * (signal -> 3sigma -> PromQL -> Alertmanager -> Telegram) takes ~1m13s; the
 * human half (investigation -> resolution) is where the minutes go.
 *
 * Implementation: one rAF-throttled scroll handler writes progress to a CSS
 * variable (--p) that drives the rail fill (scaleY) and playhead (top) with no
 * React re-render; only the active-step index is state, and it changes at most
 * 8 times. Everything is opacity / scaleY / top% inside the card, so it cannot
 * overflow the viewport.
 */
type Phase = "BASELINE" | "DETECT" | "ALERT" | "RESPOND" | "RESOLVED"

interface Step {
  t: string
  phase: Phase
  title: string
  detail: string
}

const STEPS: Step[] = [
  {
    t: "T+00:00",
    phase: "BASELINE",
    title: "Vote Credit Velocity",
    detail: "Per-slot vote-credit accrual tracked against a 72h rolling mean. Nominal.",
  },
  {
    t: "T+00:06",
    phase: "DETECT",
    title: "Deviation Detected",
    detail: "Accrual rate drifts below the mean; earnings slow before a single vote is missed.",
  },
  {
    t: "T+00:12",
    phase: "DETECT",
    title: "Threshold Breached",
    detail: "Z-score crosses 3σ against the rolling baseline. Noise filtered out; this is real.",
  },
  {
    t: "T+01:12",
    phase: "DETECT",
    title: "PromQL Evaluation",
    detail: "Recording rule feeds the alert expression; it stays true across the for: 1m window.",
  },
  {
    t: "T+01:13",
    phase: "ALERT",
    title: "Alertmanager Triggered",
    detail: "Grouped, deduplicated, routed by severity. One page, no flapping.",
  },
  {
    t: "T+01:14",
    phase: "ALERT",
    title: "Telegram Notification",
    detail: "Operator paged in-channel with validator identity, the metric, and its current value.",
  },
  {
    t: "T+02:00",
    phase: "RESPOND",
    title: "Operator Investigation",
    detail: "Check Jito block-engine bundle acceptance and peer set; correlate with the epoch boundary.",
  },
  {
    t: "T+06:30",
    phase: "RESOLVED",
    title: "Resolution",
    detail: "Peer set reconnected before delinquency. Credit velocity re-stabilises; 0 slots lost.",
  },
]

const STATE: Record<Phase, { label: string; tone: number }> = {
  BASELINE: { label: "NOMINAL", tone: 0.5 },
  DETECT: { label: "DETECTING", tone: 0.78 },
  ALERT: { label: "ALERTING", tone: 1 },
  RESPOND: { label: "INVESTIGATING", tone: 0.86 },
  RESOLVED: { label: "RESOLVED", tone: 0.62 },
}

export function IncidentReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduced) {
      el.style.setProperty("--p", "1")
      setActive(STEPS.length - 1)
      return
    }

    // Geometry is cached on mount / resize / reflow so the scroll handler only
    // reads window.scrollY (no per-frame getBoundingClientRect -> no layout
    // thrash). Updating directly in the scroll event is frame-paced by the
    // browser and avoids requestAnimationFrame (which some embedded/background
    // renderers pause).
    let docTop = 0
    let height = 0
    let vh = 0
    const measure = () => {
      const r = el.getBoundingClientRect()
      docTop = r.top + window.scrollY
      height = r.height
      vh = window.innerHeight
    }
    const update = () => {
      const elTop = docTop - window.scrollY
      // progress: 0 when the card top sits at 82% of the viewport (entering from
      // below), 1 when the card bottom reaches 40% of the viewport (scrolled up).
      const enter = vh * 0.82
      const exitTop = 0.4 * vh - height
      const denom = enter - exitTop || 1
      const p = Math.max(0, Math.min(1, (enter - elTop) / denom))
      el.style.setProperty("--p", p.toFixed(4))
      const idx = Math.max(0, Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)))
      setActive((prev) => (prev === idx ? prev : idx))
    }
    const onResize = () => {
      measure()
      update()
    }

    measure()
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", onResize)
    // Re-measure when layout shifts (e.g. the dashboard image finishes loading).
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null
    ro?.observe(document.body)

    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", onResize)
      ro?.disconnect()
    }
  }, [])

  const current = STEPS[active]
  const state = STATE[current.phase]

  return (
    <div className="sentinel-visual incident-replay mb-8" ref={ref}>
      <div className="sentinel-visual-bar">
        <div className="flex items-center gap-3">
          <span className="incident-pip" aria-hidden="true" />
          <span className="font-mono text-xs text-[rgba(230,241,255,0.78)]">Incident Replay</span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="incident-status font-mono"
            style={{
              color: `rgba(var(--mode-rgb), ${(0.55 + state.tone * 0.45).toFixed(2)})`,
              borderColor: `rgba(var(--mode-rgb), ${(0.18 + state.tone * 0.3).toFixed(2)})`,
              background: `rgba(var(--mode-rgb), ${(0.04 + state.tone * 0.06).toFixed(2)})`,
            }}
          >
            <span className="incident-status-dot" />
            {state.label}
          </span>
          <span className="incident-clock font-mono tabular-nums">{current.t}</span>
        </div>
      </div>

      <ol
        className="incident-steps"
        aria-label="SentinelSOL incident timeline, vote-credit velocity to resolution"
      >
        <div className="incident-rail-base" aria-hidden="true" />
        <div className="incident-rail-fill" aria-hidden="true" />
        <div className="incident-playhead" aria-hidden="true" />

        {STEPS.map((step, i) => {
          const stepState = i < active ? "past" : i === active ? "active" : "future"
          return (
            <li key={step.t + step.title} className="incident-step" data-state={stepState}>
              <span className="incident-time font-mono">{step.t}</span>
              <span className="incident-marker" aria-hidden="true" />
              <div className="incident-body">
                <div className="flex items-center gap-2">
                  <span className="incident-title">{step.title}</span>
                  <span className="incident-phase font-mono">{step.phase}</span>
                </div>
                <p className="incident-detail">{step.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="incident-summary">
        <span>
          <b>1m13s</b>
          detect to page · automated
        </span>
        <span>
          <b>~5m</b>
          page to resolve · operator
        </span>
        <span>
          <b>0</b>
          slots delinquent
        </span>
      </div>
    </div>
  )
}
