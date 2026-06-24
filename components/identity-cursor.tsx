"use client"

import { useEffect, useRef } from "react"

/**
 * Identity Disc cursor — a thin reactive ring that reads as an ENCOM OS pointer,
 * not a portfolio gimmick. Desktop + fine-pointer only; disabled under
 * prefers-reduced-motion (native cursor stays). The native cursor is only hidden
 * once the custom cursor is live AND positioned (on the first pointer move), so a
 * failed init can never leave the user with no cursor.
 *
 * Performance: position is a direct translate3d write on pointermove (no React
 * state, no rAF, composited). Hover state changes the DOM only on element
 * boundary crossings (pointerover), never per frame. CLU integration is free —
 * the ring is painted with rgb(var(--mode-rgb)), which CLU mode already swaps.
 */
export function IdentityCursor() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!finePointer || reduceMotion) return // desktop + motion only; native cursor untouched

    const wrap = wrapRef.current
    const label = labelRef.current
    if (!wrap || !label) return

    const root = document.documentElement
    let initialized = false
    let lastState = ""
    let lastLabel = ""

    // Self-contained label inference — reads the DOM, never modifies other
    // components. Keeps to the small, meaningful destination set.
    const resolve = (target: EventTarget | null) => {
      const node = target instanceof Element ? target : null
      const a = node?.closest("a, button") as HTMLElement | null
      if (!a) return { state: "default", text: "" }
      const href = (a.getAttribute("href") || "").toLowerCase()
      if (href.endsWith(".pdf")) return { state: "action", text: "CV" }
      if (a.closest(".contact-link") || href.startsWith("mailto:")) return { state: "action", text: "CONTACT" }
      if (href.includes("github.com")) return { state: "action", text: "CODE" }
      const pa = a.closest(".project-action")
      if (pa) {
        const t = (pa.textContent || "").toLowerCase()
        if (t.includes("live")) return { state: "action", text: "LIVE" }
        if (t.includes("source") || t.includes("code")) return { state: "action", text: "CODE" }
        return { state: "link", text: "" }
      }
      if (href.startsWith("http")) return { state: "action", text: "OPEN" }
      return { state: "link", text: "" }
    }

    const onMove = (e: PointerEvent) => {
      wrap.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      if (!initialized) {
        wrap.style.opacity = "1"
        root.classList.add("identity-cursor-on") // hide native only now: cursor is live + placed
        initialized = true
      }
    }
    const onOver = (e: PointerEvent) => {
      const { state, text } = resolve(e.target)
      if (state !== lastState) {
        wrap.dataset.state = state
        lastState = state
      }
      if (text !== lastLabel) {
        label.textContent = text
        lastLabel = text
      }
    }
    const onDown = () => { wrap.dataset.press = "1" }
    const onUp = () => { delete wrap.dataset.press }
    const onWindowLeave = () => { wrap.style.opacity = "0"; initialized = false }

    try {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.addEventListener("pointerover", onOver, { passive: true })
      window.addEventListener("pointerdown", onDown, { passive: true })
      window.addEventListener("pointerup", onUp, { passive: true })
      root.addEventListener("mouseleave", onWindowLeave)
    } catch {
      root.classList.remove("identity-cursor-on")
      return
    }

    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerover", onOver)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      root.removeEventListener("mouseleave", onWindowLeave)
      root.classList.remove("identity-cursor-on")
    }
  }, [])

  return (
    <div ref={wrapRef} className="identity-cursor" aria-hidden="true">
      <span className="identity-cursor-ring" />
      <span ref={labelRef} className="identity-cursor-label" />
    </div>
  )
}
