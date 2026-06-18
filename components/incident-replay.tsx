"use client"

import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/motion"

/**
 * Incident Replay — a single SentinelSOL detection walked end to end, the way an
 * operator would reconstruct it from a postmortem. Timestamps are relative to
 * first signal; the gap between ALERT and RESOLVED is the part that matters
 * (automated time-to-alert ~1m13s, human time-to-resolve ~6m). It is a static
 * timeline, not an animation loop — the point is the reasoning, not motion.
 */
type Phase = "DETECT" | "ALERT" | "RESPOND"

interface Step {
  t: string
  title: string
  detail: string
  phase: Phase
  human?: boolean
}

const steps: Step[] = [
  {
    t: "00:00",
    phase: "DETECT",
    title: "Signal detected",
    detail: "Scrape cycle ingests vote-credit counts and ShredStream latency from the validator RPC.",
  },
  {
    t: "00:05",
    phase: "DETECT",
    title: "Vote-credit velocity deviation",
    detail: "Per-slot credit accrual rate falls below the rolling mean — earnings slowing before any miss.",
  },
  {
    t: "00:10",
    phase: "DETECT",
    title: "3-sigma threshold breached",
    detail: "Z-score crosses 3σ against the 72h baseline. Noise filtered; this is a real excursion.",
  },
  {
    t: "01:10",
    phase: "DETECT",
    title: "PromQL holds for 1m",
    detail: "Recording rule feeds the alert expression; it stays true across the `for: 1m` window before firing.",
  },
  {
    t: "01:12",
    phase: "ALERT",
    title: "Alertmanager triggered",
    detail: "Alert grouped and deduplicated, routed by severity. No flapping, one notification.",
  },
  {
    t: "01:13",
    phase: "ALERT",
    title: "Telegram notification",
    detail: "Operator paged in-channel with validator identity, the breaching metric, and current value.",
  },
  {
    t: "02:00",
    phase: "RESPOND",
    human: true,
    title: "Operator investigation",
    detail: "Check Jito block-engine bundle acceptance and peer set; correlate against the epoch boundary.",
  },
  {
    t: "06:30",
    phase: "RESPOND",
    human: true,
    title: "Resolved",
    detail: "Peer set reconnected before delinquency. Credit velocity re-stabilises; baseline re-learns.",
  },
]

const phaseTone: Record<Phase, string> = {
  DETECT: "rgba(var(--mode-rgb), 0.55)",
  ALERT: "rgba(var(--mode-rgb), 0.8)",
  RESPOND: "rgba(230, 241, 255, 0.6)",
}

export function IncidentReplay({ inView }: { inView: boolean }) {
  return (
    <div className="sentinel-visual incident-replay mb-8">
      <div className="sentinel-visual-bar">
        <div className="flex items-center gap-3">
          <span className="incident-pip" aria-hidden="true" />
          <span className="font-mono text-xs text-[rgba(230,241,255,0.76)]">
            Incident Replay
          </span>
        </div>
        <span className="subsystem-label">TIMELINE · 1 EVENT</span>
      </div>

      <motion.ol
        className="incident-track"
        variants={staggerContainer(0.05, 0.05)}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        aria-label="SentinelSOL incident timeline, signal detection to resolution"
      >
        {steps.map((step) => (
          <motion.li
            key={step.t + step.title}
            variants={staggerItem}
            className="incident-step"
            data-human={step.human ? "true" : undefined}
          >
            <span className="incident-time font-mono">{step.t}</span>
            <span className="incident-marker" aria-hidden="true" />
            <div className="incident-body">
              <div className="flex items-center gap-2">
                <span className="incident-title">{step.title}</span>
                <span
                  className="incident-phase font-mono"
                  style={{ color: phaseTone[step.phase] }}
                >
                  {step.human ? "MANUAL" : step.phase}
                </span>
              </div>
              <p className="incident-detail">{step.detail}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>

      <div className="incident-summary">
        <span>
          <b>1m13s</b>
          time to alert · automated
        </span>
        <span>
          <b>~5m</b>
          time to resolve · operator
        </span>
        <span>
          <b>0</b>
          slots delinquent
        </span>
      </div>
    </div>
  )
}
