'use client'

import Link from 'next/link'

const NAV_LINKS = [
  { href: '/',          label: 'Prayer Times' },
  { href: '/events',    label: 'Events'       },
  { href: '/azkars',    label: 'Daily Azkars' },
  { href: '/donations', label: 'Donate'       },
  { href: '/ask',       label: 'Ask the Imam' },
]

const PRAYER_ROWS = [
  { name: 'Fajr',     adhan: '5:22 AM' },
  { name: 'Dhuhr',    adhan: '1:14 PM' },
  { name: "Jumu'ah",  adhan: '1:00 PM (Khutbah)' },
  { name: 'Asr',      adhan: '4:45 PM' },
  { name: 'Maghrib',  adhan: '8:05 PM' },
  { name: 'Isha',     adhan: '9:42 PM' },
]

const CONTACT = [
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    text: '2824 Lyndale Ave N\nMinneapolis, MN 55411',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    text: '(612) 555-0180',
  },
  {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    text: 'info@umatulislam.org',
  },
]

export default function Footer() {
  return (
    <footer aria-label="Site footer" style={{ background: 'var(--g-950)', borderTop: '1px solid rgba(201,168,76,.18)', color: 'rgba(255,255,255,.55)', fontSize: '0.85rem' }}>
      <style>{`
        .footer-link { color: rgba(255,255,255,.45); text-decoration: none; font-size: 0.85rem; transition: color .15s; }
        .footer-link:hover { color: var(--gold); }
        .footer-social { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.4); transition:all .2s; text-decoration:none; }
        .footer-social:hover { background:rgba(201,168,76,.15); color:#c9a84c; }
        .footer-bottom-link { font-size:.75rem; color:rgba(255,255,255,.25); text-decoration:none; transition:color .15s; }
        .footer-bottom-link:hover { color:rgba(201,168,76,.6); }
      `}</style>

      {/* Gold rule */}
      <div style={{ height: 2, background: 'linear-gradient(to right, transparent, rgba(201,168,76,.5), transparent)' }} />

      {/* Columns */}
      <div style={{ maxWidth: 'var(--max-w-full)', margin: '0 auto', padding: '56px 24px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px 32px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1.5px solid rgba(201,168,76,.5)' }}>
              <img src="/logo.svg" alt="UIC logo" width={44} height={44} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <p className="font-cinzel" style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>Umatul Islam</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(201,168,76,.6)', marginTop: 2 }}>Islamic Center</p>
            </div>
          </div>
          <p style={{ lineHeight: 1.7, fontSize: '0.8rem', color: 'rgba(255,255,255,.4)', maxWidth: 220 }}>
            A welcoming Islamic community in the heart of Minneapolis, Minnesota.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <a href="#" aria-label="Facebook" className="footer-social">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="footer-social">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-cinzel" style={{ color: 'rgba(201,168,76,.85)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 18 }}>Quick Links</h3>
          <nav aria-label="Footer navigation">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}><Link href={href} className="footer-link">{label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Prayer times */}
        <div>
          <h3 className="font-cinzel" style={{ color: 'rgba(201,168,76,.85)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 18 }}>Prayer Times</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRAYER_ROWS.map(({ name, adhan }) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span className="font-cinzel" style={{ color: 'rgba(255,255,255,.55)', fontSize: '0.8rem', fontWeight: 600 }}>{name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'rgba(201,168,76,.7)' }}>{adhan}</span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 12, fontSize: '0.7rem', color: 'rgba(255,255,255,.25)' }}>* Approximate · See homepage for live times</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-cinzel" style={{ color: 'rgba(201,168,76,.85)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 18 }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {CONTACT.map(({ icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'rgba(201,168,76,.6)', marginTop: 2, flexShrink: 0 }}>{icon}</span>
                <span style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.8rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 4, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.06)' }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(201,168,76,.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Jumu&apos;ah</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.4)' }}>Every Friday<br />Khutbah 1:00 PM · Prayer 1:30 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '18px 24px' }}>
        <div style={{ maxWidth: 'var(--max-w-full)', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,.25)' }}>© 2025 Umatul Islam Center · All Rights Reserved</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" className="footer-bottom-link">Privacy Policy</a>
            <a href="#" className="footer-bottom-link">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
