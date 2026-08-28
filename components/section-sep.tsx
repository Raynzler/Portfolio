"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ease } from "@/lib/motion"

/**
 * Section separator as a route. The boundary line sits dim until the next
 * subsystem comes into view, then the route activates: a brighter line grows
 * from the centre outward (scaleX, origin centre — never wider than its own
 * box, so it cannot overflow). One of the five motion primitives: routes
 * activate.
 */
export function SectionSep() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })

  return (
    <div ref={ref} className="section-sep" aria-hidden="true">
      <motion.span
        className="section-sep-pulse"
        initial={{ scaleX: 0.18, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0.18, opacity: 0 }}
        transition={{ duration: 0.55, ease: ease.outSoft }}
      />
    </div>
  )
}
