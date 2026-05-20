import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DynamicFavicon } from '@/components/dynamic-favicon'
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
  title: 'Hamza Shaikh — SRE / Infrastructure Engineer',
  description:
    'Backend and infrastructure engineer focused on reliability, observability, and operational ownership. M.Sc. Distributed Systems, RPTU Kaiserslautern.',
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
    title: 'Hamza Shaikh — SRE / Infrastructure Engineer',
    description:
      'Backend and infrastructure engineer focused on reliability, observability, and operational ownership.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
      style={{ scrollPaddingTop: '80px' }}
    >
      <body className="font-sans antialiased min-h-screen" style={{ backgroundColor: '#05070A' }}>
        <DynamicFavicon />
        {children}

        <footer className="pointer-events-none fixed bottom-5 right-6 z-40">
          <span className="end-of-line">
            END OF LINE<span className="footer-cursor">_</span>
          </span>
        </footer>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}