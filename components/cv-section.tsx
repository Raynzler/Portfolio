"use client"

import Link from "next/link"
import { Award, Briefcase, Download, FileText, GraduationCap, ShieldCheck } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { fadeUp, staggerContainer, staggerItem, duration } from "@/lib/motion"
import { SectionSep } from "@/components/section-sep"

const resumeHref = "/Hamza-Shaikh-CV.pdf"

const dossier = [
  ["Role", "Infrastructure · Reliability · SRE"],
  ["Focus", "Observability, automated recovery, cloud cost"],
  ["Education", "M.Sc. Computer Science · RPTU Kaiserslautern"],
  ["Base", "Kaiserslautern · Dammam · Mumbai"],
  ["Open to", "SRE / Platform / DevOps · Europe & GCC"],
]

const capabilities = [
  "Sole DevOps ownership of a production stack",
  "Prometheus / PromQL / Alertmanager observability",
  "AWS ECS / Fargate and Docker Compose operations",
  "GitHub Actions CI/CD with automated rollback",
  "Python and Go automation",
]

const education = [
  {
    school: "RPTU Kaiserslautern-Landau",
    place: "Kaiserslautern, Germany",
    degree: "M.Sc. Computer Science",
    detail: "Major: Distributed Systems · Minor: Software Engineering",
    period: "Oct 2025 – 2027",
  },
  {
    school: "Xavier Institute of Engineering",
    place: "Mumbai, India",
    degree: "B.E. Information Technology",
    detail: "CGPA 8.69 / 10 (German eq. 1.6)",
    period: "Aug 2020 – Jun 2024",
  },
]

const experience = [
  {
    role: "DevOps Engineering Intern · Sole Infrastructure Owner",
    org: "Patil Kaki · Shark Tank India B2C startup",
    period: "Jun – Aug 2023",
    points: [
      "Migrated production from EC2 to ECS/Fargate; that deploy pipeline is still running 3+ years on.",
      "GitHub Actions CI/CD gating main with rollback; a BullMQ-on-Redis queue for async jobs.",
      "Cut cloud OpEx by 25% and ran incident response on the live stack.",
    ],
  },
  {
    role: "Java Development Intern",
    org: "CMP Infotech · Microsoft Partner Program",
    period: "Dec 2021 – Jan 2022",
    points: [
      "Built a school management desktop app in Java Swing on a MySQL/JDBC backend.",
    ],
  },
]

const certifications = [
  { name: "AWS Certified Cloud Practitioner", year: "2023" },
  { name: "Postman API Fundamentals · Student Expert", year: "2023" },
]

export function CvSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true
    fetch(resumeHref, { method: "HEAD" })
      .then((response) => {
        if (isMounted) setPdfAvailable(response.ok)
      })
      .catch(() => {
        if (isMounted) setPdfAvailable(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const downloadDisabled = pdfAvailable === false

  return (
    <section id="cv" ref={ref}>
      <SectionSep />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-4 mb-16"
          >
            <span className="subsystem-label">DOSSIER</span>
            <span className="h-px flex-1 max-w-[180px] bg-[linear-gradient(to_right,rgba(var(--mode-rgb),0.16),transparent)]" />
            <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
              Curriculum Vitae
            </span>
          </motion.div>

          <motion.div
            variants={staggerContainer(0.06, 0.04)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]"
          >
            <motion.div variants={staggerItem} className="tron-panel cv-dossier rounded-sm p-6">
              <div className="mb-8 flex items-start justify-between gap-6">
                <div>
                  <p className="subsystem-label mb-3">PERSONNEL FILE</p>
                  <h2 className="text-xl font-light tracking-normal text-[#E6F1FF]">
                    Hamza Shaikh
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[rgba(170,182,195,0.72)]">
                    Infrastructure and reliability engineer. Sole DevOps owner at a Shark Tank India
                    B2C startup, now doing a distributed systems master&apos;s at RPTU. Shipped
                    SentinelSOL, building AutoSRE.
                  </p>
                </div>
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[rgba(var(--mode-rgb),0.52)]" />
              </div>

              <div className="mb-8 space-y-3">
                {dossier.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[86px_1fr] gap-4 border-b border-[rgba(var(--mode-rgb),0.07)] pb-3"
                  >
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[rgba(var(--mode-rgb),0.38)]">
                      {label}
                    </span>
                    <span className="text-xs leading-relaxed text-[rgba(170,182,195,0.78)]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-8">
                <p className="subsystem-label mb-4">CAPABILITIES</p>
                <div className="space-y-2">
                  {capabilities.map((capability, index) => (
                    <div key={capability} className="flex items-center gap-3">
                      <span
                        className="tactical-dot"
                        style={{ animationDelay: `${index * 0.42}s` }}
                      />
                      <span className="text-xs text-[rgba(170,182,195,0.72)]">
                        {capability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={resumeHref}
                download
                aria-disabled={downloadDisabled}
                tabIndex={downloadDisabled ? -1 : undefined}
                className={`group inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[rgba(var(--mode-rgb),0.20)] bg-[rgba(var(--mode-rgb),0.045)] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-[rgba(230,241,255,0.82)] transition-colors hover:border-[rgba(var(--mode-rgb),0.40)] hover:bg-[rgba(var(--mode-rgb),0.075)]${downloadDisabled ? " pointer-events-none opacity-60" : ""}`}
                style={{ transitionDuration: `${duration.hover * 1000}ms` }}
              >
                <Download className="h-3.5 w-3.5 text-[rgba(var(--mode-rgb),0.66)] transition-transform group-hover:-translate-y-0.5" />
                Download PDF
              </Link>
            </motion.div>

            <motion.div variants={staggerItem} className="tron-panel document-viewer rounded-sm">
              <div className="flex items-center justify-between border-b border-[rgba(var(--mode-rgb),0.08)] px-5 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-3.5 w-3.5 text-[rgba(var(--mode-rgb),0.5)]" />
                  <span className="font-mono text-xs text-[rgba(170,182,195,0.7)]">
                    Hamza-Shaikh-CV.pdf
                  </span>
                </div>
                <span className="subsystem-label">VERIFIED</span>
              </div>

              <div className="relative overflow-hidden p-4 sm:p-6">
                <div className="document-scan" aria-hidden="true" />
                <div className="mx-auto aspect-[8.5/11] max-h-[620px] w-full max-w-[440px] overflow-hidden rounded-[2px] border border-[rgba(var(--mode-rgb),0.14)] bg-[#F1F5F8] shadow-[0_0_36px_rgba(var(--mode-rgb),0.06)]">
                  {pdfAvailable ? (
                    <iframe
                      title="CV PDF preview"
                      src={`${resumeHref}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="h-full w-full bg-[#F1F5F8]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center text-xs text-[rgba(107,118,132,0.7)]">
                      {pdfAvailable === false ? "CV preview unavailable." : "Loading preview..."}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Dossier detail — education, experience, recognition ─────────── */}
          <motion.div
            variants={staggerContainer(0.06, 0.05)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-6 grid gap-6 lg:grid-cols-2"
          >
            {/* Education */}
            <motion.div variants={staggerItem} className="tron-panel rounded-sm p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <GraduationCap className="h-3.5 w-3.5 text-[rgba(var(--mode-rgb),0.55)]" />
                <span className="subsystem-label">Education</span>
              </div>
              <div className="space-y-5">
                {education.map((e) => (
                  <div key={e.school}>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {e.degree}
                      </h3>
                      <span className="font-mono text-[0.65rem] shrink-0" style={{ color: "var(--foreground-dim)" }}>
                        {e.period}
                      </span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: "var(--foreground-muted)" }}>
                      {e.school} · {e.place}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--foreground-dim)" }}>
                      {e.detail}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recognition */}
            <motion.div variants={staggerItem} className="tron-panel rounded-sm p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <Award className="h-3.5 w-3.5 text-[rgba(var(--mode-rgb),0.55)]" />
                <span className="subsystem-label">Recognition</span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    3rd place · Superteam Germany / neosfer Solana Ideathon
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--foreground-dim)" }}>
                    Frankfurt 2026 · $250 · for SentinelSOL
                  </p>
                </div>

                <div className="border-t border-[rgba(var(--mode-rgb),0.07)] pt-4">
                  <p className="subsystem-label mb-3" style={{ color: "rgba(var(--mode-rgb),0.4)" }}>
                    Certifications
                  </p>
                  <div className="space-y-2">
                    {certifications.map((c) => (
                      <div key={c.name} className="flex items-baseline justify-between gap-3">
                        <span className="text-xs" style={{ color: "var(--foreground-muted)" }}>
                          {c.name}
                        </span>
                        <span className="font-mono text-[0.65rem] shrink-0" style={{ color: "var(--foreground-dim)" }}>
                          {c.year}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[rgba(var(--mode-rgb),0.07)] pt-4">
                  <p className="subsystem-label mb-2" style={{ color: "rgba(var(--mode-rgb),0.4)" }}>
                    Publication
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                    GridCast · IEEE ICSPCRE 2024 (Paper ID 652), B.E. capstone (submitted)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div variants={staggerItem} className="tron-panel rounded-sm p-6 lg:col-span-2">
              <div className="mb-5 flex items-center gap-2.5">
                <Briefcase className="h-3.5 w-3.5 text-[rgba(var(--mode-rgb),0.55)]" />
                <span className="subsystem-label">Experience</span>
              </div>
              <div className="space-y-6">
                {experience.map((x) => (
                  <div key={x.role}>
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                      <h3 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {x.role}
                      </h3>
                      <span className="font-mono text-[0.65rem] shrink-0" style={{ color: "var(--foreground-dim)" }}>
                        {x.period}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--foreground-dim)" }}>
                      {x.org}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {x.points.map((p, i) => (
                        <li
                          key={i}
                          className="text-xs leading-relaxed pl-4"
                          style={{
                            color: "var(--foreground-muted)",
                            borderLeft: "1px solid rgba(var(--mode-rgb), 0.14)",
                          }}
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
