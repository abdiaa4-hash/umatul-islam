import type { Metadata } from 'next'
import { Cinzel, Amiri, Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './contexts/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Umatul Islam Center — Minneapolis',
  description: 'Umatul Islam Center (UIC) — Your Islamic home in Minneapolis, MN. Prayer times, events, azkars, donations, and community Q&A.',
  keywords: ['Umatul Islam', 'UIC', 'masjid', 'mosque', 'Minneapolis', 'Islamic center', 'prayer times', 'Muslim', 'Somali'],
  openGraph: {
    title: 'Umatul Islam Center — Minneapolis',
    description: 'Your Islamic home in Minneapolis, Minnesota.',
    siteName: 'Umatul Islam Center',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cinzel.variable} ${amiri.variable} ${inter.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        {/* Skip-to-content for keyboard / screen-reader users */}
        <a href="#main-content" className="skip-link">Skip to main content</a>

        <LanguageProvider>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
