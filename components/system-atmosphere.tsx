"use client"

import { useEffect, useState } from "react"
import { Z_INDEX } from "@/lib/constants"

const COMMANDS: Record<string, string> = {
  whoami: "hamza / infrastructure operator",
  flynn: "FLYNN / user signal acknowledged",
  clu: "CLU / control plane standing by",
  encom: "ENCOM / archived network trace",
  grid: "THE GRID / distant traffic online",
  endofline: "END OF LINE / program terminated",
  disc: "IDENTITY DISC / data secured",
  tron: "TRON / he fights for the users",
  portal: "I/O TOWER / connection open",
}

export function SystemAtmosphere() {
  const [egg, setEgg] = useState<string | null>(null)

  useEffect(() => {
    const root = document.documentElement
    let forcedClu = false
    let diagnostic = false
    let lastC = 0
    let buffer = ""

    const experience = document.getElementById("experience")
    const observer = experience
      ? new IntersectionObserver(
          ([entry]) => {
            const intensity = forcedClu ? 1 : Math.min(1, Math.max(0, entry.intersectionRatio * 1.35))
            root.style.setProperty("--clu-intensity", intensity.toFixed(2))
            root.classList.toggle("clu-active", (entry.isIntersecting || intensity > 0.18) && !forcedClu)
          },
          {
            rootMargin: "-22% 0px -34% 0px",
            threshold: [0, 0.08, 0.16, 0.28, 0.42, 0.58, 0.74, 0.9, 1],
          }
        )
      : null

    if (experience && observer) observer.observe(experience)

    const showEgg = (value: string) => {
      setEgg(value)
      window.setTimeout(() => setEgg(null), 1800)
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey) return

      // Ctrl+Shift+D: diagnostic mode toggle
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault()
        diagnostic = !diagnostic
        root.classList.toggle("diagnostic-active", diagnostic)
        showEgg(diagnostic ? "DIAGNOSTIC MODE / subsystems visible" : "DIAGNOSTIC MODE / disengaged")
        return
      }

      if (event.ctrlKey) return
      const key = event.key.toLowerCase()

      // Double-tap C: CLU/Flynn toggle
      if (key === "c") {
        const now = Date.now()
        if (now - lastC < 420) {
          forcedClu = !forcedClu
          root.classList.toggle("clu-forced", forcedClu)
          root.classList.toggle("clu-active", forcedClu)
          root.style.setProperty("--clu-intensity", forcedClu ? "1" : "0")
          showEgg(forcedClu ? "CLU MODE / manual override" : "FLYNN MODE / restored")
        }
        lastC = now
      }

      if (/^[a-z0-9]$/.test(key)) {
        buffer = (buffer + key).slice(-12)
        for (const [command, response] of Object.entries(COMMANDS)) {
          if (buffer.endsWith(command)) showEgg(response)
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => {
      observer?.disconnect()
      window.removeEventListener("keydown", onKey)
      root.style.removeProperty("--clu-intensity")
      root.classList.remove("clu-active", "clu-forced", "diagnostic-active")
    }
  }, [])

  return (
    <>
      <div className="system-atmosphere" aria-hidden="true">
        <div className="grid-field" />
        <div className="grid-horizon">
          <div className="grid-horizon-plane" />
        </div>
        <div className="traffic-layer traffic-layer-a" />
        <div className="traffic-layer traffic-layer-b" />
        <div className="traffic-layer traffic-layer-c" />
        <div className="trace-highway trace-highway-a" />
        <div className="trace-highway trace-highway-b" />
        <div className="ambient-reflection" />
        <div className="scanline-texture" />
      </div>

      {egg && (
        <div className="diagnostic-overlay" role="status" aria-live="polite" style={{ zIndex: Z_INDEX.diagnostic }}>
          <span>{egg}</span>
        </div>
      )}
    </>
  )
}
