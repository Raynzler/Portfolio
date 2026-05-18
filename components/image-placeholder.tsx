"use client"

import { duration } from "@/lib/motion"

interface ImagePlaceholderProps {
  title: string
  description: string
  path: string
}

export function ImagePlaceholder({ title, description, path }: ImagePlaceholderProps) {
  return (
    <div
      className="relative aspect-video overflow-hidden rounded-sm"
      style={{
        background: "#0B0F14",
        border: "1px solid rgba(110, 231, 249, 0.10)",
        transition: `border-color ${duration.hover * 1000}ms ease`,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(79, 223, 255, 0.28)"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(110, 231, 249, 0.10)"
      }}
    >
      {/* Fine grid overlay — operational screenshot feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(79, 223, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79, 223, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Corner marks — TRON geometry */}
      <svg
        className="absolute top-2 left-2 pointer-events-none"
        width="12" height="12" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M1 12V1h11" stroke="rgba(79,223,255,0.30)" strokeWidth="1" />
      </svg>
      <svg
        className="absolute bottom-2 right-2 pointer-events-none"
        width="12" height="12" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M11 0v11H0" stroke="rgba(79,223,255,0.30)" strokeWidth="1" />
      </svg>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs mb-2 text-balance"
           style={{ color: "rgba(79, 223, 255, 0.7)", letterSpacing: "0.04em" }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed max-w-xs text-balance"
           style={{ color: "rgba(107, 118, 132, 0.6)" }}>
          {description}
        </p>
        <p className="font-mono text-xs mt-5"
           style={{ color: "rgba(107, 118, 132, 0.25)", fontSize: "0.6rem" }}>
          {path}
        </p>
      </div>

      {/* When you have the real image, replace the content above with:
          <Image src={path} alt={description} fill className="object-cover" />
      */}
    </div>
  )
}
