"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { duration, ease } from "@/lib/motion"

const NAV_LINKS = [
  { id: "projects",   label: "projects",   subsystem: "OBSERVE" },
  { id: "experience", label: "experience", subsystem: "TRACE"   },
  { id: "contact",    label: "contact",    subsystem: "RELAY"   },
]

/**
 * Scroll spy strategy:
 * IntersectionObserver with rootMargin that creates a narrow "active band"
 * in the upper-middle of the viewport (-20% top, -60% bottom).
 * The section whose top edge enters this band first wins.
 * A ref-map tracks the latest ratio so we always resolve to exactly one winner.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("")
  const ratioMap = useRef<Record<string, number>>({})

  useEffect(() => {
    const pick = () => {
      // Priority: whichever section has the highest intersection ratio
      // within the band. Ties broken by DOM order (first wins = topmost).
      let best = ""
      let bestRatio = 0
      for (const id of ids) {
        const r = ratioMap.current[id] ?? 0
        if (r > bestRatio) { bestRatio = r; best = id }
      }
      setActive(best)
    }

    // rootMargin: -15% from top (clears the 80px header with margin),
    // -55% from bottom — creates a ~30% tall active band in upper viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioMap.current[entry.target.id] = entry.intersectionRatio
        }
        pick()
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    )

    const els: Element[] = []
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) { observer.observe(el); els.push(el) }
    }

    return () => { for (const el of els) observer.unobserve(el) }
  }, [ids])

  return active
}

export function Header() {
  const [scrolled,   setScrolled]   = useState(false)
  const [diagnostic, setDiagnostic] = useState(false)
  const active = useActiveSection(NAV_LINKS.map(n => n.id))

  // Refs for measuring nav item positions (cyan trace movement)
  const itemRefs  = useRef<Record<string, HTMLAnchorElement | null>>({})
  const navRef    = useRef<HTMLUListElement>(null)
  const [traceStyle, setTraceStyle] = useState<{ left: number; width: number } | null>(null)

  // Recalculate trace position whenever active changes
  useEffect(() => {
    const activeEl = itemRefs.current[active]
    const navEl    = navRef.current
    if (!activeEl || !navEl) { setTraceStyle(null); return }

    const navRect  = navEl.getBoundingClientRect()
    const itemRect = activeEl.getBoundingClientRect()
    setTraceStyle({
      left:  itemRect.left - navRect.left,
      width: itemRect.width,
    })
  }, [active])

  // Scroll tracking — only boolean, no section logic here
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Diagnostic mode — double-D within 400ms
  useEffect(() => {
    let lastD = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "d") return
      const now = Date.now()
      if (now - lastD < 400) {
        setDiagnostic(prev => {
          const next = !prev
          document.documentElement.classList.toggle("diagnostic-active", next)
          return next
        })
      }
      lastD = now
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      animate={{
        backgroundColor: scrolled ? "rgba(5,7,10,0.92)" : "rgba(5,7,10,0)",
      }}
      transition={{ duration: duration.hover, ease: ease.inOut }}
      style={{
        backdropFilter:  scrolled ? "blur(14px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
        borderBottom: scrolled
          ? "1px solid rgba(79, 223, 255, 0.09)"
          : "1px solid transparent",
        transition: `border-color ${duration.hover}s ease, backdrop-filter ${duration.hover}s ease`,
      }}
    >
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Home">
          <span
            className="subsystem-label transition-opacity"
            style={{
              opacity: 0.38,
              transitionDuration: `${duration.hover}s`,
            }}
          >
            GRID
          </span>
          <span
            className="font-mono text-sm transition-colors"
            style={{
              color: "rgba(170, 182, 195, 0.65)",
              transitionDuration: `${duration.hover}s`,
            }}
          >
            hs.
          </span>
        </Link>

        {/* Nav links */}
        <ul
          ref={navRef}
          className="relative flex items-center gap-8"
          role="list"
        >
          {/* Shared sliding cyan trace — moves between active items */}
          <AnimatePresence>
            {traceStyle && (
              <motion.span
                key="nav-trace"
                className="absolute pointer-events-none"
                style={{
                  bottom: "-6px",
                  height: "1px",
                  background: "linear-gradient(to right, transparent, #4FDFFF, transparent)",
                  boxShadow: "0 0 6px rgba(79, 223, 255, 0.55)",
                }}
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{
                  left:    traceStyle.left,
                  width:   traceStyle.width,
                  opacity: 1,
                  scaleX:  1,
                }}
                exit={{ opacity: 0, scaleX: 0.4 }}
                transition={{
                  left:    { duration: duration.panel, ease: ease.sharp },
                  width:   { duration: duration.panel, ease: ease.sharp },
                  opacity: { duration: duration.micro },
                  scaleX:  { duration: duration.micro },
                }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {NAV_LINKS.map(({ id, label, subsystem }) => {
            const isActive = active === id
            return (
              <li key={id}>
                <Link
                  href={`#${id}`}
                  ref={el => { itemRefs.current[id] = el }}
                  className="relative flex flex-col items-center gap-0.5"
                  style={{ textDecoration: "none" }}
                  aria-current={isActive ? "location" : undefined}
                >
                  {/* Subsystem micro-label */}
                  <motion.span
                    className="subsystem-label"
                    animate={{ opacity: isActive ? 0.55 : 0 }}
                    transition={{ duration: duration.hover, ease: ease.out }}
                    aria-hidden="true"
                  >
                    {subsystem}
                  </motion.span>

                  {/* Nav label */}
                  <motion.span
                    className="font-mono text-sm"
                    animate={{
                      color: isActive ? "#4FDFFF" : "rgba(107, 118, 132, 1)",
                    }}
                    transition={{ duration: duration.hover, ease: ease.out }}
                  >
                    {label}
                  </motion.span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Diagnostic indicator */}
        <AnimatePresence>
          {diagnostic && (
            <motion.span
              className="subsystem-label"
              style={{ color: "#4FDFFF", opacity: 0.8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.micro }}
            >
              DIAG
            </motion.span>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
