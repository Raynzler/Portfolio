"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { duration, ease } from "@/lib/motion"
import { SCROLL, Z_INDEX } from "@/lib/constants"

const NAV_LINKS = [
  { id: "home", label: "HOME" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "stack", label: "STACK" },
  { id: "cv", label: "CV" },
  { id: "contact", label: "CONTACT" },
] as const

const NAV_IDS = NAV_LINKS.map((link) => link.id)

function useScrollState(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0] ?? "")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setScrolled(window.scrollY > 18)

      const activationLine = window.scrollY + window.innerHeight * SCROLL.activationFraction
      let current = ids[0] ?? ""

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= activationLine) current = id
      }

      const bottomReached =
        Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2
      setActive(bottomReached ? ids[ids.length - 1] ?? current : current)
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [ids])

  return { active, scrolled }
}

export function Header() {
  const { active, scrolled } = useScrollState(NAV_IDS)

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const navRef = useRef<HTMLUListElement>(null)
  const [traceStyle, setTraceStyle] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const updateTrace = () => {
      const activeEl = itemRefs.current[active]
      const navEl = navRef.current
      if (!activeEl || !navEl) {
        setTraceStyle(null)
        return
      }

      const navRect = navEl.getBoundingClientRect()
      const itemRect = activeEl.getBoundingClientRect()
      setTraceStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
      })
    }

    updateTrace()
    window.addEventListener("resize", updateTrace)
    return () => window.removeEventListener("resize", updateTrace)
  }, [active])

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    event.preventDefault()
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL.headerOffset
    window.history.pushState(null, "", `#${id}`)
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <motion.header
      className="fixed left-0 right-0 top-0"
      animate={{
        backgroundColor: scrolled ? "rgba(5,7,10,0.90)" : "rgba(5,7,10,0)",
      }}
      transition={{ duration: duration.hover, ease: ease.inOut }}
      style={{
        zIndex: Z_INDEX.header,
        backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        borderBottom: scrolled
          ? "1px solid rgba(var(--mode-rgb), 0.10)"
          : "1px solid transparent",
        transition: `border-color ${duration.hover}s ease, backdrop-filter ${duration.hover}s ease`,
      }}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-center px-3 py-4 sm:px-6">
        <ul
          ref={navRef}
          className="relative flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-center sm:gap-7"
          role="list"
          aria-label="Primary"
        >
          <AnimatePresence>
            {traceStyle && (
              <motion.span
                key="nav-trace"
                className="absolute pointer-events-none"
                style={{
                  bottom: "-7px",
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgb(var(--mode-rgb)), transparent)",
                  boxShadow: "0 0 7px rgba(var(--mode-rgb), 0.55)",
                }}
                initial={{ opacity: 0, scaleX: 0.45 }}
                animate={{
                  left: traceStyle.left,
                  width: traceStyle.width,
                  opacity: 1,
                  scaleX: 1,
                }}
                exit={{ opacity: 0, scaleX: 0.45 }}
                transition={{
                  left: { duration: duration.trace, ease: ease.sharp },
                  width: { duration: duration.trace, ease: ease.sharp },
                  opacity: { duration: duration.micro },
                  scaleX: { duration: duration.micro },
                }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {NAV_LINKS.map(({ id, label }) => {
            const isActive = active === id
            return (
              <li key={id}>
                <Link
                  href={`#${id}`}
                  ref={(el) => {
                    itemRefs.current[id] = el
                  }}
                  className="nav-link relative block px-0.5 py-1 font-mono text-[0.62rem] tracking-[0.04em] sm:px-1 sm:text-xs sm:tracking-[0.16em]"
                  aria-current={isActive ? "location" : undefined}
                  data-active={isActive}
                  onClick={(event) => scrollToSection(event, id)}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </motion.header>
  )
}
