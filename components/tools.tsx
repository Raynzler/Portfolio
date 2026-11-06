"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion"
import { SectionHeading } from "@/components/section-heading"

// Mirrors the CV's skill groups. Nothing appears here that isn't on the CV —
// that is what makes the caption below the grid true.
const toolCategories = [
  { name: "Infrastructure", items: ["Docker", "Docker Compose", "Linux", "NGINX", "Kubernetes (foundational)"] },
  { name: "Observability",  items: ["Prometheus", "PromQL", "Grafana", "Alertmanager", "RED metrics", "SLOs"] },
  { name: "Cloud",          items: ["AWS", "Cloudflare", "DigitalOcean"] },
  { name: "Languages",      items: ["Go", "Python", "Bash", "C++"] },
  { name: "Automation",     items: ["Git", "GitHub Actions", "CI/CD"] },
  { name: "Security",       items: ["Trivy", "Bandit", "pip-audit", "govulncheck"] },
  { name: "Storage & APIs", items: ["Redis", "BullMQ", "MySQL", "FastAPI"] },
  { name: "Testing",        items: ["pytest", "chaos engineering"] },
]

const certifications = [
  { name: "AWS Certified Cloud Practitioner", year: "2023" },
  { name: "Postman API Fundamentals · Student Expert", year: "2023" },
]

/**
 * Skills and certifications, the last part of the Experience chapter (no
 * longer a section of its own). It keeps id="stack", so /#stack links and the
 * deep-link boot bypass still land here.
 */
export function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  const certRef = useRef<HTMLDivElement>(null)
  const certInView = useInView(certRef, { once: true, margin: "-40px 0px" })

  return (
    <div id="stack" ref={ref} className="mt-20">
      <SectionHeading eyebrow="IO" title="Skills" as="h3" className="mb-4" />

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="text-sm leading-relaxed mb-8 max-w-md"
        style={{ color: "var(--foreground-dim)" }}
      >
        What I reach for, grouped by where it sits in the stack. Listed because I&apos;ve shipped
        or operated something with it, not to pad a list.
      </motion.p>

      {/* Tool grid: two rows of four on wide screens, so no cell sits empty */}
      <motion.div
        variants={staggerContainer(0.06, 0.05)}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px mb-16"
        style={{ background: "rgba(var(--mode-rgb), 0.06)" }}
      >
        {toolCategories.map((category) => (
          <motion.div
            key={category.name}
            variants={staggerItem}
            className="px-5 py-5"
            style={{ background: "var(--background)" }}
          >
            <h4 className="subsystem-label mb-3">{category.name}</h4>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="stack-tag font-mono text-xs px-2 py-0.5 rounded-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Certifications */}
      <SectionHeading eyebrow="SIGNAL" title="Certifications" as="h3" className="mb-6" />

      <div ref={certRef}>
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate={certInView ? "visible" : "hidden"}
          className="space-y-3"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.name}
              variants={staggerItem}
              className="flex items-center gap-4 tron-panel rounded-sm px-5 py-3"
            >
              {/* Illuminated dot */}
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  background: "rgba(var(--mode-rgb), 0.5)",
                  boxShadow: "0 0 4px rgba(var(--mode-rgb), 0.3)",
                }}
              />
              <span className="text-sm flex-1" style={{ color: "var(--foreground-muted)" }}>
                {cert.name}
              </span>
              <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
                {cert.year}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
