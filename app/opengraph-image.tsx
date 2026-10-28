import { ImageResponse } from "next/og"

// Link preview for LinkedIn, Slack, email and X: the Grid floor with the
// hero's own name and headline, nothing else. Rendered once at build time.
export const alt = "Hamza Shaikh, site reliability and infrastructure engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const NAME = "Hamza Shaikh"
const HEADLINE = "Site reliability and infrastructure engineer."
const CYAN = "79, 223, 255"
const EMBER = "255, 138, 61"

// Subset a Google font to just the glyphs in `text`. Fails soft: an offline
// build renders the preview in the default font instead of not at all.
async function googleFont(family: string, weight: number, text: string) {
  try {
    const query = `family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text()
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    return url ? await (await fetch(url)).arrayBuffer() : null
  } catch {
    return null
  }
}

// The perspective floor as an SVG (the live floor is CSS 3D, which the image
// renderer cannot do). Lines converge on a vanishing point above the horizon;
// cross-lines bunch up with distance (y = 300 / depth).
function floorSvg() {
  const lines: string[] = []
  for (let k = -14; k <= 14; k++) {
    const bottom = 600 + k * 130
    const horizon = 600 + (bottom - 600) * (40 / 300)
    const mid = 600 + (bottom - 600) * (120 / 300)
    lines.push(`<line x1="${horizon}" y1="40" x2="${mid}" y2="120" stroke="rgb(${CYAN})" stroke-opacity="0.07"/>`)
    lines.push(`<line x1="${mid}" y1="120" x2="${bottom}" y2="300" stroke="rgb(${CYAN})" stroke-opacity="0.18"/>`)
  }
  for (const depth of [1.25, 1.6, 2, 2.6, 3.4, 4.5, 6]) {
    const y = 300 / depth
    const opacity = (0.04 + 0.26 * (y / 300)).toFixed(3)
    lines.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="rgb(${CYAN})" stroke-opacity="${opacity}"/>`)
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">${lines.join("")}</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}

// A lightcycle: brightest at the head, fading along its wake.
function Trail({
  top,
  left,
  width,
  rgb,
  alpha,
  reverse = false,
}: {
  top: number
  left: number
  width: number
  rgb: string
  alpha: number
  reverse?: boolean
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width,
        height: 2,
        display: "flex",
        backgroundImage: `linear-gradient(${reverse ? "to left" : "to right"}, rgba(${rgb}, 0), rgba(${rgb}, ${alpha}))`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -1,
          [reverse ? "left" : "right"]: -2,
          width: 4,
          height: 4,
          borderRadius: 4,
          backgroundColor: reverse ? "rgb(255, 196, 140)" : "rgb(190, 245, 255)",
          boxShadow: `0 0 10px 2px rgba(${rgb}, 0.8)`,
        }}
      />
    </div>
  )
}

export default async function OpengraphImage() {
  const [grotesk, mono] = await Promise.all([
    googleFont("Space Grotesk", 300, HEADLINE),
    googleFont("JetBrains Mono", 400, NAME.toUpperCase()),
  ])
  const fonts: { name: string; data: ArrayBuffer; weight: 300 | 400; style: "normal" }[] = []
  if (grotesk) fonts.push({ name: "Space Grotesk", data: grotesk, weight: 300, style: "normal" })
  if (mono) fonts.push({ name: "JetBrains Mono", data: mono, weight: 400, style: "normal" })

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", backgroundColor: "#05070A" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(${CYAN}, 0.1), rgba(${CYAN}, 0) 60%)`,
          }}
        />
        <img src={floorSvg()} alt="" width={1200} height={300} style={{ position: "absolute", left: 0, top: 330 }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 370,
            width: 1200,
            height: 1,
            display: "flex",
            backgroundImage: `linear-gradient(to right, rgba(${CYAN}, 0), rgba(${CYAN}, 0.4), rgba(${CYAN}, 0))`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 2,
            height: 630,
            display: "flex",
            backgroundImage: `linear-gradient(to bottom, rgba(${CYAN}, 0), rgba(${CYAN}, 0.35) 40%, rgba(${CYAN}, 0.5) 65%, rgba(${CYAN}, 0))`,
          }}
        />

        <Trail top={78} left={760} width={240} rgb={CYAN} alpha={0.6} />
        <Trail top={262} left={930} width={150} rgb={EMBER} alpha={0.55} reverse />
        <Trail top={336} left={620} width={330} rgb={CYAN} alpha={0.85} />
        <Trail top={548} left={140} width={190} rgb={CYAN} alpha={0.5} />

        <div style={{ position: "absolute", left: 96, top: 126, display: "flex", flexDirection: "column", maxWidth: 860 }}>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              letterSpacing: 6,
              color: `rgba(${CYAN}, 0.75)`,
              marginBottom: 24,
            }}
          >
            {NAME.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: "Space Grotesk",
              fontWeight: 300,
              fontSize: 64,
              lineHeight: 1.15,
              letterSpacing: -0.6,
              color: "#E6F1FF",
            }}
          >
            {HEADLINE}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
