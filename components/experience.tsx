"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion"

const experiences = [
  {
    company: "Patil Kaki",
    note: "Shark Tank India B2C Startup",
    role: "DevOps Intern, sole infrastructure owner",
    period: "Jun – Aug 2023",
    description:
      "Only engineer responsible for the production stack while the company scaled.",
    achievements: [
      "EC2 to ECS/Fargate migration with zero-downtime cutover",
      "GitHub Actions gated deploys with automated rollback on health check failure",
      "BullMQ/Redis async queue for order processing",
      "CloudWatch + ALB observability stack",
      "25% OpEx reduction through right-sizing and reserved capacity",
    ],
    outcome: "Stack still in production.",
  },
  {
    company: "CMP Infotech",
    note: "Microsoft Partner",
    role: "Java Intern",
    period: "Dec 2021 – Jan 2022",
    description: "Desktop application development in Java.",
    achievements: [
      "School management system with multi-user access control",
      "Java Swing UI with MySQL persistence via JDBC",
    ],
    outcome: null,
  },
]

const education = [
  {
    institution: "RPTU Kaiserslautern-Landau",
    degree: "M.Sc. Computer Science",
    focus: "Distributed Systems",
    period: "Oct 2025 – 2027",
    location: "Germany",
  },
  {
    institution: "Xavier Institute of Engineering",
    degree: "B.E. Information Technology",
    focus: "CGPA 8.69/10",
    period: "2020 – 2024",
    location: "Mumbai",
  },
]

function SectionLabel({ subsystem, title }: { subsystem: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <span className="subsystem-label">
        {subsystem}
      </span>
      <span
        className="h-px flex-1"
        style={{
          background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.15), transparent)",
          maxWidth: "160px",
        }}
      />
      <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
        {title}
      </span>
    </div>
  )
}

function ExperienceBlock({
  exp,
  index,
}: {
  exp: (typeof experiences)[0]
  index: number
}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <motion.article
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
    >
      <div
        className="tron-panel rounded-sm p-6"
      >
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              {exp.company}
              {exp.note && (
                <span className="font-mono text-xs ml-2 font-normal" style={{ color: "var(--foreground-dim)" }}>
                  · {exp.note}
                </span>
              )}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--foreground-dim)" }}>
              {exp.role}
            </p>
          </div>
          <span className="font-mono text-xs shrink-0" style={{ color: "var(--foreground-dim)" }}>
            {exp.period}
          </span>
        </div>

        <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--foreground-dim)" }}>
          {exp.description}
        </p>

        <motion.ul
          variants={staggerContainer(0.045)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-2 mb-4"
        >
          {exp.achievements.map((a, i) => (
            <motion.li
              key={i}
              variants={staggerItem}
              className="text-xs pl-4 leading-relaxed"
                style={{
                  color: "var(--foreground-muted)",
                  borderLeft: "1px solid rgba(var(--mode-rgb), 0.14)",
                }}
            >
              {a}
            </motion.li>
          ))}
        </motion.ul>

        {exp.outcome && (
          <p className="font-mono text-xs mt-3" style={{ color: "rgba(var(--mode-rgb), 0.6)" }}>
            {exp.outcome}
          </p>
        )}
      </div>
    </motion.article>
  )
}

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const sectionInView = useInView(sectionRef, { once: true, margin: "-40px 0px" })

  const eduRef = useRef<HTMLDivElement>(null)
  const eduInView = useInView(eduRef, { once: true, margin: "-40px 0px" })

  return (
    <section id="experience" className="clu-zone">
      <div className="section-sep" />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Experience */}
          <div ref={sectionRef}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={sectionInView ? "visible" : "hidden"}
            >
              <SectionLabel subsystem="TRACE" title="Experience" />
            </motion.div>

            <div className="space-y-6 mb-24">
              {experiences.map((exp, idx) => (
                <ExperienceBlock key={idx} exp={exp} index={idx} />
              ))}
            </div>
          </div>

          {/* Education */}
          <div ref={eduRef}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={eduInView ? "visible" : "hidden"}
            >
              <SectionLabel subsystem="ARCHIVE" title="Education" />
            </motion.div>

            <motion.div
              variants={staggerContainer(0.07)}
              initial="hidden"
              animate={eduInView ? "visible" : "hidden"}
              className="space-y-6"
            >
              {education.map((edu, idx) => (
                <motion.article
                  key={idx}
                  variants={staggerItem}
                  className="tron-panel rounded-sm px-6 py-5 flex flex-col md:flex-row md:items-baseline md:justify-between gap-2"
                >
                  <div>
                    <h3 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {edu.institution}
                      <span
                        className="font-mono text-xs ml-2 font-normal"
                        style={{ color: "var(--foreground-dim)" }}
                      >
                        · {edu.location}
                      </span>
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--foreground-dim)" }}>
                      {edu.degree},{" "}
                      <span style={{ color: "var(--foreground-muted)" }}>{edu.focus}</span>
                    </p>
                  </div>
                  <span
                    className="font-mono text-xs shrink-0"
                    style={{ color: "var(--foreground-dim)" }}
                  >
                    {edu.period}
                  </span>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
