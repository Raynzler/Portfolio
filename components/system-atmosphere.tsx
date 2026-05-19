"use client"

import { useEffect, useState } from "react"

export function SystemAtmosphere() {
  const [egg, setEgg] = useState<string | null>(null)

  useEffect(() => {
    const root = document.documentElement
    let forcedClu = false
    let lastC = 0
    let buffer = ""

    const experience = document.getElementById("experience")
    const observer = experience
      ? new IntersectionObserver(
          ([entry]) => {
            root.classList.toggle("clu-active", entry.isIntersecting && !forcedClu)
          },
          {
            rootMargin: "-32% 0px -45% 0px",
            threshold: [0, 0.2, 0.45, 0.7, 1],
          }
        )
      : null

    if (experience && observer) observer.observe(experience)

    const showEgg = (value: string) => {
      setEgg(value)
      window.setTimeout(() => setEgg(null), 1800)
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const key = event.key.toLowerCase()

      if (key === "c") {
        const now = Date.now()
        if (now - lastC < 420) {
          forcedClu = !forcedClu
          root.classList.toggle("clu-forced", forcedClu)
          root.classList.toggle("clu-active", forcedClu)
          showEgg(forcedClu ? "CLU MODE / manual override" : "FLYNN MODE / restored")
        }
        lastC = now
      }

      if (/^[a-z0-9]$/.test(key)) {
        buffer = (buffer + key).slice(-12)
        const commands: Record<string, string> = {
          whoami: "hamza / infrastructure operator",
          flynn: "FLYNN / user signal acknowledged",
          clu: "CLU / control plane standing by",
          encom: "ENCOM / archived network trace",
          grid: "THE GRID / distant traffic online",
        }
        for (const [command, response] of Object.entries(commands)) {
          if (buffer.endsWith(command)) showEgg(response)
        }
      }
    }

    window.addEventListener("keydown", onKey)
    return () => {
      observer?.disconnect()
      window.removeEventListener("keydown", onKey)
      root.classList.remove("clu-active", "clu-forced")
    }
  }, [])

  return (
    <>
      <div className="system-atmosphere" aria-hidden="true">
        <div className="grid-field" />
        <div className="traffic-layer traffic-layer-a" />
        <div className="traffic-layer traffic-layer-b" />
        <div className="trace-highway trace-highway-a" />
        <div className="trace-highway trace-highway-b" />
        <div className="scanline-texture" />
      </div>

      {egg && (
        <div className="diagnostic-overlay" role="status" aria-live="polite">
          <span>{egg}</span>
        </div>
      )}
    </>
  )
}
