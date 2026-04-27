'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang, Lang } from '../contexts/LanguageContext'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English'  },
  { code: 'ar', label: 'العربية'  },
  { code: 'so', label: 'Soomaali' },
]

/* ── Minimal SVG Icons ── */
const ClockIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const CalIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const BookIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
const HeartIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
const MsgIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const MenuIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const XIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const ChevIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>

export default function Navbar() {
  const { t, lang, setLang, isRTL } = useLang()
  const pathname   = usePathname()
  const [mOpen, setMOpen]   = useState(false)
  const [lOpen, setLOpen]   = useState(false)

  const links = [
    { href: '/',          label: t('navHome'),      icon: <ClockIcon /> },
    { href: '/events',    label: t('navEvents'),    icon: <CalIcon />   },
    { href: '/azkars',    label: t('navAzkars'),    icon: <BookIcon />  },
    { href: '/donations', label: t('navDonations'), icon: <HeartIcon /> },
    { href: '/ask',       label: t('navAsk'),       icon: <MsgIcon />   },
  ]

  const active = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const curLang = LANGS.find(l => l.code === lang)!

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(7,22,16,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(201,168,76,0.20)',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-[60px] flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" aria-label="Umatul Islam — Home">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0" style={{ outline: '1.5px solid rgba(201,168,76,.6)' }}>
              <img src="/logo.svg" alt="UIC logo" width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="font-cinzel font-bold text-sm leading-tight text-white">Umatul Islam</p>
              <p className="text-[10px] leading-tight" style={{ color: 'rgba(201,168,76,.7)' }}>Minneapolis, MN</p>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5" role="list">
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                role="listitem"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer trans"
                style={{
                  color:      active(href) ? '#fff' : 'rgba(255,255,255,.55)',
                  background: active(href) ? 'rgba(201,168,76,.12)' : 'transparent',
                  borderBottom: active(href) ? '2px solid var(--gold)' : '2px solid transparent',
                }}
                aria-current={active(href) ? 'page' : undefined}
              >
                <span style={{ color: active(href) ? 'var(--gold)' : 'rgba(255,255,255,.3)' }}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">

            {/* Donate CTA — desktop only */}
            <Link
              href="/donations"
              className="hidden md:inline-flex items-center gap-1.5 font-cinzel font-black rounded-xl cursor-pointer"
              style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #c9a84c, #e8c97a)',
                color: '#0f2418',
                border: 'none',
                fontSize: '.82rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 0 0 2px rgba(201,168,76,.4), 0 4px 16px rgba(201,168,76,.45)',
                textDecoration: 'none',
                transition: 'box-shadow .2s, transform .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,168,76,.7), 0 6px 24px rgba(201,168,76,.6)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,168,76,.4), 0 4px 16px rgba(201,168,76,.45)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <HeartIcon /> {t('navDonateCta')}
            </Link>

            {/* Language dropdown */}
            <div className="relative">
              <button
                onClick={() => setLOpen(!lOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold cursor-pointer trans"
                style={{
                  color: '#fff',
                  border: '1.5px solid var(--gold)',
                  background: 'rgba(201,168,76,.18)',
                  letterSpacing: lang === 'ar' ? '.02em' : '.01em',
                }}
                aria-label="Select language"
                aria-expanded={lOpen}
              >
                <span className="font-semibold" style={{ fontFamily: lang === 'ar' ? 'var(--font-amiri), serif' : 'inherit' }}>
                  {curLang.label}
                </span>
                <span style={{ color: 'var(--gold)' }}><ChevIcon /></span>
              </button>

              {lOpen && (
                <div
                  className="absolute top-12 right-0 rounded-xl overflow-hidden z-50"
                  style={{ background: 'var(--g-950)', border: '1px solid rgba(201,168,76,.25)', boxShadow: '0 12px 40px rgba(0,0,0,.5)', minWidth: '160px' }}
                  role="menu"
                >
                  {LANGS.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => { setLang(code); setLOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer trans text-left"
                      style={{
                        background: code === lang ? 'rgba(201,168,76,.10)' : 'transparent',
                        color:      code === lang ? '#fff' : 'rgba(255,255,255,.55)',
                        fontWeight: code === lang ? 600 : 400,
                      }}
                      role="menuitem"
                      aria-current={code === lang ? 'true' : undefined}
                    >
                      <span className="flex-1">{label}</span>
                      {code === lang && <span style={{ color: 'var(--gold)' }}><CheckIcon /></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl cursor-pointer trans text-white/70"
              onClick={() => setMOpen(!mOpen)}
              aria-label={mOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mOpen}
            >
              {mOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mOpen && (
          <div
            className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
            style={{ borderTop: '1px solid rgba(201,168,76,.15)', background: 'rgba(7,22,16,.98)' }}
            role="menu"
          >
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setMOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer trans"
                style={{
                  color:      active(href) ? '#fff' : 'rgba(255,255,255,.55)',
                  background: active(href) ? 'rgba(201,168,76,.10)' : 'transparent',
                  borderLeft: active(href) ? '2px solid var(--gold)' : '2px solid transparent',
                }}
                aria-current={active(href) ? 'page' : undefined}
              >
                <span style={{ color: active(href) ? 'var(--gold)' : 'rgba(255,255,255,.3)' }}>{icon}</span>
                {label}
              </Link>
            ))}
            <Link
              href="/donations"
              onClick={() => setMOpen(false)}
              className="flex items-center justify-center gap-2 font-cinzel font-bold text-sm rounded-xl cursor-pointer mt-2"
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-300))',
                color: 'var(--g-900)',
                textDecoration: 'none',
                letterSpacing: '0.03em',
              }}
            >
              <HeartIcon /> {t('navDonateMobile')}
            </Link>
          </div>
        )}
      </nav>

      {/* Dismiss lang dropdown */}
      {lOpen && <div className="fixed inset-0 z-40" onClick={() => setLOpen(false)} aria-hidden="true" />}
    </>
  )
}
