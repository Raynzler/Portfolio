"use client"

import { motion } from "framer-motion"

const COUNT = 8

const TRAILS = Array.from({ length: COUNT }, (_, i) => {
  const width = 64 + i * 18
  const top = 8 + i * 10
  const duration = 10 + i * 2.6
  const delay = i * 0.9
  const isOrange = i % 5 === 3
  const color = isOrange ? "rgba(255,138,61,0.18)" : "rgba(79,223,255,0.16)"
  const glow = isOrange ? "0 0 18px rgba(255,138,61,0.10)" : "0 0 14px rgba(79,223,255,0.12)"

  return {
    width,
    top,
    duration,
    delay,
    color,
    glow,
    opacity: 0.16 + (i % 3) * 0.02,
  }
})

export function LightcycleGrid() {

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" style={{ opacity: 0.22 }}>
      {TRAILS.map((trail, i) => {
        return (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              width: `${trail.width}px`,
              top: `${trail.top}%`,
              left: "-30%",
              background: trail.color,
              opacity: trail.opacity,
              boxShadow: trail.glow,
              borderRadius: 2,
              transformOrigin: "left center",
            }}
            animate={{ x: ['-30vw', '140vw'] }}
            transition={{
              duration: trail.duration,
              repeat: Infinity,
              ease: "linear",
              delay: trail.delay,
            }}
          />
        )
      })}
    </div>
  )
}