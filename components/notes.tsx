"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp } from "@/lib/motion"

export function Notes() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <section id="notes" ref={ref}>
      <div className="section-sep" />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Section label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-4 mb-16"
          >
            <span className="subsystem-label" style={{ color: "rgba(79, 223, 255, 0.45)" }}>
              ARCHIVE
            </span>
            <span
              className="h-px"
              style={{
                width: "120px",
                background: "linear-gradient(to right, rgba(79, 223, 255, 0.15), transparent)",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "rgba(107, 118, 132, 0.5)" }}>
              Technical Writing
            </span>
          </motion.div>

          {/* Coming soon — honest archive state */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.07 }}
            className="tron-panel rounded-sm"
          >
            {/* Archive header bar */}
            <div
              className="flex items-center gap-3 px-6 py-3 border-b"
              style={{ borderColor: "rgba(110, 231, 249, 0.08)" }}
            >
              <span className="subsystem-label" style={{ color: "rgba(79, 223, 255, 0.35)" }}>
                LOG
              </span>
              <span
                className="w-px h-3"
                style={{ background: "rgba(79, 223, 255, 0.15)" }}
              />
              <span className="font-mono text-xs" style={{ color: "rgba(107, 118, 132, 0.5)" }}>
                notes.index
              </span>
              {/* Blinking cursor */}
              <span
                className="font-mono text-xs ml-1"
                style={{
                  color: "rgba(79, 223, 255, 0.6)",
                  animation: "cursor-blink 1.2s step-end infinite",
                }}
              >
                _
              </span>
            </div>

            <div className="px-6 py-8">
              <p className="text-sm mb-2" style={{ color: "rgba(230, 241, 255, 0.8)" }}>
                Notes in progress.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(107, 118, 132, 0.8)" }}>
                Writing on distributed systems patterns, observability practices, and incident
                response learnings. Topics queued: PromQL Z-Score alerting, ECS zero-downtime
                migrations, LSTM temporal partitioning.
              </p>
              <p className="font-mono text-xs mt-6" style={{ color: "rgba(79, 223, 255, 0.35)" }}>
                STATUS · pending_publish
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
