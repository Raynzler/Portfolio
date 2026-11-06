"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion"
import { SectionSep } from "@/components/section-sep"
import { SectionHeading } from "@/components/section-heading"
import { Skills } from "@/components/tools"

const experiences = [
  {
    company: "Patil Kaki",
    note: "Shark Tank India D2C food brand",
    role: "DevOps Engineering Intern, sole infrastructure owner",
    period: "Jun – Aug 2023",
    description:
      "Sole infrastructure engineer in a 10-person team, behind a storefront running roughly 2,500 orders a month.",
    // The cost result and the outage lead: the two outcomes a reader should not miss.
    achievements: [
      "Migrated production from EC2 to ECS/Fargate; dynamic task provisioning cut AWS spend 27%, $230 to $168 a month",
      "Root-caused a three-day chatbot outage to a whitespace character intermittently injected into the integration URL",
      "Built the AWS network and access layer: VPC subnets, routing, security groups, S3, and least-privilege IAM scoped separately for founders, developers and logistics staff",
      "GitHub Actions pipelines gating main-branch deploys with rollback, supporting weekly releases",
      "Moved fulfilment off the synchronous checkout path with a BullMQ-on-Redis queue",
    ],
    outcome: null,
  },
  {
    company: "CMP Infotech",
    note: "Microsoft Partner",
    role: "Java Development Intern",
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
    focus: "Distributed Systems · Software Engineering",
    period: "Oct 2025 – Expected 2028",
    location: "Germany",
  },
  {
    // Stated rather than left as an unexplained gap — German employers read
    // these closely, and the CV accounts for it explicitly.
    institution: "Career Break & M.Sc. Admissions",
    degree: "Graduate applications and German student visa process",
    focus: "Intake deferred to Oct 2025",
    period: "Jul 2024 – Sep 2025",
    location: "Dammam",
  },
  {
    institution: "Xavier Institute of Engineering",
    degree: "B.E. Information Technology",
    focus: "CGPA 8.69/10 (German equivalent 1.6)",
    period: "Aug 2020 – Jun 2024",
    location: "Mumbai",
  },
]

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
        className="tron-panel relative rounded-sm p-6"
        data-power={isInView ? "on" : "off"}
      >
        <span className="panel-power" aria-hidden="true" />

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-medium" style={{ color: "var(--foreground)" }}>
              {exp.company}
              {exp.note && (
                <span className="font-mono text-xs ml-2 font-normal" style={{ color: "var(--foreground-dim)" }}>
                  · {exp.note}
                </span>
              )}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--foreground-muted)" }}>
              {exp.role}
            </p>
          </div>
          <span className="font-mono text-xs shrink-0" style={{ color: "var(--foreground-dim)" }}>
            {exp.period}
          </span>
        </div>

        <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--foreground-dim)" }}>
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
              className="text-sm pl-4 leading-relaxed"
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
  const eduRef = useRef<HTMLDivElement>(null)
  const eduInView = useInView(eduRef, { once: true, margin: "-40px 0px" })

  return (
    <section id="experience" className="clu-zone">
      <SectionSep />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Experience */}
          <SectionHeading eyebrow="TRACE" title="Experience" className="mb-12" />

          <div className="space-y-6 mb-20">
            {experiences.map((exp, idx) => (
              <ExperienceBlock key={idx} exp={exp} index={idx} />
            ))}
          </div>

          {/* Education */}
          <SectionHeading eyebrow="ARCHIVE" title="Education" as="h3" className="mb-8" />

          <div ref={eduRef}>
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
                    <h4 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      {edu.institution}
                      <span
                        className="font-mono text-xs ml-2 font-normal"
                        style={{ color: "var(--foreground-dim)" }}
                      >
                        · {edu.location}
                      </span>
                    </h4>
                    <p className="text-sm mt-0.5" style={{ color: "var(--foreground-dim)" }}>
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

          {/* Skills and certifications close the chapter */}
          <Skills />
        </div>
      </div>
    </section>
  )
}
