"use client"

import { useRef } from "react"
import type { LucideIcon } from "lucide-react"
import { useScrollScrub } from "@/lib/use-scroll-scrub"

/**
 * Architecture Reveal — a system explained as a scrubbed data flow, not a card
 * reveal. As the card scrolls, the signal propagates stage by stage down the
 * path: each node comes online, the connecting rail fills, and the header reads
 * out the stage you're on. The point is comprehension of how the system runs,
 * so every stage carries one line of what actually happens there.
 *
 * Same scrub mechanism as the incident replay (see useScrollScrub): CSS-var
 * driven, no rAF, no full-width transforms, cannot overflow.
 */
export interface ArchStage {
  label: string
  body: string
  icon: LucideIcon
}

export function ArchitectureReveal({
  title,
  flow,
  stages,
  metrics,
}: {
  title: string
  flow: string
  stages: ArchStage[]
  metrics?: { value: string; label: string }[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useScrollScrub(ref, stages.length)

  return (
    <div className="sentinel-visual arch-reveal mb-8" ref={ref}>
      <div className="sentinel-visual-bar">
        <div className="flex items-center gap-3">
          <span className="incident-pip" aria-hidden="true" />
          <span className="font-mono text-xs text-[rgba(230,241,255,0.78)]">{title}</span>
        </div>
        <span className="arch-readout font-mono">
          <span className="arch-readout-dim">{flow} ·</span> {stages[active].label}
        </span>
      </div>

      <ol className="arch-flow" aria-label={`${title} data flow`}>
        <div className="arch-rail-base" aria-hidden="true" />
        <div className="arch-rail-fill" aria-hidden="true" />

        {stages.map((stage, i) => {
          const state = i < active ? "past" : i === active ? "active" : "future"
          const Icon = stage.icon
          return (
            <li key={stage.label} className="arch-stage" data-state={state}>
              <span className="arch-node" aria-hidden="true">
                <Icon className="h-4 w-4" />
              </span>
              <div className="arch-body">
                <span className="arch-label">{stage.label}</span>
                <p className="arch-desc">{stage.body}</p>
              </div>
            </li>
          )
        })}
      </ol>

      {metrics && metrics.length > 0 && (
        <div className="sentinel-metric-rail" aria-label="Operating metrics">
          {metrics.map((m) => (
            <span key={m.label}>
              <b>{m.value}</b>
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
