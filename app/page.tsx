'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLang } from './contexts/LanguageContext'
import { usePrayerTimes } from './hooks/usePrayerTimes'

/* ─── Helpers ───────────────────────────────────────────────────────── */
function getActiveIndex(prayers: { mins: number }[]) {
  if (!prayers.length) return 0
  const now = new Date()
  const m = now.getHours() * 60 + now.getMinutes()
  let idx = 0
  for (let i = 0; i < prayers.length; i++) {
    if (m >= prayers[i].mins) idx = i
  }
  return idx
}

function useCountdown(prayers: { mins: number; label: string }[], activeIdx: number) {
  const [cd, setCd] = useState({ h: 0, m: 0, s: 0, label: '' })
  useEffect(() => {
    if (!prayers.length) return
    const tick = () => {
      const now    = new Date()
      const sNow   = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
      const next   = prayers[(activeIdx + 1) % prayers.length]
      let   diff   = next.mins * 60 - sNow
      if (diff <= 0) diff += 86400
      setCd({ h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60, label: next.label })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [prayers, activeIdx])
  return cd
}

const pad = (n: number) => String(n).padStart(2, '0')

/* ─── Design tokens ─────────────────────────────────────────────────── */
const C = {
  cream:   '#faf8f3',
  sand:    '#f2ece0',
  deep:    '#1d3c2e',
  forest:  '#2b5440',
  sage:    '#4a7a5c',
  gold:    '#c4973e',
  goldLt:  '#d4a94f',
  text:    '#1c2b1f',
  muted:   '#5a6b5e',
  subtle:  '#8a9e8e',
  border:  '#e5ddd0',
  brdSoft: '#ede6d8',
  white:   '#ffffff',
}

/* ─── Reusable atoms ────────────────────────────────────────────────── */
function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p style={{ color: C.gold, fontSize: '.68rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 10, textAlign: center ? 'center' : 'left' }}>
      {children}
    </p>
  )
}

function GoldRule({ center = false }: { center?: boolean }) {
  return <div style={{ width: 36, height: 2, background: C.gold, borderRadius: 99, margin: center ? '0 auto 20px' : '0 0 20px' }} />
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLang()
  const { prayers, hijriDate, gregorianDate, loading } = usePrayerTimes()
  const activeIdx = getActiveIndex(prayers)
  const cd        = useCountdown(prayers, activeIdx)

  const PROGRAMS = [
    { icon: 'Q', title: t('prog1Title'), desc: t('prog1Desc'), href: '/azkars'   },
    { icon: 'W', title: t('prog2Title'), desc: t('prog2Desc'), href: '/events'   },
    { icon: 'Y', title: t('prog3Title'), desc: t('prog3Desc'), href: '/events'   },
    { icon: 'C', title: t('prog4Title'), desc: t('prog4Desc'), href: '/events'   },
  ]

  const EVENTS = [
    { date: 'Apr 26', day: 'SUN', title: t('prog1Title'), time: '6:00 – 8:00 PM', loc: 'Main Hall',        tag: t('tabSpecial') },
    { date: 'May 3',  day: 'SAT', title: t('prog3Title'), time: '6:00 – 9:00 PM', loc: 'Youth Room',       tag: t('tabWeekly')  },
    { date: 'May 10', day: 'SAT', title: t('prog1Title'), time: '2:00 – 5:00 PM', loc: 'Conference Room',  tag: t('tabSpecial') },
  ]

  const TRUST = [
    { n: '2001',      label: t('statEstablished')  },
    { n: '501(c)(3)', label: t('statNonprofit')     },
    { n: 'ISNA',      label: t('statMethod')        },
    { n: '12+',       label: t('statPrograms')      },
  ]

  return (
    <div style={{ background: C.cream, color: C.text, fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
      <style>{`
        @keyframes cdBlink { 0%,100%{opacity:1}  50%{opacity:.35} }
        .cd-sep { animation: cdBlink 1.4s ease-in-out infinite; color:${C.gold}; }

        .pcard { transition: transform .2s, box-shadow .2s; }
        .pcard:not(.active):hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,60,46,.1) !important; }

        .prog  { transition: transform .22s, border-color .22s, box-shadow .22s; }
        .prog:hover { transform: translateY(-3px); border-color:${C.gold} !important; box-shadow: 0 8px 28px rgba(29,60,46,.09) !important; }

        .erow  { transition: border-color .18s, box-shadow .18s; }
        .erow:hover { border-color:${C.gold} !important; box-shadow: 0 4px 18px rgba(196,151,62,.09) !important; }

        .ghost { transition: background .18s, border-color .18s, color .18s; }
        .ghost:hover { background: rgba(255,255,255,.1) !important; }

        .donate-btn { transition: box-shadow .2s, transform .15s; }
        .donate-btn:hover { box-shadow: 0 8px 28px rgba(196,151,62,.5) !important; transform: translateY(-1px); }

        @keyframes fadePulse { 0%,100%{opacity:.5} 50%{opacity:1} }
        .live-dot { animation: fadePulse 2s ease-in-out infinite; }
      `}</style>

      {/* ══ 1. PRAYER TIMES ══ */}
      <section style={{ background: C.sand, padding: '56px 20px 52px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Eyebrow center>{t('dailySalah')}</Eyebrow>
            <h1 className="font-cinzel" style={{ color: C.text, fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 8 }}>
              {t('todayPrayers')}
            </h1>
            {!loading && (hijriDate || gregorianDate) && (
              <p style={{ color: C.muted, fontSize: '.87rem' }}>
                {hijriDate}{gregorianDate ? ` · ${gregorianDate}` : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: 108, borderRadius: 14, background: C.border, opacity: .55, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
              {prayers.map(({ key, adhan, iqamah }, i) => {
                const isActive = i === activeIdx
                const isPast   = i < activeIdx
                const name     = t(key as 'fajr')
                return (
                  <div
                    key={key}
                    className={`pcard${isActive ? ' active' : ''}`}
                    style={{
                      padding: '20px 14px',
                      borderRadius: 14,
                      textAlign: 'center',
                      position: 'relative',
                      background: isActive ? C.deep : C.white,
                      border: `1.5px solid ${isActive ? 'transparent' : C.border}`,
                      boxShadow: isActive ? `0 6px 28px rgba(29,60,46,.28)` : '0 1px 4px rgba(0,0,0,.04)',
                      opacity: isPast && !isActive ? .5 : 1,
                    }}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {isActive && (
                      <span className="live-dot" style={{ position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: '50%', background: C.gold, display: 'block' }} />
                    )}
                    <p className="font-cinzel" style={{ fontSize: '.68rem', fontWeight: 700, color: isActive ? 'rgba(255,255,255,.5)' : C.subtle, letterSpacing: '.06em', marginBottom: 10, textTransform: 'uppercase' }}>
                      {name}
                    </p>
                    <p style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.15rem', color: isActive ? C.goldLt : C.text, lineHeight: 1 }}>
                      {adhan}
                    </p>
                    {iqamah && (
                      <p style={{ fontSize: '.62rem', color: isActive ? 'rgba(255,255,255,.38)' : C.subtle, marginTop: 7, fontWeight: 500 }}>
                        {t('iqamah')} {iqamah}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {!loading && prayers.length > 0 && (
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ flex: 1, height: 1, background: C.brdSoft, maxWidth: 72 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '.72rem', color: C.subtle, fontWeight: 500 }}>{t('nextLabel')}:</span>
                <span className="font-cinzel" style={{ fontSize: '.8rem', fontWeight: 700, color: C.muted }}>{cd.label}</span>
                <span style={{ fontSize: '.72rem', color: C.subtle }}>in</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: C.deep, letterSpacing: '.04em' }}>
                  {pad(cd.h)}<span className="cd-sep">:</span>{pad(cd.m)}<span className="cd-sep">:</span>{pad(cd.s)}
                </span>
              </div>
              <div style={{ flex: 1, height: 1, background: C.brdSoft, maxWidth: 72 }} />
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: '.67rem', color: C.subtle, marginTop: 14, letterSpacing: '.08em', fontWeight: 500 }}>
            {t('isnaBanner')}
          </p>
        </div>
      </section>

      {/* ══ 2. JUMU'AH BANNER ══ */}
      <div style={{ background: C.deep, padding: '16px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 20px' }}>
          <span className="font-cinzel" style={{ color: C.gold, fontSize: '.72rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase' }}>{t('jumuahPrayerLabel')}</span>
          <span style={{ width: 1, height: 14, background: 'rgba(196,151,62,.35)', display: 'inline-block' }} />
          <span style={{ color: 'rgba(255,255,255,.72)', fontSize: '.85rem' }}>{t('jumuahBannerText')}</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.12)', display: 'inline-block' }} />
          <span style={{ color: 'rgba(255,255,255,.38)', fontSize: '.8rem' }}>{t('jumuahAddressText')}</span>
        </div>
      </div>

      {/* ══ 3. MISSION & TRUST ══ */}
      <section style={{ background: C.cream, padding: '88px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px 80px', alignItems: 'center' }}>

          <div>
            <Eyebrow>{t('aboutUsLabel')}</Eyebrow>
            <h2 className="font-cinzel" style={{ color: C.text, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.18, marginBottom: 20 }}>
              {t('homeHeroTitle')}
            </h2>
            <GoldRule />
            <p style={{ color: C.muted, lineHeight: 1.9, fontSize: '.95rem', marginBottom: 16 }}>
              {t('homeDesc1')}
            </p>
            <p style={{ color: C.muted, lineHeight: 1.9, fontSize: '.95rem', marginBottom: 32 }}>
              {t('homeDesc2')}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {['Est. 2001', 'ISNA Method', 'Minneapolis, MN'].map(b => (
                <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '.7rem', fontWeight: 700, color: C.sage, background: '#edf5f0', padding: '5px 12px', borderRadius: 99, border: `1px solid ${C.border}`, letterSpacing: '.04em' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 4px 24px rgba(29,60,46,.06)', marginBottom: 18 }}>
              {TRUST.map(({ n, label }, i) => (
                <div key={label} style={{ padding: '26px 22px', background: i === 0 ? C.deep : i === 3 ? C.sand : C.white, borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                  <p className="font-cinzel" style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 2vw, 1.65rem)', color: i === 0 ? C.goldLt : C.deep, lineHeight: 1, marginBottom: 6 }}>{n}</p>
                  <p style={{ fontSize: '.65rem', color: i === 0 ? 'rgba(255,255,255,.45)' : C.subtle, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>{label}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: '22px 24px', background: C.white, borderRadius: 14, borderLeft: `3px solid ${C.gold}`, border: `1px solid ${C.brdSoft}` }}>
              <p style={{ fontSize: '.88rem', fontStyle: 'italic', color: C.muted, lineHeight: 1.8, marginBottom: 10 }}>
                {t('testimonialText')}
              </p>
              <p style={{ fontSize: '.68rem', fontWeight: 700, color: C.sage, letterSpacing: '.07em', textTransform: 'uppercase' }}>{t('testimonialAuthor')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. ANNOUNCEMENT ══ */}
      <div style={{ background: '#fef9ec', borderTop: '1px solid #f0e0a8', borderBottom: '1px solid #f0e0a8', padding: '14px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.gold, flexShrink: 0 }} />
          <p style={{ fontSize: '.85rem', color: '#6b4a00', fontWeight: 500 }}>
            <strong>{t('announcement')}:</strong> {t('announcementText')}{' '}
            <Link href="/events" style={{ color: C.gold, fontWeight: 700, textDecoration: 'none' }}>{t('registerLink')}</Link>
          </p>
        </div>
      </div>

      {/* ══ 5. PROGRAMS ══ */}
      <section style={{ background: C.sand, padding: '88px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Eyebrow center>{t('whatWeOffer')}</Eyebrow>
            <h2 className="font-cinzel" style={{ color: C.text, fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 800, marginBottom: 12 }}>
              {t('programsTitle')}
            </h2>
            <p style={{ color: C.muted, fontSize: '.92rem', maxWidth: 440, margin: '0 auto' }}>
              {t('programsDesc')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {PROGRAMS.map(({ title, desc, href }) => (
              <Link key={href + title} href={href}
                className="prog"
                style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '28px 24px', borderRadius: 16, background: C.white, border: `1.5px solid ${C.border}`, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,.04)', minHeight: 190 }}
              >
                <h3 className="font-cinzel" style={{ fontWeight: 700, fontSize: '.9rem', color: C.text, lineHeight: 1.35 }}>{title}</h3>
                <p style={{ fontSize: '.82rem', color: C.muted, lineHeight: 1.75, flex: 1 }}>{desc}</p>
                <span style={{ fontSize: '.75rem', fontWeight: 700, color: C.sage, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {t('learnMore')}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. EVENTS ══ */}
      <section style={{ background: C.cream, padding: '88px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <Eyebrow>{t('communityLabel')}</Eyebrow>
              <h2 className="font-cinzel" style={{ color: C.text, fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 800 }}>{t('upcomingEvents')}</h2>
            </div>
            <Link href="/events" style={{ fontSize: '.8rem', fontWeight: 700, color: C.sage, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, padding: '8px 18px', border: `1.5px solid ${C.border}`, borderRadius: 99, background: C.white }}>
              {t('viewAllEvents')}
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EVENTS.map(({ date, day, title, time, loc, tag }) => (
              <div key={title}
                className="erow"
                style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 22px', borderRadius: 14, background: C.white, border: `1.5px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,.04)', flexWrap: 'wrap', cursor: 'default' }}
              >
                <div style={{ textAlign: 'center', flexShrink: 0, width: 52 }}>
                  <p className="font-cinzel" style={{ fontWeight: 900, fontSize: '1.3rem', color: C.deep, lineHeight: 1 }}>{day}</p>
                  <div style={{ width: 20, height: 2, background: C.gold, borderRadius: 99, margin: '5px auto' }} />
                  <p style={{ fontSize: '.62rem', color: C.subtle, fontWeight: 600, letterSpacing: '.05em' }}>{date}</p>
                </div>
                <div style={{ width: 1, height: 44, background: C.border, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 180 }}>
                  <h3 className="font-cinzel" style={{ fontWeight: 700, fontSize: '.95rem', color: C.text, marginBottom: 6 }}>{title}</h3>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {[
                      { path: 'M12 6v6l4 2', circle: true,  label: time },
                      { path: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0', circle: false, label: loc },
                    ].map(({ label, path, circle }) => (
                      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.75rem', color: C.muted }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          {circle && <circle cx="12" cy="12" r="10"/>}
                          <path d={path}/>
                        </svg>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: '.62rem', fontWeight: 800, color: C.sage, background: '#edf5f0', padding: '4px 11px', borderRadius: 99, letterSpacing: '.08em', textTransform: 'uppercase', flexShrink: 0 }}>
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. QURAN VERSE ══ */}
      <div style={{ background: C.sand, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '64px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: C.brdSoft, maxWidth: 64 }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <div style={{ flex: 1, height: 1, background: C.brdSoft, maxWidth: 64 }} />
          </div>
          <p className="font-amiri" lang="ar" style={{ color: C.deep, fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', direction: 'rtl', lineHeight: 1.8, marginBottom: 18 }}>
            إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ
          </p>
          <p style={{ color: C.muted, fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 8 }}>
            &ldquo;{t('verseIkhwa')}&rdquo;
          </p>
          <p className="font-cinzel" style={{ color: C.gold, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em' }}>
            AL-HUJURAT 49:10
          </p>
        </div>
      </div>

      {/* ══ 8. LEADERSHIP ══ */}
      <section style={{ background: C.cream, padding: '88px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <Eyebrow center>{t('leadershipLabel')}</Eyebrow>
            <h2 className="font-cinzel" style={{ color: C.text, fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 800 }}>
              {t('leadershipTitle')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, maxWidth: 740, margin: '0 auto' }}>
            {[
              { initials: 'AM', name: 'Abdirahman Mohamed', role: t('leadImam'),   title: t('religDirector') },
              { initials: 'SA', name: 'Suleiman Ali',       role: t('boardChair'),  title: t('boardOfDir')   },
            ].map(({ initials, name, role, title }) => (
              <div key={role} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 18, padding: '30px 28px', boxShadow: '0 2px 12px rgba(0,0,0,.05)', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.deep, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `2px solid ${C.border}` }}>
                  <span className="font-cinzel" style={{ color: C.goldLt, fontSize: '1rem', fontWeight: 900 }}>{initials}</span>
                </div>
                <div>
                  <p className="font-cinzel" style={{ fontWeight: 800, fontSize: '.95rem', color: C.text, marginBottom: 2 }}>{name}</p>
                  <p style={{ color: C.gold, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 2 }}>{role}</p>
                  <p style={{ color: C.gold, fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>{title}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/ask" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 99, border: `1.5px solid ${C.border}`, color: C.sage, fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', background: C.white }}>
              {t('askImamLink')}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 9. DONATION CTA ══ */}
      <section style={{ background: C.deep, padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .035 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geo-d" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M32 0 L64 32 L32 64 L0 32 Z" fill="none" stroke="#c4973e" strokeWidth=".9"/>
                <circle cx="32" cy="32" r="9" fill="none" stroke="#c4973e" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo-d)"/>
          </svg>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Eyebrow center>{t('supportMasjidLabel')}</Eyebrow>
          <h2 className="font-cinzel" style={{ color: C.white, fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            {t('sustainTitle')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.68)', fontSize: '.95rem', lineHeight: 1.9, maxWidth: 480, margin: '0 auto 36px' }}>
            {t('donationCtaDesc')}{' '}
            <em style={{ color: C.goldLt, fontStyle: 'normal', fontWeight: 600 }}>{t('sadaqahJariyah')}</em>{' '}
            {t('donationCtaDesc2')}
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            <Link href="/donations"
              className="donate-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 36px', borderRadius: 12, background: C.gold, color: C.deep, fontFamily: 'var(--font-cinzel, Georgia, serif)', fontWeight: 800, fontSize: '.9rem', textDecoration: 'none', letterSpacing: '.04em', boxShadow: `0 4px 20px rgba(196,151,62,.38)` }}
            >
              {t('donateNow')}
            </Link>
            <Link href="/ask"
              className="ghost"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 36px', borderRadius: 12, background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.82)', fontWeight: 600, fontSize: '.9rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,.28)' }}
            >
              {t('contactUs')}
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}
