"use client"

import { ImagePlaceholder } from "./image-placeholder"
import { ExternalLink, Trophy } from "lucide-react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { fadeUp, staggerContainer, staggerItem, duration } from "@/lib/motion"

const projects = [
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
    images: {
      dashboard: {
        title: "ADD IMAGE: Prometheus Dashboard",
        description:
          "Screenshot of Prometheus/Grafana showing ShredStream latency, Vote Credit velocity, Z-Score anomaly detection",
        path: "/images/sentinelsol-dashboard.png",
      },
      architecture: {
        title: "ADD IMAGE: System Architecture",
        description:
          "Architecture diagram: Go daemon → Prometheus → Alertmanager → Telegram pipeline",
        path: "/images/sentinelsol-architecture.png",
      },
    },
  },
  {
    id: "autosre",
    subsystem: "NODE",
    title: "AutoSRE",
    status: "active",
    url: "https://auto-sre.vercel.app",
    tagline: "Self-healing SRE platform with automated recovery.",
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
    images: {
      architecture: {
        title: "ADD IMAGE: Docker Compose Architecture",
        description:
          "Service mesh diagram — Prometheus exporters and recovery automation flow",
        path: "/images/autosre-architecture.png",
      },
      metrics: {
        title: "ADD IMAGE: RED Metrics Dashboard",
        description:
          "Rate, Errors, Duration — p95 latency tracking live",
        path: "/images/autosre-metrics.png",
      },
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
    publication: "IEEE ICSPCRE 2024, Paper ID 652",
    award: null,
    tradeoffs: [
      "Region × season model partitioning over single global model for interpretability",
      "14-step input window balances temporal context vs. computational cost",
      "Optuna TPE over grid search for efficient hyperparameter exploration",
    ],
    images: {
      map: {
        title: "ADD IMAGE: D3.js Geospatial Map",
        description:
          "React + D3.js temperature forecast heatmap across Indian regions",
        path: "/images/gridcast-map.png",
      },
      model: {
        title: "ADD IMAGE: Model Architecture",
        description:
          "LSTM architecture, region partitioning, inference pipeline",
        path: "/images/gridcast-model.png",
      },
    },
  },
]

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  live:    { bg: "rgba(79, 223, 255, 0.08)",  text: "#4FDFFF", dot: "#4FDFFF"  },
  active:  { bg: "rgba(79, 223, 255, 0.05)",  text: "#6EE7F9", dot: "#6EE7F9"  },
  shipped: { bg: "rgba(107, 118, 132, 0.12)", text: "#AAB6C3", dot: "#6B7684"  },
}

function ProjectPanel({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })
  const sc = statusColors[project.status] ?? statusColors.shipped

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
        className="tron-panel rounded-sm overflow-hidden"
        style={{ padding: "0" }}
      >
        {/* Panel top bar */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{ borderColor: "rgba(110, 231, 249, 0.08)" }}
        >
          <div className="flex items-center gap-4">
            <span className="subsystem-label" style={{ color: "rgba(79, 223, 255, 0.4)" }}>
              {project.subsystem}
            </span>
            <span
              className="w-px h-3 block"
              style={{ background: "rgba(79, 223, 255, 0.15)" }}
            />
            <h3 className="text-sm font-medium tracking-wide" style={{ color: "#E6F1FF" }}>
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
            className="flex items-center gap-1.5 font-mono text-xs group/link"
            style={{ color: "rgba(107, 118, 132, 0.8)", transition: `color ${duration.hover * 1000}ms ease` }}
            onMouseEnter={e => (e.currentTarget.style.color = "#4FDFFF")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(107, 118, 132, 0.8)")}
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
          <p className="text-sm mb-4 font-light" style={{ color: "#AAB6C3" }}>
            {project.tagline}
          </p>

          {/* Award */}
          {project.award && (
            <div
              className="flex items-start gap-3 p-4 rounded-sm mb-6"
              style={{
                background: "rgba(79, 223, 255, 0.04)",
                border: "1px solid rgba(79, 223, 255, 0.12)",
              }}
            >
              <Trophy className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#4FDFFF" }} />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(230, 241, 255, 0.75)" }}>
                {project.award}
              </p>
            </div>
          )}

          {/* Publication */}
          {"publication" in project && project.publication && (
            <p className="font-mono text-xs mb-6" style={{ color: "rgba(107, 118, 132, 0.7)" }}>
              {project.publication}
            </p>
          )}

          {/* Description */}
          <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(107, 118, 132, 1)" }}>
            {project.description}
          </p>

          {/* Image placeholders */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {Object.values(project.images).map((image, idx) => (
              <ImagePlaceholder
                key={idx}
                title={image.title}
                description={image.description}
                path={image.path}
              />
            ))}
          </div>

          {/* Tradeoffs */}
          <div className="mb-8">
            <p className="subsystem-label mb-4" style={{ color: "rgba(79, 223, 255, 0.35)" }}>
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
                    color: "rgba(170, 182, 195, 0.7)",
                    borderLeft: "1px solid rgba(79, 223, 255, 0.14)",
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
                className="font-mono text-xs px-2 py-0.5 rounded-sm"
                style={{
                  background: "rgba(27, 36, 48, 1)",
                  color: "rgba(170, 182, 195, 0.7)",
                  border: "1px solid rgba(110, 231, 249, 0.08)",
                  transition: `border-color ${duration.micro * 1000}ms ease, color ${duration.micro * 1000}ms ease`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(79, 223, 255, 0.28)"
                  ;(e.currentTarget as HTMLElement).style.color = "#AAB6C3"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(110, 231, 249, 0.08)"
                  ;(e.currentTarget as HTMLElement).style.color = "rgba(170, 182, 195, 0.7)"
                }}
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
            <span className="subsystem-label" style={{ color: "rgba(79, 223, 255, 0.45)" }}>
              OBSERVE
            </span>
            <span
              className="h-px flex-1"
              style={{
                background: "linear-gradient(to right, rgba(79, 223, 255, 0.15), transparent)",
                maxWidth: "200px",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "rgba(107, 118, 132, 0.5)" }}>
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
