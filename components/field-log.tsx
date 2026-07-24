"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp } from "@/lib/motion"
import { SectionSep } from "@/components/section-sep"

/**
 * Field Log — a deliberately un-navigated archive. There is no nav link to it;
 * you only reach it by scrolling past the CV. Entries are being rebuilt; for now
 * the section holds a placeholder rather than stale content.
 */
export function FieldLog() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <section id="fieldlog" ref={ref} data-zone-archive="true">
      <SectionSep />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Section label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-4 mb-6"
          >
            <span className="subsystem-label" style={{ color: "rgba(var(--mode-rgb), 0.4)" }}>
              ARCHIVE
            </span>
            <span
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.15), transparent)",
                maxWidth: "160px",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
              Field Log
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.05 }}
            className="font-mono text-xs tracking-[0.18em] uppercase"
            style={{ color: "rgba(var(--mode-rgb), 0.5)" }}
          >
            Coming soon
          </motion.p>

        </div>
      </div>
    </section>
  )
}
