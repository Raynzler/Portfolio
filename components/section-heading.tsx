"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, ruleDraw } from "@/lib/motion"

/**
 * Section heading: the subsystem code as a small eyebrow with its rule, over
 * the section's real title (an h2, or an h3 for a part of a chapter). The
 * plain title carries the hierarchy; the code is flavour, hidden from screen
 * readers so they hear the title once.
 */
export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  className = "",
}: {
  eyebrow: string
  title: string
  as?: "h2" | "h3"
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px 0px" })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      <div className="mb-3 flex items-center gap-4" aria-hidden="true">
        <span className="subsystem-label">{eyebrow}</span>
        <motion.span
          variants={ruleDraw}
          className="h-px max-w-[160px] flex-1 origin-left"
          style={{ background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.18), transparent)" }}
        />
      </div>
      <Tag className={Tag === "h2" ? "section-title" : "section-subtitle"}>{title}</Tag>
    </motion.div>
  )
}
