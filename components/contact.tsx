"use client"

import { Mail, Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { fadeUp, staggerContainer, staggerItem, duration } from "@/lib/motion"

const links = [
  {
    name: "Email",
    href: "mailto:er.hamzashaikh@gmail.com",
    icon: Mail,
    label: "er.hamzashaikh@gmail.com",
    subsystem: "LINK",
  },
  {
    name: "GitHub",
    href: "https://github.com/Raynzler",
    icon: Github,
    label: "github.com/Raynzler",
    subsystem: "NODE",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/shamza31",
    icon: Linkedin,
    label: "linkedin.com/in/shamza31",
    subsystem: "RELAY",
  },
  {
    name: "X",
    href: "https://x.com/shamza31",
    icon: Twitter,
    label: "x.com/shamza31",
    subsystem: "SIGNAL",
  },
]

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

  return (
    <section id="contact" ref={ref}>
      <div className="section-sep" />

      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6">

          {/* Section label */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-4 mb-16"
          >
            <span className="subsystem-label" style={{ color: "rgba(79, 223, 255, 0.45)" }}>
              RELAY
            </span>
            <span
              className="h-px"
              style={{
                width: "120px",
                background: "linear-gradient(to right, rgba(79, 223, 255, 0.15), transparent)",
              }}
            />
            <span className="font-mono text-xs" style={{ color: "rgba(107, 118, 132, 0.5)" }}>
              Contact
            </span>
          </motion.div>

          <div className="max-w-sm">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.04 }}
              className="text-xs leading-relaxed mb-10"
              style={{ color: "rgba(107, 118, 132, 0.9)" }}
            >
              Open to infrastructure and reliability engineering roles.
              Prefer async communication.
            </motion.p>

            {/* Contact links — terminal console feel */}
            <motion.div
              variants={staggerContainer(0.07, 0.08)}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-1"
            >
              {links.map((link) => (
                <motion.div key={link.name} variants={staggerItem}>
                  <Link
                    href={link.href}
                    target={link.name !== "Email" ? "_blank" : undefined}
                    rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 px-4 py-3 rounded-sm group transition-colors"
                    style={{
                      background: "transparent",
                      border: "1px solid transparent",
                      transition: `border-color ${duration.hover * 1000}ms ease, background ${duration.hover * 1000}ms ease`,
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = "rgba(79, 223, 255, 0.14)"
                      el.style.background = "rgba(79, 223, 255, 0.03)"
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = "transparent"
                      el.style.background = "transparent"
                    }}
                  >
                    {/* Subsystem micro-label */}
                    <span className="subsystem-label w-12 shrink-0"
                          style={{ color: "rgba(79, 223, 255, 0.3)" }}>
                      {link.subsystem}
                    </span>

                    <link.icon className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(107, 118, 132, 0.5)" }} />

                    <span className="font-mono text-xs" style={{ color: "rgba(170, 182, 195, 0.7)" }}>
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.35 }}
            className="mt-24 pt-8"
            style={{ borderTop: "1px solid rgba(110, 231, 249, 0.07)" }}
          >
            <div className="flex items-center justify-between">
                <p className="font-mono text-xs" style={{ color: "rgba(107, 118, 132, 0.3)" }}>
                  Next.js · Tailwind CSS · Framer Motion · Vercel
                </p>
              </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
