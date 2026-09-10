"use client"

import {
  Activity,
  BellRing,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  Github,
  Map as MapIcon,
  Network,
  RadioTower,
  RotateCcw,
  Server,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { fadeUp, staggerContainer, staggerItem, duration, ease } from "@/lib/motion"
import { IncidentReplay } from "@/components/incident-replay"
import { ArchitectureReveal, type ArchStage } from "@/components/architecture-reveal"
import { SectionSep } from "@/components/section-sep"

interface PipelineNode {
  label: string
  icon: LucideIcon
}

interface Metric {
  value: string
  label: string
}

interface ArchitectureNote {
  title: string
  body: string
}

interface CaseStudy {
  problem: string
  decisions: string[]
  lessons: string[]
  failureModes: string[]
}

interface Project {
  id: string
  subsystem: string
  title: string
  status: string
  url: string
  repo?: string
  tagline: string
  description: string
  stack: string[]
  deployment: string
  award: string | null
  tradeoffs: string[]
  publication?: string
  pipeline?: PipelineNode[]
  metrics?: Metric[]
  notes?: ArchitectureNote[]
  architecture?: ArchStage[]
  caseStudy?: CaseStudy
}

const projects: Project[] = [
  {
    id: "sentinelsol",
    subsystem: "DAEMON",
    title: "SentinelSOL",
    status: "live",
    url: "https://sentinelsol-sre.vercel.app",
    repo: "https://github.com/Raynzler/SentinelSOL",
    tagline: "Out-of-band observability for Solana validators.",
    description:
      "A Go daemon polls the validator's Solana JSON-RPC out of process and exports vote-credit accrual and slot progression to Prometheus. 3-sigma Z-score over a rolling one-hour baseline, routed through Alertmanager to Telegram.",
    stack: ["Go", "Prometheus", "PromQL", "Alertmanager", "Telegram API", "Docker Compose"],
    deployment: "Docker Compose, bare-metal",
    award: "Winner, Superteam Germany / neosfer Ideathon Frankfurt 2026. $250 USD.",
    tradeoffs: [
      "Out-of-band monitoring over sidecar injection to avoid validator resource contention",
      "3-sigma over a rolling one-hour mean and standard deviation, learned from the validator's own history rather than a fixed threshold",
      "Telegram over PagerDuty for cost and latency in crypto ops context",
    ],
    caseStudy: {
      problem:
        "A validator's rewards slow the moment vote credits drop, but stock dashboards only surface delinquency after it has already cost an epoch. There was no early, out-of-band signal an operator could act on.",
      decisions: [
        "Poll the RPC out-of-band instead of injecting a sidecar; monitoring must never compete with the validator for the hot path.",
        "Detect anomalies with a 3σ Z-score over a rolling one-hour baseline rather than a static threshold, so it adapts to each validator's normal.",
        "Page over Telegram: zero cost, sub-second delivery, and where the crypto-ops conversation already happens.",
      ],
      lessons: [
        "Vote-credit velocity is the leading indicator; slot progression alone lags the actual impact.",
        "A baseline that re-learns is the hard part. A fixed threshold either pages constantly or never fires.",
      ],
      failureModes: [
        "RPC unreachable: the daemon has to alert on its own silence, or an outage reads as calm.",
        "Cold start: the first hour has no baseline, so thresholds stay wide until enough history accrues.",
        "Epoch boundaries cause legitimate velocity dips that must be excluded from paging.",
      ],
    },
  },
  {
    id: "autosre",
    subsystem: "NODE",
    title: "AutoSRE",
    status: "active",
    url: "https://auto-sre.vercel.app",
    repo: "https://github.com/Raynzler/Auto-SRE",
    tagline: "Chaos engineering platform: inject failure into live services and prove the resilience patterns hold.",
    description:
      "Injects latency, errors, CPU burn and memory pressure into live services through a REST control plane. Experiments are bounded, time-limited and self-reverting. RED metrics via ASGI middleware against a p95 500ms SLO, alerting at 750ms.",
    stack: ["Python", "FastAPI", "Prometheus", "Docker", "Docker Compose", "GitHub Actions"],
    deployment: "Docker Compose + GitHub Actions CI/CD",
    award: null,
    pipeline: [
      { label: "FastAPI service · RED metrics", icon: Server },
      { label: "Prometheus scrape + recording rules", icon: Activity },
      { label: "Alertmanager thresholds", icon: BellRing },
      { label: "Runbook-linked alert · human responder", icon: RotateCcw },
    ],
    metrics: [
      { value: "500ms", label: "p95 latency SLO" },
      { value: "RED", label: "rate · errors · duration" },
      { value: "CI/CD", label: "GitHub Actions gated" },
    ],
    notes: [
      {
        title: "Instrumented",
        body: "RED metrics on every request via the Prometheus client (counters, histograms, labeled gauges).",
      },
      {
        title: "Health-checked",
        body: "Readiness returns 503 while a downstream dependency's circuit breaker is open.",
      },
      {
        title: "Reproducible",
        body: "The whole stack comes up with one Docker Compose command. Deploys run through GitHub Actions.",
      },
    ],
    architecture: [
      { label: "Metric", icon: Activity, body: "RED metrics on every request through ASGI middleware, against a p95 500ms SLO." },
      { label: "Alert", icon: BellRing, body: "The budget breaches; Alertmanager fires, grouped and deduplicated by severity." },
      { label: "Bound", icon: Workflow, body: "Every experiment is capped at two layers, time-limited and self-reverting; the control plane is exempt from injection." },
      { label: "Recovery", icon: RotateCcw, body: "Per-client token-bucket rate limiting returns 429 with Retry-After; a three-state circuit breaker sheds load from a failing dependency." },
      { label: "Healthy", icon: ShieldCheck, body: "Readiness returns 503 while a dependency's breaker is open. Auto-remediation is deliberately out of scope." },
    ],
    tradeoffs: [
      "FastAPI over Flask for async support and OpenAPI generation",
      "p95 500ms SLO with a 750ms alert threshold, defined as Prometheus rules",
      "Auto-remediation deliberately out of scope, so failures stay observable rather than being masked by a restart",
    ],
    caseStudy: {
      problem:
        "You cannot claim a system is resilient until you have watched it fail. The hard part is injecting real failure into a live service without the experiment itself becoming the outage.",
      decisions: [
        "Instrument RED metrics on every request so the signal is request-shaped, not host-shaped.",
        "Define the p95 500ms SLO and its 750ms alert threshold as Prometheus rules, unit-tested to assert every alert carries severity and a runbook link.",
        "Keep remediation human: the platform observes and notifies, so a failure stays visible instead of being masked by an automatic restart.",
      ],
      lessons: [
        "Blast radius is the whole design. Bounds at two layers, and an abort path that can never be made unreachable.",
        "Any action that can loop needs a circuit breaker, or the recovery becomes the incident.",
      ],
      failureModes: [
        "An experiment outliving its window: bounds are enforced at module and per-request layers, and every experiment self-reverts.",
        "An experiment that outlives its window: bounds are enforced at two layers and the control plane is exempt from injection so the abort path stays reachable.",
      ],
    },
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
    publication: "IEEE ICSPCRE 2024 · Paper ID 652 (submitted)",
    award: null,
    pipeline: [
      { label: "IMD gridded temperatures · 1951–2021", icon: Database },
      { label: "28 LSTM models · 7 regions × 4 seasons", icon: Cpu },
      { label: "Flask inference API", icon: Server },
      { label: "React + D3 heatwave map", icon: MapIcon },
    ],
    metrics: [
      { value: "28", label: "region × season models" },
      { value: "70 yrs", label: "daily temp grids" },
      { value: "7-day", label: "forecast horizon" },
    ],
    notes: [
      {
        title: "Partitioned",
        body: "Per-region, per-season models over a single global network for interpretability.",
      },
      {
        title: "Tuned",
        body: "Optuna TPE hyperparameter search run independently across all 28 model subsets.",
      },
      {
        title: "Full-stack",
        body: "Flask REST inference backend with a React + D3 geospatial visualisation frontend.",
      },
    ],
    architecture: [
      { label: "Dataset", icon: Database, body: "70 years of IMD daily-max temperature grids, 1951 to 2021, partitioned by region." },
      { label: "Training", icon: Cpu, body: "28 LSTM models, one per region and IMD season, tuned with Optuna TPE per subset." },
      { label: "Forecast", icon: TrendingUp, body: "A 14-step input window predicts a 7-day temperature horizon per cell." },
      { label: "Output", icon: MapIcon, body: "A Flask inference API serves a React and D3 heatwave map." },
    ],
    tradeoffs: [
      "Region × season model partitioning over single global model for interpretability",
      "14-step input window balances temporal context vs. computational cost",
      "Optuna TPE over grid search for efficient hyperparameter exploration",
    ],
    caseStudy: {
      problem:
        "Regional heatwave forecasting has to respect that monsoon-season and dry-season dynamics are different physical regimes. A single global model blurs them together and loses both accuracy and explainability.",
      decisions: [
        "Train 28 per-region, per-season models instead of one network, so each fits its own regime and stays interpretable.",
        "Use a 14-step input window as the balance between temporal context and training cost across all 28 subsets.",
        "Run Optuna TPE per subset rather than grid search; the joint space was too large to sweep.",
      ],
      lessons: [
        "Partitioning by domain knowledge (region × season) beat a larger single model on both accuracy and explainability.",
        "Per-subset tuning is expensive to orchestrate; the bookkeeping across 28 runs was the real engineering.",
      ],
      failureModes: [
        "Sparse subsets: some region/season splits have thin data and overfit without heavier regularisation.",
        "Distribution shift: a 70-year baseline underweights recent warming, so the latest years skew residuals.",
      ],
    },
  },
]

const statusColors = {
  live:    { bg: "rgba(var(--mode-rgb), 0.08)",  text: "var(--cyan-bright)", dot: "var(--cyan-bright)"  },
  active:  { bg: "rgba(var(--mode-rgb), 0.05)",  text: "var(--cyan)",        dot: "var(--cyan)"        },
  shipped: { bg: "rgba(107, 118, 132, 0.12)",    text: "var(--foreground-muted)", dot: "var(--foreground-dim)"  },
} as const

const sentinelPipeline: PipelineNode[] = [
  { label: "Solana JSON-RPC", icon: RadioTower },
  { label: "Go OOB daemon", icon: Server },
  { label: "Prometheus / PromQL", icon: Activity },
  { label: "Alertmanager → Telegram", icon: BellRing },
]

function PipelineMap({ nodes }: { nodes: PipelineNode[] }) {
  return (
    <div className="architecture-map">
      {nodes.map(({ label, icon: Icon }, index) => (
        <div key={label} className="architecture-node">
          <Icon className="h-4 w-4 text-[rgba(var(--mode-rgb),0.58)]" />
          <span>{label}</span>
          {index < nodes.length - 1 && <i aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}

function MetricRail({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="sentinel-metric-rail" aria-label="Operating metrics">
      {metrics.map((m) => (
        <span key={m.label}>
          <b>{m.value}</b>
          {m.label}
        </span>
      ))}
    </div>
  )
}

function ArchitectureNotes({ notes }: { notes: ArchitectureNote[] }) {
  return (
    <div className="architecture-notes">
      {notes.map((n) => (
        <div key={n.title}>
          <span>{n.title}</span>
          <p>{n.body}</p>
        </div>
      ))}
    </div>
  )
}

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
            alt="SentinelSOL Grafana dashboard showing node slot progression and absolute vote credits from the Go telemetry daemon."
            className="h-full w-full object-cover object-left-top"
          />
          <span className="dashboard-scan" aria-hidden="true" />
        </div>
        <MetricRail
          metrics={[
            { value: "3σ", label: "Z-score anomaly window" },
            { value: "OOB", label: "zero hot-path impact" },
            { value: "5s", label: "refresh cadence" },
          ]}
        />
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

        <PipelineMap nodes={sentinelPipeline} />

        <ArchitectureNotes
          notes={[
            { title: "Predictive", body: "Vote-credit velocity moves before the node is marked delinquent." },
            { title: "Out-of-band", body: "Daemon polls independently, preserving validator hot-path resources." },
            { title: "Reproducible", body: "The whole telemetry stack comes up from one Docker Compose command, dashboards provisioned as code." },
          ]}
        />
      </div>
    </motion.div>
  )
}

function CaseStudyList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="subsystem-label mb-3" style={{ color: "rgba(var(--mode-rgb), 0.4)" }}>
        {label}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-xs leading-relaxed pl-4"
            style={{
              color: "var(--foreground-muted)",
              borderLeft: "1px solid rgba(var(--mode-rgb), 0.14)",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CaseStudyBody({ cs }: { cs: CaseStudy }) {
  return (
    <div className="case-study pt-5 grid gap-7">
      <div>
        <p className="subsystem-label mb-3" style={{ color: "rgba(var(--mode-rgb), 0.4)" }}>
          Problem
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
          {cs.problem}
        </p>
      </div>
      <CaseStudyList label="Key Decisions" items={cs.decisions} />
      <div className="grid gap-7 md:grid-cols-2">
        <CaseStudyList label="Lessons Learned" items={cs.lessons} />
        <CaseStudyList label="Failure Modes" items={cs.failureModes} />
      </div>
    </div>
  )
}

function ProjectActions({
  project,
  hasArch,
  onArchitecture,
  onCaseStudy,
}: {
  project: Project
  hasArch: boolean
  onArchitecture: () => void
  onCaseStudy: () => void
}) {
  return (
    <div className="project-actions mb-8" role="group" aria-label={`${project.title} actions`}>
      <Link
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="project-action project-action-primary"
      >
        <ExternalLink aria-hidden="true" />
        <span>Live System</span>
      </Link>
      {project.repo && (
        <Link
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="project-action"
        >
          <Github aria-hidden="true" />
          <span>Source Code</span>
        </Link>
      )}
      {project.caseStudy && (
        <button type="button" className="project-action" onClick={onCaseStudy}>
          <FileText aria-hidden="true" />
          <span>Case Study</span>
        </button>
      )}
      {hasArch && (
        <button type="button" className="project-action" onClick={onArchitecture}>
          <Network aria-hidden="true" />
          <span>Architecture</span>
        </button>
      )}
    </div>
  )
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })
  const sc = statusColors[project.status as keyof typeof statusColors] ?? statusColors.shipped
  const [showNotes, setShowNotes] = useState(false)
  const archRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)
  const hasArch = project.id === "sentinelsol" || !!project.pipeline

  const goToArchitecture = () => {
    archRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }
  const openCaseStudy = () => {
    setShowNotes(true)
    window.setTimeout(() => {
      notesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 80)
  }

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

          {/* Status indicator — primary actions live in the body action bar below */}
          <span
            className="hidden sm:flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.14em] uppercase"
            style={{ color: "rgba(var(--mode-rgb), 0.4)" }}
            aria-hidden="true"
          >
            SECTOR {String(index + 1).padStart(2, "0")}
          </span>
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
          {project.publication && (
            <p className="font-mono text-xs mb-6" style={{ color: "var(--foreground-dim)" }}>
              {project.publication}
            </p>
          )}

          {/* Explicit, obvious actions — no hunting for where to click */}
          <ProjectActions
            project={project}
            hasArch={hasArch}
            onArchitecture={goToArchitecture}
            onCaseStudy={openCaseStudy}
          />

          <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--foreground-dim)" }}>
            {project.description}
          </p>

          <div ref={archRef} style={{ scrollMarginTop: "96px" }}>
            {project.id === "sentinelsol" ? (
              <>
                <SentinelOperationalAssets inView={isInView} />
                <IncidentReplay />
              </>
            ) : project.architecture ? (
              <ArchitectureReveal
                title={`${project.title} · Architecture`}
                flow="DATA FLOW"
                stages={project.architecture}
                metrics={project.metrics}
              />
            ) : null}
          </div>

          {/* Engineering notes — expandable case study */}
          {project.caseStudy && (
            <div className="mb-8" ref={notesRef} style={{ scrollMarginTop: "96px" }}>
              <button
                type="button"
                onClick={() => setShowNotes((v) => !v)}
                aria-expanded={showNotes}
                aria-controls={`notes-${project.id}`}
                className="engineering-notes-toggle"
              >
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 transition-transform"
                  style={{ transform: showNotes ? "rotate(90deg)" : "none" }}
                />
                <span>Engineering notes</span>
                <span className="en-hint">problem · decisions · lessons · failure modes</span>
              </button>
              <AnimatePresence initial={false}>
                {showNotes && (
                  <motion.div
                    id={`notes-${project.id}`}
                    key="notes"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: ease.outSoft }}
                    style={{ overflow: "hidden" }}
                  >
                    <CaseStudyBody cs={project.caseStudy} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
      <SectionSep />

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
