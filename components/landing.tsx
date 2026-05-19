"use client"

import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { staggerContainer, staggerItem } from "@/lib/motion"

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
          background: "linear-gradient(to bottom, transparent, #05070A)",
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

        {/* ── Subsystem boot header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="subsystem-label">
            CORE
          </span>
          <span
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(to right, rgba(var(--mode-rgb), 0.25), transparent)",
              maxWidth: "120px",
            }}
          />
          <span className="subsystem-label" style={{ opacity: 0.3 }}>
            v2.0
          </span>
        </motion.div>

        {/* ── Main identity block ────────────────────────────────────────── */}
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer(0.07, 0.1)}
          initial="hidden"
          animate="visible"
        >
          {/* Name — small, precise */}
          <motion.p
            variants={staggerItem}
            className="font-mono text-xs mb-5 tracking-widest uppercase"
            style={{ color: "rgba(var(--mode-rgb), 0.55)" }}
          >
            Hamza Shaikh
          </motion.p>

          {/* Core positioning — Space Grotesk, cinematic weight */}
          <motion.h1
            variants={staggerItem}
            className="text-3xl md:text-4xl font-light leading-tight mb-8 text-balance"
            style={{
              color: "#E6F1FF",
              letterSpacing: "-0.01em",
              lineHeight: "1.25",
            }}
          >
            Backend and infrastructure engineer
            <br />
            <span style={{ color: "rgba(170, 182, 195, 0.75)", fontWeight: 300 }}>
              focused on reliability, observability,
              <br />
              and operational ownership.
            </span>
          </motion.h1>

          {/* Academic grounding */}
          <motion.p
            variants={staggerItem}
            className="text-sm leading-relaxed mb-10"
            style={{ color: "rgba(107, 118, 132, 1)" }}
          >
            M.Sc. Distributed Systems, RPTU Kaiserslautern-Landau.
            <span className="mx-2" style={{ color: "rgba(79, 223, 255, 0.25)" }}>
              /
            </span>
            Previously sole DevOps owner at a production B2C startup.
          </motion.p>

          {/* Location */}
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-2 mb-10"
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: "rgba(var(--mode-rgb), 0.35)" }} />
            <span className="font-mono text-xs tracking-wider" style={{ color: "rgba(107, 118, 132, 0.8)" }}>
              Kaiserslautern · Dammam · Mumbai
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
              SIGNAL · available for infrastructure roles
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
