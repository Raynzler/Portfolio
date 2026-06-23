"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion"
import { SectionSep } from "@/components/section-sep"

/**
 * Field Log — a deliberately un-navigated archive. There is no nav link to it;
 * you only reach it by scrolling past the CV. The entries are field notes:
 * what the room was actually about and what carried back into the work, not a
 * list of conferences attended. Dates are at the granularity I can stand behind.
 */
type Tag = "SOLANA" | "ETHEREUM" | "AI" | "BUILD"

interface LogEntry {
  event: string
  location: string
  date: string
  tag: Tag
  note: string
}

const entries: LogEntry[] = [
  {
    event: "Solana Summit Germany",
    location: "Berlin, DE",
    date: "Jun 2026",
    tag: "SOLANA",
    note: "Superteam Germany's flagship. Tracks on validator economics, stablecoin rails, and Solana as infrastructure, the same ecosystem the SentinelSOL ideathon ran under.",
  },
  {
    event: "Berlin Blockchain Week",
    location: "Berlin, DE",
    date: "Jun 2026",
    tag: "ETHEREUM",
    note: "Protocol-layer week (Protocol Berg, DappCon). Consensus internals, data availability, and what running a node actually costs an operator.",
  },
  {
    event: "Agentic AI Engineering",
    location: "Berlin, DE",
    date: "2026",
    tag: "AI",
    note: "Agent orchestration and evaluation. Most of the hard problems were reliability ones: retries, tool-call failure handling, observability for non-deterministic systems.",
  },
  {
    event: "ETH Day",
    location: "Berlin, DE",
    date: "2025",
    tag: "ETHEREUM",
    note: "Client diversity and validator tooling. A useful contrast to Solana's single-client reality when reasoning about failure domains.",
  },
  {
    event: "Solana Hacker House",
    location: "Mumbai, IN",
    date: "Sep 2023",
    tag: "SOLANA",
    note: "RPC operations and validator sessions with Solana Labs engineers. First real look at the telemetry gaps SentinelSOL later went after.",
  },
  {
    event: "Solana Hacker House",
    location: "Bengaluru, IN",
    date: "2022",
    tag: "SOLANA",
    note: "Hands-on with the program model and the validator architecture: Anchor, accounts, and how a vote actually lands on-chain.",
  },
  {
    event: "Google DevFest",
    location: "Mumbai, IN",
    date: "2022",
    tag: "BUILD",
    note: "GDG cloud-native track. Containers, CI, and platform tooling across the Google developer stack.",
  },
  {
    event: "Hack This Fall",
    location: "Online",
    date: "2023",
    tag: "BUILD",
    note: "Shipped a working build under a 48-hour clock. Good practice for scoping hard and cutting the right corners.",
  },
  {
    event: "Hack The League",
    location: "Online",
    date: "2023",
    tag: "BUILD",
    note: "Team build, tight deadline. Reinforced that the boring parts (deploys, env parity, a health check) decide whether a demo survives.",
  },
]

const tagColor: Record<Tag, string> = {
  SOLANA: "rgba(var(--mode-rgb), 0.6)",
  ETHEREUM: "rgba(170, 182, 195, 0.7)",
  AI: "rgba(var(--mode-rgb), 0.6)",
  BUILD: "rgba(170, 182, 195, 0.6)",
}

export function FieldLog() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <section id="fieldlog" ref={ref} data-zone-archive="true">
      <SectionSep />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Section label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-4 mb-6"
          >
            <span className="subsystem-label" style={{ color: "rgba(var(--mode-rgb), 0.4)" }}>
              ARCHIVE
            </span>
            <span
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.15), transparent)",
                maxWidth: "160px",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
              Field Log
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.05 }}
            className="text-xs leading-relaxed mb-12 max-w-md"
            style={{ color: "var(--foreground-dim)" }}
          >
            Not in the navigation. If you found this, you went looking. Field notes from the
            infrastructure and crypto ecosystems I&apos;ve spent time in.
          </motion.p>

          <motion.ol
            variants={staggerContainer(0.05, 0.08)}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-px"
            style={{ background: "rgba(var(--mode-rgb), 0.07)" }}
          >
            {entries.map((entry) => (
              <motion.li
                key={`${entry.event}-${entry.date}`}
                variants={staggerItem}
                className="field-log-row px-5 py-4"
                style={{ background: "var(--bg-panel)" }}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    className="font-mono text-[0.65rem] tracking-[0.12em] shrink-0 w-[150px] max-[640px]:w-auto"
                    style={{ color: "rgba(var(--mode-rgb), 0.5)" }}
                  >
                    {entry.date} · {entry.location}
                  </span>
                  <h3 className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                    {entry.event}
                  </h3>
                  <span
                    className="font-mono text-[0.6rem] tracking-[0.14em] ml-auto"
                    style={{ color: tagColor[entry.tag] }}
                  >
                    {entry.tag}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed mt-2 pl-[150px] max-[640px]:pl-0"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  {entry.note}
                </p>
              </motion.li>
            ))}
          </motion.ol>

          {/* Colophon — the inspiration, discovered rather than announced */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
            className="mt-10 font-mono text-[0.6rem] leading-relaxed tracking-[0.1em]"
            style={{ color: "rgba(var(--mode-rgb), 0.28)" }}
          >
            COLOPHON // interface built as a working operator console. visual language borrowed
            from the Grid. end of line.
          </motion.p>

        </div>
      </div>
    </section>
  )
}
