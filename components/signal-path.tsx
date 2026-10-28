"use client"

import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "@/lib/grid-runtime"

/**
 * Signal path — one lightcycle route that carries a reader through the
 * evidence. It leaves the hero's SIGNAL line, runs down the left margin, plugs
 * into each project panel and into the architecture / incident diagrams (whose
 * rails then fill with their own scrub), runs ember through EXPERIENCE (the CLU
 * stretch), lands on the CV download, and closes at CONTACT.
 *
 * The head rides the line where useScrollScrub starts its rails (82% down the
 * viewport), so a diagram begins filling as the route reaches it. At every
 * section boundary the head's glyph re-folds: four brackets unlock, turn 45°
 * and lock again, a small mechanical beat that marks the chapter change.
 *
 * Geometry is measured from layout (offsets, so in-flight entrance transforms
 * don't skew it) on mount and whenever the page reflows; the scroll handler
 * only reads scrollY and writes transforms, CSS variables and attributes. No
 * React state, nothing pinned, scroll is never intercepted. Decorative
 * (aria-hidden); with reduced motion the route is drawn in full and holds still.
 */

const HEAD_LINE = 0.82 // fraction of the viewport; matches useScrollScrub's `enter`
const CHAPTERS = ["home", "projects", "experience", "stack", "cv", "contact"] as const
const SPREAD: Record<string, string> = { tl: "-2px -2px", tr: "2px -2px", br: "2px 2px", bl: "-2px 2px" }

type Chapter = (typeof CHAPTERS)[number]

interface Port {
  el: HTMLElement
  node: HTMLElement
  find: () => { y: number; toX: number } | null
  y: number
  lit: boolean
}

interface Segment {
  el: HTMLElement
  chapter: Chapter
  top: number
  bottom: number
  p: number
}

// Layout position in document coordinates. Offsets ignore transforms, so a
// panel mid-way through its fade-up still measures where it will settle.
function layoutBox(el: HTMLElement) {
  let x = 0
  let y = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft
    y += n.offsetTop
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

function part(parent: HTMLElement, className: string, attrs: Record<string, string> = {}) {
  const el = document.createElement("span")
  el.className = className
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value)
  parent.appendChild(el)
  return el
}

export function SignalPath() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const dot = document.querySelector<HTMLElement>("#home .signal-dot")
    const end = document.querySelector<HTMLElement>("#contact .subsystem-label")
    const firstPanel = document.querySelector<HTMLElement>("#projects .project-module")
    if (!root || !dot || !end || !firstPanel) return
    const reduced = prefersReducedMotion()

    // ── Scaffolding: track, one segment per chapter, ports, head ──────────────
    root.replaceChildren()
    const track = part(root, "route-track")
    const segments: Segment[] = CHAPTERS.map((chapter) => {
      const el = part(root, "route-seg", { "data-chapter": chapter })
      part(el, "route-seg-fill")
      return { el, chapter, top: 0, bottom: 0, p: -1 }
    })

    const ports: Port[] = []
    const addPort = (kind: string, find: Port["find"]) => {
      const el = part(root, "route-port", { "data-kind": kind })
      const node = part(root, "route-node", { "data-kind": kind })
      ports.push({ el, node, find, y: 0, lit: false })
    }
    // Leaves the availability line, stopping short of the dot.
    addPort("origin", () => {
      const b = layoutBox(dot)
      return { y: b.y + b.h / 2, toX: b.x - 6 }
    })
    // Each project: into the panel's top edge, where its power-on trace runs,
    // then into each diagram box at the height its rail starts.
    for (const panel of document.querySelectorAll<HTMLElement>("#projects .project-module")) {
      addPort("panel", () => {
        const b = layoutBox(panel)
        return { y: b.y + 0.5, toX: b.x }
      })
      for (const rail of panel.querySelectorAll<HTMLElement>(".incident-rail-base, .arch-rail-base")) {
        const visual = rail.closest<HTMLElement>(".sentinel-visual")
        if (!visual) continue
        addPort("diagram", () => ({ y: layoutBox(rail).y, toX: layoutBox(visual).x }))
      }
    }
    // The CV: the route delivers to the download in the dossier panel.
    const download = document.querySelector<HTMLElement>("#cv a[download]")
    const dossier = download?.closest<HTMLElement>(".cv-dossier")
    if (download && dossier) {
      addPort("cv", () => {
        const b = layoutBox(download)
        return { y: b.y + b.h / 2, toX: layoutBox(dossier).x }
      })
    }
    // End of line: points at CONTACT's label and stops.
    addPort("end", () => {
      const b = layoutBox(end)
      return { y: b.y + b.h / 2, toX: b.x - 10 }
    })

    const head = part(root, "route-head")
    const glyph = part(head, "route-glyph")
    const brackets = ["tl", "tr", "br", "bl"].map((corner) => part(glyph, "", { "data-c": corner }))

    // ── Geometry ──────────────────────────────────────────────────────────────
    let originY = 0
    let endY = 0
    const measure = () => {
      const contentLeft = layoutBox(firstPanel).x
      const routeX = Math.max(10, Math.round(contentLeft - 44))
      head.dataset.size = contentLeft < 80 ? "small" : "regular"

      for (const port of ports) {
        const at = port.find()
        if (!at) continue
        port.y = at.y
        port.el.style.cssText = `left:${routeX}px;top:${at.y}px;width:${Math.max(0, at.toX - routeX)}px`
        port.node.style.cssText = `left:${routeX}px;top:${at.y}px`
      }
      originY = ports[0].y
      endY = ports[ports.length - 1].y

      const tops = CHAPTERS.map((id, i) =>
        i === 0 ? originY : Math.min(endY, Math.max(originY, layoutBox(document.getElementById(id) ?? end).y))
      )
      segments.forEach((s, i) => {
        s.top = tops[i]
        s.bottom = i + 1 < tops.length ? tops[i + 1] : endY
        s.p = -1
        s.el.style.cssText = `left:${routeX}px;top:${s.top}px;height:${Math.max(0, s.bottom - s.top)}px`
      })
      // Ports take the colour of the stretch they sit on (ember through EXPERIENCE).
      for (const port of ports) {
        const seg = segments.findLast((s) => s.top <= port.y) ?? segments[0]
        port.el.dataset.chapter = seg.chapter
        port.node.dataset.chapter = seg.chapter
      }
      track.style.cssText = `left:${routeX}px;top:${originY}px;height:${endY - originY}px`
      head.style.left = `${routeX}px`
    }

    // ── Chapter re-fold: unlock, turn 45°, lock ──────────────────────────────
    let angle = 0
    let chapter: Chapter | null = null
    const refold = (direction: number) => {
      const from = angle
      angle += 45 * direction
      glyph.style.transform = `rotate(${angle}deg)`
      if (reduced || document.hidden) return
      const timing = { duration: 720 }
      glyph.getAnimations().forEach((a) => a.cancel())
      glyph.animate(
        [
          { transform: `rotate(${from}deg)` },
          { transform: `rotate(${from}deg)`, offset: 0.26, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
          { transform: `rotate(${angle}deg)`, offset: 0.7 },
          { transform: `rotate(${angle}deg)` },
        ],
        timing
      )
      for (const b of brackets) {
        const out = SPREAD[b.dataset.c ?? "tl"]
        b.getAnimations().forEach((a) => a.cancel())
        b.animate(
          [
            { translate: "0 0", easing: "cubic-bezier(0.3, 0, 0.2, 1)" },
            { translate: out, offset: 0.26 },
            { translate: out, offset: 0.7, easing: "cubic-bezier(0.5, 0, 0.2, 1.5)" },
            { translate: "0 0" },
          ],
          timing
        )
      }
    }

    // ── Per frame (scroll only) ───────────────────────────────────────────────
    let frame = 0
    const update = () => {
      frame = 0
      const headY = reduced
        ? endY
        : Math.min(endY, Math.max(originY, window.scrollY + window.innerHeight * HEAD_LINE))
      head.style.transform = `translate3d(0, ${headY}px, 0)`

      for (const s of segments) {
        const span = s.bottom - s.top
        const p = span > 0 ? Math.min(1, Math.max(0, (headY - s.top) / span)) : headY >= s.top ? 1 : 0
        const q = Math.round(p * 1000) / 1000
        if (q !== s.p) {
          s.p = q
          s.el.style.setProperty("--route-p", String(q))
        }
      }
      for (const port of ports) {
        const lit = headY >= port.y - 0.5
        if (lit === port.lit) continue
        port.lit = lit
        port.el.toggleAttribute("data-lit", lit)
        port.node.toggleAttribute("data-lit", lit)
      }

      const next = (segments.findLast((s) => s.top <= headY) ?? segments[0]).chapter
      if (next !== chapter) {
        const direction = chapter === null ? 0 : Math.sign(CHAPTERS.indexOf(next) - CHAPTERS.indexOf(chapter))
        chapter = next
        head.dataset.chapter = next
        if (direction) refold(direction)
      }
      head.toggleAttribute("data-docked", headY >= endY - 0.5)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    let measureFrame = 0
    const remeasure = () => {
      if (measureFrame) return
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0
        measure()
        update()
      })
    }

    measure()
    update()
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(remeasure) : null
    observer?.observe(document.body)
    window.addEventListener("resize", remeasure)
    void document.fonts?.ready.then(remeasure)
    if (!reduced) window.addEventListener("scroll", schedule, { passive: true })

    return () => {
      observer?.disconnect()
      window.removeEventListener("resize", remeasure)
      window.removeEventListener("scroll", schedule)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(measureFrame)
      root.replaceChildren()
    }
  }, [])

  return <div ref={rootRef} className="signal-path" aria-hidden="true" />
}
