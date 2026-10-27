"use client"

import { MapPin, ArrowDown, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
import {
  ease,
  heroItem,
  heroSequence,
  heroSubline,
  proofCell,
  proofIgnite,
  proofRail,
  proofText,
} from "@/lib/motion"
import { BOOT } from "@/lib/constants"
import { bringGridOnline, useGridOnline, useLiveAttribute } from "@/lib/grid-runtime"

const proof = [
  { label: "AWARD · 2026", value: "Winner · Superteam Germany Solana Ideathon" },
  { label: "LIVE SYSTEM", value: "SentinelSOL · Solana validator observability" },
  { label: "M.SC.", value: "Distributed Systems · RPTU Kaiserslautern" },
  { label: "PRODUCTION", value: "Sole DevOps owner · −27% AWS spend · $230→$168/mo" },
]

export function Landing() {
  // The hero waits for the Grid to come online: as the boot overlay fades on a
  // first visit, straight away on a repeat visit.
  const online = useGridOnline()
  const sectionRef = useRef<HTMLElement>(null)
  useLiveAttribute(sectionRef)

  // Safety net: never leave the hero dark if the boot hand-off is missed.
  useEffect(() => {
    const fallback = window.setTimeout(bringGridOnline, BOOT.totalMs + 2500)
    return () => window.clearTimeout(fallback)
  }, [])

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[88vh] flex items-center overflow-hidden"
    >

      {/* ── Atmospheric grid overlay — masked out toward the bottom edge so
          it blends into the next section. A mask rather than an opaque fade
          band, which would cut across the perspective floor behind it. ── */}
      <div
        className="grid-overlay absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `
            linear-gradient(rgba(var(--mode-rgb), 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--mode-rgb), 1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(to bottom, #000 calc(100% - 8rem), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 calc(100% - 8rem), transparent)",
        }}
      />

      {/* ── Left edge accent line — powers up top to bottom ────────────── */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none origin-top"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(var(--mode-rgb), 0.22) 30%, rgba(var(--mode-rgb), 0.34) 60%, transparent 100%)",
        }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={online ? { scaleY: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.2, ease: ease.outSoft }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-12 w-full">


        {/* ── Main identity block ────────────────────────────────────────── */}
        <motion.div
          className="max-w-2xl"
          variants={heroSequence}
          initial="hidden"
          animate={online ? "visible" : "hidden"}
        >
          <motion.p
            variants={heroItem}
            className="font-mono text-xs mb-5 tracking-widest uppercase"
            style={{ color: "rgba(var(--mode-rgb), 0.55)" }}
          >
            Hamza Shaikh
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="text-3xl md:text-4xl font-light leading-tight mb-6 text-balance"
            style={{
              color: "var(--foreground)",
              letterSpacing: "-0.01em",
              lineHeight: "1.25",
            }}
          >
            Site reliability and infrastructure engineer.
            <br />
            <motion.span variants={heroSubline} style={{ color: "var(--foreground-muted)", fontWeight: 300 }}>
              I keep production systems observable,
              <br />
              quick to recover, and cheap to run.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="text-sm leading-relaxed mb-8 max-w-xl"
            style={{ color: "var(--foreground-dim)" }}
          >
            In practice that&apos;s validator telemetry, Prometheus alerting, CI/CD,
            and the production cloud underneath them, usually with me as the only person on call.
          </motion.p>

          {/* ── Proof rail — credibility above the fold ───────────────────── */}
          <motion.div
            variants={proofRail}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-sm overflow-hidden mb-8"
            style={{
              background: "rgba(var(--mode-rgb), 0.10)",
              border: "1px solid rgba(var(--mode-rgb), 0.10)",
            }}
          >
            {proof.map((item) => (
              <motion.div
                key={item.label}
                variants={proofCell}
                className="relative px-4 py-3"
                style={{ background: "var(--bg-panel)" }}
              >
                <motion.span className="proof-ignite" variants={proofIgnite} aria-hidden="true" />
                <motion.p
                  variants={proofText}
                  className="subsystem-label mb-1.5"
                  style={{ color: "rgba(var(--mode-rgb), 0.5)" }}
                >
                  {item.label}
                </motion.p>
                <motion.p
                  variants={proofText}
                  className="text-xs leading-snug"
                  style={{ color: "var(--foreground)" }}
                >
                  {item.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Primary actions ───────────────────────────────────────────── */}
          <motion.div variants={heroItem} className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              href="#projects"
              className="hero-cta hero-cta-primary cta-sheen inline-flex items-center gap-2 rounded-sm px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em]"
            >
              View Projects
              <ArrowDown className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="https://github.com/Raynzler"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta hero-cta-ghost inline-flex items-center gap-2 rounded-sm px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em]"
            >
              GitHub
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            variants={heroItem}
            className="flex items-center gap-2 mb-6"
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: "rgba(var(--mode-rgb), 0.35)" }} />
            <span className="font-mono text-xs tracking-wider" style={{ color: "var(--foreground-dim)" }}>
              Kaiserslautern,DE · Dammam,KSA · Mumbai,IND
            </span>
          </motion.div>

          {/* ── Availability signal ───────────────────────────────────── */}
          <motion.div
            variants={heroItem}
            className="flex items-center gap-3"
          >
            {/* Pulse dot — pings twice as the hero finishes coming online */}
            <span
              className="signal-dot w-1.5 h-1.5 rounded-full shrink-0"
              style={{
                backgroundColor: "rgb(var(--mode-rgb))",
                animation: "pulse-dot 3.5s ease-in-out infinite",
                boxShadow: "0 0 6px rgba(var(--mode-rgb), 0.5)",
              }}
            />
            <span
              className="font-mono text-xs tracking-wider"
              style={{ color: "rgba(var(--mode-rgb), 0.5)" }}
            >
              SIGNAL · Werkstudent, internship and junior roles in Germany · 140 full / 280 half days work authorisation
            </span>
          </motion.div>
        </motion.div>

        {/* ── Corner geometry — subtle TRON framing ─────────────────────── */}
        <div
          className="absolute bottom-12 right-6 pointer-events-none hidden md:block"
          aria-hidden="true"
        >
          {/* Top-left corner mark */}
          <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M1 24V1h23"
              stroke="rgba(var(--mode-rgb),0.18)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={online ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.9, delay: 0.6, ease: ease.outSoft }}
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
