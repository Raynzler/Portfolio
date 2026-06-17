"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion"

const toolCategories = [
  { name: "Languages",      items: ["Go", "Python", "Bash", "C++"] },
  { name: "Infrastructure", items: ["Docker", "Kubernetes", "Terraform", "Linux"] },
  { name: "Observability",  items: ["Prometheus", "PromQL", "Grafana", "Alertmanager"] },
  { name: "Cloud",          items: ["AWS", "GCP", "Azure", "OCI", "DigitalOcean"] },
  { name: "CI / Automation",items: ["GitHub Actions", "CI/CD", "NGINX"] },
  { name: "Data & Queues",  items: ["Redis", "BullMQ", "MySQL", "SQLite"] },
]

const certifications = [
  { name: "AWS Certified Cloud Practitioner", year: "2023" },
  { name: "Postman API Fundamentals · Student Expert", year: "2023" },
]

export function Tools() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-60px 0px" })

  const certRef = useRef<HTMLDivElement>(null)
  const certInView = useInView(certRef, { once: true, margin: "-40px 0px" })

  return (
    <section id="stack" ref={sectionRef}>
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
            <span className="subsystem-label" style={{ color: "rgba(var(--mode-rgb), 0.45)" }}>
              IO
            </span>
            <span
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.15), transparent)",
                maxWidth: "160px",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
              Stack &amp; Capabilities
            </span>
          </motion.div>

          {/* Tool grid */}
          <motion.div
            variants={staggerContainer(0.06, 0.05)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px mb-16"
            style={{ background: "rgba(var(--mode-rgb), 0.06)" }}
          >
            {toolCategories.map((category) => (
              <motion.div
                key={category.name}
                variants={staggerItem}
                className="px-5 py-5"
                style={{ background: "var(--background)" }}
              >
                <h3
                  className="subsystem-label mb-3"
                  style={{ color: "rgba(var(--mode-rgb), 0.4)" }}
                >
                  {category.name}
                </h3>
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
          <div ref={certRef}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={certInView ? "visible" : "hidden"}
              className="flex items-center gap-4 mb-8"
            >
              <span className="subsystem-label" style={{ color: "rgba(var(--mode-rgb), 0.4)" }}>
                SIGNAL
              </span>
              <span
                className="h-px"
                style={{
                  width: "80px",
                  background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.15), transparent)",
                }}
              />
              <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
                Certifications
              </span>
            </motion.div>

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
                  <span className="text-xs flex-1" style={{ color: "var(--foreground-muted)" }}>
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
      </div>
    </section>
  )
}
