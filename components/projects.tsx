"use client"

import { ImagePlaceholder } from "./image-placeholder"
import { Activity, BellRing, ExternalLink, RadioTower, Server, ShieldCheck, Trophy } from "lucide-react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { fadeUp, staggerContainer, staggerItem, duration, ease } from "@/lib/motion"

interface Project {
  id: string
  subsystem: string
  title: string
  status: string
  url: string
  tagline: string
  description: string
  stack: string[]
  deployment: string
  award: string | null
  tradeoffs: string[]
  publication?: string
  images?: Record<string, { title: string; description: string; path: string }>
}

const projects: Project[] = [
  {
    id: "sentinelsol",
    subsystem: "DAEMON",
    title: "SentinelSOL",
    status: "live",
    url: "https://sentinelsol-sre.vercel.app",
    tagline: "Out-of-band observability for Solana/Jito validators.",
    description:
      "Go daemons collect ShredStream latency and Vote Credit velocity. PromQL + 3-sigma Z-Score against rolling baseline. Alertmanager routes to Telegram before delinquency. No sidecar, no cloud dependency.",
    stack: ["Go", "Prometheus", "PromQL", "Alertmanager", "Telegram API", "Docker Compose"],
    deployment: "Docker Compose, bare-metal",
    award: "3rd place, Superteam Germany / neosfer Ideathon Frankfurt 2026. $250 USD.",
    tradeoffs: [
      "Out-of-band monitoring over sidecar injection to avoid validator resource contention",
      "3-sigma threshold tuned empirically against 72-hour rolling baseline",
      "Telegram over PagerDuty for cost and latency in crypto ops context",
    ],
  },
  {
    id: "autosre",
    subsystem: "NODE",
    title: "AutoSRE",
    status: "active",
    url: "https://auto-sre.vercel.app",
    tagline: "SRE platform with automated recovery playbooks.",
    description:
      "RED metrics via Prometheus client, 50ms p95 latency budget. Alerting thresholds trigger automated recovery. FastAPI serves the control plane, Docker Compose orchestrates services, GitHub Actions handles CI/CD.",
    stack: ["Python", "FastAPI", "Prometheus", "Docker", "Docker Compose", "GitHub Actions"],
    deployment: "Docker Compose + GitHub Actions CI/CD",
    award: null,
    tradeoffs: [
      "FastAPI over Flask for async support and OpenAPI generation",
      "50ms p95 budget chosen based on downstream service SLOs",
      "Automated recovery limited to stateless services to avoid data corruption",
    ],
  },
  {
    id: "gridcast",
    subsystem: "VECTOR",
    title: "GridCast",
    status: "shipped",
    url: "https://heatwave-watch-system.vercel.app",
    tagline: "LSTM-based regional temperature forecasting system.",
    description:
      "28 LSTM models across 7 regions × 4 IMD seasons. 70 years of daily max temperature grids (1951–2021). 14-step input window, 7-step forecast. Optuna TPE per-subset hyperparameter search.",
    stack: ["Python", "TensorFlow", "Keras", "LSTM", "Flask", "React.js", "Optuna", "GeoPandas"],
    deployment: "Flask inference API + React frontend",
    publication: "IEEE ICSPCRE 2024, Paper ID 652",
    award: null,
    tradeoffs: [
      "Region × season model partitioning over single global model for interpretability",
      "14-step input window balances temporal context vs. computational cost",
      "Optuna TPE over grid search for efficient hyperparameter exploration",
    ],
  },
]

const statusColors = {
  live:    { bg: "rgba(var(--mode-rgb), 0.08)",  text: "var(--cyan-bright)", dot: "var(--cyan-bright)"  },
  active:  { bg: "rgba(var(--mode-rgb), 0.05)",  text: "var(--cyan)",        dot: "var(--cyan)"        },
  shipped: { bg: "rgba(107, 118, 132, 0.12)",    text: "var(--foreground-muted)", dot: "var(--foreground-dim)"  },
} as const

const sentinelPipeline = [
  { label: "Jito-Solana RPC", icon: RadioTower },
  { label: "Go OOB daemon", icon: Server },
  { label: "Prometheus / PromQL", icon: Activity },
  { label: "Alertmanager → Telegram", icon: BellRing },
]

function SentinelOperationalAssets({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="sentinel-assets mb-8"
      initial={{ opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: duration.reveal, ease: ease.outSoft }}
    >
      <div className="sentinel-visual sentinel-visual-dashboard">
        <div className="sentinel-visual-bar">
          <div className="flex items-center gap-3">
            <img
              src="/sentinelsol/logo.png"
              alt=""
              className="h-5 w-5 object-contain opacity-85"
            />
            <span className="font-mono text-xs text-[rgba(230,241,255,0.76)]">
              SentinelSOL Telemetry
            </span>
          </div>
          <span className="subsystem-label">LIVE GRAPH</span>
        </div>
        <div className="sentinel-graph-frame">
          <img
            src="/sentinelsol/graphs.png"
            alt="SentinelSOL telemetry dashboard showing node slot progression, vote credits, ShredStream ingestion latency, and Jito block engine bundle metrics."
            className="h-full w-full object-cover object-left-top"
          />
          <span className="dashboard-scan" aria-hidden="true" />
        </div>
        <div className="sentinel-metric-rail" aria-label="SentinelSOL operating metrics">
          <span><b>3σ</b>Z-score anomaly window</span>
          <span><b>OOB</b>zero hot-path impact</span>
          <span><b>5s</b>refresh cadence</span>
        </div>
      </div>

      <div className="sentinel-visual sentinel-visual-architecture">
        <div className="sentinel-visual-bar">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-[rgba(var(--mode-rgb),0.54)]" />
            <span className="font-mono text-xs text-[rgba(230,241,255,0.76)]">
              Architecture Overview
            </span>
          </div>
          <span className="subsystem-label">PIPELINE</span>
        </div>

        <div className="architecture-map">
          {sentinelPipeline.map(({ label, icon: Icon }, index) => (
            <div key={label} className="architecture-node">
              <Icon className="h-4 w-4 text-[rgba(var(--mode-rgb),0.58)]" />
              <span>{label}</span>
              {index < sentinelPipeline.length - 1 && <i aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className="architecture-notes">
          <div>
            <span>Predictive</span>
            <p>ShredStream latency and vote-credit velocity move before delinquency.</p>
          </div>
          <div>
            <span>Out-of-band</span>
            <p>Daemon polls independently, preserving validator hot-path resources.</p>
          </div>
          <div>
            <span>Revenue-aware</span>
            <p>Jito bundle acceptance becomes an operating signal, not an epoch post-mortem.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })
  const sc = statusColors[project.status as keyof typeof statusColors] ?? statusColors.shipped

  return (
    <motion.article
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      {/* ── Panel container ────────────────────────────────────────────── */}
      <div
        className="tron-panel project-module rounded-sm overflow-hidden"
        style={{ padding: "0" }}
      >
        {/* Panel top bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center gap-4">
            <span className="subsystem-label" style={{ color: "rgba(var(--mode-rgb), 0.4)" }}>
              {project.subsystem}
            </span>
            <span className="activation-dots" aria-hidden="true">
              <span style={{ animationDelay: `${index * 0.2}s` }} />
              <span style={{ animationDelay: `${index * 0.2 + 0.35}s` }} />
              <span style={{ animationDelay: `${index * 0.2 + 0.7}s` }} />
            </span>
            <span
              className="w-px h-3 block"
              style={{ background: "rgba(var(--mode-rgb), 0.15)" }}
            />
            <h3 className="text-sm font-medium tracking-wide" style={{ color: "var(--foreground)" }}>
              {project.title}
            </h3>
            {/* Status badge */}
            <span
              className="flex items-center gap-1.5 font-mono text-xs px-2 py-0.5 rounded-sm"
              style={{ background: sc.bg, color: sc.text }}
            >
              <span
                className="w-1 h-1 rounded-full"
                style={{
                  background: sc.dot,
                  ...(project.status === "live"
                    ? { animation: "pulse-dot 3s ease-in-out infinite", boxShadow: `0 0 4px ${sc.dot}` }
                    : {}),
                }}
              />
              {project.status}
            </span>
          </div>

          {/* External link */}
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link flex items-center gap-1.5 font-mono text-xs group/link"
          >
            <span>LINK</span>
            <ExternalLink
              className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              style={{ transitionDuration: `${duration.hover * 1000}ms` }}
            />
          </Link>
        </div>

        {/* Panel body */}
        <div className="px-6 py-8">
          {/* Tagline */}
          <p className="text-sm mb-4 font-light" style={{ color: "var(--foreground-muted)" }}>
            {project.tagline}
          </p>

          {/* Award */}
          {project.award && (
            <div
              className="flex items-start gap-3 p-4 rounded-sm mb-6"
              style={{
                background: "rgba(var(--mode-rgb), 0.04)",
                border: "1px solid rgba(var(--mode-rgb), 0.12)",
              }}
            >
              <Trophy className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "var(--cyan-bright)" }} />
              <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                {project.award}
              </p>
            </div>
          )}

          {/* Publication */}
          {"publication" in project && project.publication && (
            <p className="font-mono text-xs mb-6" style={{ color: "var(--foreground-dim)" }}>
              {project.publication}
            </p>
          )}

          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--foreground-dim)" }}>
            {project.description}
          </p>

          <div className="module-telemetry mb-8" aria-hidden="true">
            <div className="telemetry-strip">
              <span style={{ width: "32%", animationDelay: `${index * 0.12}s` }} />
              <span style={{ width: "58%", animationDelay: `${index * 0.12 + 0.08}s` }} />
              <span style={{ width: "44%", animationDelay: `${index * 0.12 + 0.16}s` }} />
            </div>
            <div className="architecture-flow">
              <i />
              <i />
              <i />
              <b />
            </div>
          </div>

          {project.id === "sentinelsol" ? (
            <SentinelOperationalAssets inView={isInView} />
          ) : (
            (() => {
              const imageEntries = Object.values(project.images ?? {})
              if (imageEntries.length === 0) return null
              return (
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {imageEntries.map((image, idx) => (
                    <ImagePlaceholder
                      key={idx}
                      title={image.title}
                      description={image.description}
                      path={image.path}
                    />
                  ))}
                </div>
              )
            })()
          )}

          {/* Tradeoffs */}
          <div className="mb-8">
            <p className="subsystem-label mb-4" style={{ color: "rgba(var(--mode-rgb), 0.35)" }}>
              Tradeoffs
            </p>
            <motion.ul
              variants={staggerContainer(0.05)}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-2"
            >
              {project.tradeoffs.map((tradeoff, idx) => (
                <motion.li
                  key={idx}
                  variants={staggerItem}
                  className="text-xs pl-4 leading-relaxed"
                  style={{
                    color: "var(--foreground-muted)",
                    borderLeft: "1px solid rgba(var(--mode-rgb), 0.14)",
                  }}
                >
                  {tradeoff}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Stack */}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="stack-tag font-mono text-xs px-2 py-0.5 rounded-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function Projects() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-40px 0px" })

  return (
    <section id="projects">
      {/* Section separator */}
      <div className="section-sep" />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Section label */}
          <motion.div
            ref={headerRef}
            variants={fadeUp}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            className="flex items-center gap-4 mb-20"
          >
            <span className="subsystem-label" style={{ color: "rgba(var(--mode-rgb), 0.45)" }}>
              OBSERVE
            </span>
            <span
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, rgba(var(--mode-rgb), 0.15), transparent)",
                maxWidth: "200px",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "var(--foreground-dim)" }}>
              Selected Projects
            </span>
          </motion.div>

          <div className="space-y-8">
            {projects.map((project, i) => (
              <ProjectPanel key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
