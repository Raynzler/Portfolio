import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DynamicFavicon } from '@/components/dynamic-favicon'
import { SmoothScroller } from '@/components/smooth-scroller'
import { SCROLL, Z_INDEX } from '@/lib/constants'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Hamza Shaikh - SRE / Infrastructure Engineer',
  description:
    'Backend and infrastructure engineer. I keep production systems observable, quick to recover, and cheap to run. M.Sc. Computer Science (Distributed Systems and Software Engineering), RPTU Kaiserslautern.',
  generator: 'Next.js',
  keywords: [
    'SRE',
    'Infrastructure',
    'DevOps',
    'Distributed Systems',
    'Observability',
    'Prometheus',
    'Kubernetes',
    'Go',
    'Python',
  ],
  authors: [{ name: 'Hamza Shaikh' }],
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'Hamza Shaikh - SRE / Infrastructure Engineer',
    description:
      'Backend and infrastructure engineer. I keep production systems observable, quick to recover, and cheap to run.',
    type: 'website',
  },
  other: {
    'x-system': 'ENCOM-OS-12',
    'x-grid-sector': '7-G',
    'x-clearance': 'FLYNN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
      style={{ scrollPaddingTop: `${SCROLL.headerOffset}px` }}
    >
      <body className="font-sans antialiased min-h-screen" style={{ backgroundColor: '#05070A' }}>
        <SmoothScroller />
        <DynamicFavicon />
        {children}

        <footer className="pointer-events-none fixed bottom-5 right-6" style={{ zIndex: Z_INDEX.footer }}>
          <span className="end-of-line">
            END OF LINE<span className="footer-cursor">_</span>
          </span>
        </footer>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}