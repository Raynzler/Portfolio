"use client"

import { MapPin, ArrowDown, ExternalLink } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/motion"

const proof = [
  { label: "AWARD · 2026", value: "3rd — Superteam Germany Solana Ideathon, Frankfurt" },
  { label: "LIVE SYSTEM", value: "SentinelSOL — Solana validator observability" },
  { label: "M.SC.", value: "Distributed Systems · RPTU Kaiserslautern" },
  { label: "PRODUCTION", value: "Sole DevOps owner · −25% cloud OpEx · live 3+ yrs" },
]

export function Landing() {
  return (
    <section id="home" className="relative min-h-[88vh] flex items-center overflow-hidden">

      {/* ── Atmospheric grid overlay ───────────────────────────────────── */}
      <div
        className="grid-overlay absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `
            linear-gradient(rgba(var(--mode-rgb), 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--mode-rgb), 1) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── Bottom edge fade — blends into next section ───────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      {/* ── Left edge accent line ──────────────────────────────────────── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(var(--mode-rgb), 0.22) 30%, rgba(var(--mode-rgb), 0.34) 60%, transparent 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-12 w-full">


        {/* ── Main identity block ────────────────────────────────────────── */}
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer(0.07, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={staggerItem}
            className="font-mono text-xs mb-5 tracking-widest uppercase"
            style={{ color: "rgba(var(--mode-rgb), 0.55)" }}
          >
            Hamza Shaikh
          </motion.p>

          <motion.h1
            variants={staggerItem}
            className="text-3xl md:text-4xl font-light leading-tight mb-6 text-balance"
            style={{
              color: "var(--foreground)",
              letterSpacing: "-0.01em",
              lineHeight: "1.25",
            }}
          >
            Backend and infrastructure engineer
            <br />
            <span style={{ color: "var(--foreground-muted)", fontWeight: 300 }}>
              focused on reliability, observability,
              <br />
              and operational ownership.
            </span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="text-sm leading-relaxed mb-8 max-w-xl"
            style={{ color: "var(--foreground-dim)" }}
          >
            I design, ship, and operate the systems that keep services alive —
            validator telemetry, Prometheus alerting, CI/CD, and production cloud infrastructure.
          </motion.p>

          {/* ── Proof rail — credibility above the fold ───────────────────── */}
          <motion.div
            variants={staggerItem}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-sm overflow-hidden mb-8"
            style={{
              background: "rgba(var(--mode-rgb), 0.10)",
              border: "1px solid rgba(var(--mode-rgb), 0.10)",
            }}
          >
            {proof.map((item) => (
              <div key={item.label} className="px-4 py-3" style={{ background: "var(--bg-panel)" }}>
                <p className="subsystem-label mb-1.5" style={{ color: "rgba(var(--mode-rgb), 0.5)" }}>
                  {item.label}
                </p>
                <p className="text-xs leading-snug" style={{ color: "var(--foreground)" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* ── Primary actions ───────────────────────────────────────────── */}
          <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              href="#projects"
              className="hero-cta hero-cta-primary inline-flex items-center gap-2 rounded-sm px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em]"
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
            variants={staggerItem}
            className="flex items-center gap-2 mb-6"
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: "rgba(var(--mode-rgb), 0.35)" }} />
            <span className="font-mono text-xs tracking-wider" style={{ color: "var(--foreground-dim)" }}>
              Frankfurt,DE · Dammam,KSA · Mumbai,IND
            </span>
          </motion.div>

          {/* ── Availability signal ───────────────────────────────────── */}
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-3"
          >
            {/* Pulse dot */}
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
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
              SIGNAL · available for infrastructure roles in Germany, Saudi Arabia, and Remote
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
            <path d="M1 24V1h23" stroke="rgba(var(--mode-rgb),0.18)" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  )
}
