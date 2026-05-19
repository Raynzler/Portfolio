"use client"

import { useEffect } from "react"

const DEFAULT_ICON = "/favicon.svg"
const CLU_ICON = "/favicon-clu.svg"

function ensureIconLink() {
  let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-dynamic-favicon]')
  if (!icon) {
    icon = document.createElement("link")
    icon.rel = "icon"
    icon.type = "image/svg+xml"
    icon.dataset.dynamicFavicon = "true"
    document.head.appendChild(icon)
  }
  return icon
}

export function DynamicFavicon() {
  useEffect(() => {
    const root = document.documentElement
    const icon = ensureIconLink()

    const sync = () => {
      const isClu = root.classList.contains("clu-active") || root.classList.contains("clu-forced")
      icon.href = isClu ? CLU_ICON : DEFAULT_ICON
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return null
}
