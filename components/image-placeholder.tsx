"use client"

interface ImagePlaceholderProps {
  title: string
  description: string
  path: string
}

export function ImagePlaceholder({ title, description, path }: ImagePlaceholderProps) {
  return (
    <div
      className="tron-panel relative aspect-video overflow-hidden rounded-sm"
      style={{ background: "var(--bg-panel)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `
            linear-gradient(rgba(var(--mode-rgb), 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--mode-rgb), 1) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />

      <svg
        className="absolute top-2 left-2 pointer-events-none"
        width="12" height="12" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M1 12V1h11" stroke="rgba(var(--mode-rgb),0.30)" strokeWidth="1" />
      </svg>
      <svg
        className="absolute bottom-2 right-2 pointer-events-none"
        width="12" height="12" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M11 0v11H0" stroke="rgba(var(--mode-rgb),0.30)" strokeWidth="1" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs mb-2 text-balance"
           style={{ color: "rgba(var(--mode-rgb), 0.7)", letterSpacing: "0.04em" }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed max-w-xs text-balance"
           style={{ color: "var(--foreground-dim)" }}>
          {description}
        </p>
        <p className="font-mono mt-5"
           style={{ color: "var(--foreground-dim)", fontSize: "0.6rem", opacity: 0.4 }}>
          {path}
        </p>
      </div>
    </div>
  )
}
