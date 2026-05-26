"use client"

import Link from "next/link"
import { Download, FileText, ShieldCheck } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { fadeUp, staggerContainer, staggerItem, duration } from "@/lib/motion"

const resumeHref = "/Hamza-Shaikh-CV.pdf"

const dossier = [
  ["Role", "Backend / Infrastructure / SRE"],
  ["Focus", "Reliability, observability, operational ownership"],
  ["Base", "Kaiserslautern · Dammam · Mumbai"],
  ["Education", "M.Sc. Computer Science, Distributed Systems"],
]

const capabilities = [
  "Production infrastructure ownership",
  "Prometheus / PromQL alerting systems",
  "Docker Compose and ECS/Fargate operations",
  "FastAPI, Go daemons, automation pipelines",
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
      <div className="section-sep" />

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
                    Infrastructure engineer with production DevOps ownership and a distributed
                    systems academic track.
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
                <p className="subsystem-label mb-4">CAPABILITY INDEX</p>
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
        </div>
      </div>
    </section>
  )
}
