'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'

/* ─── Data ─────────────────────────────────────────────────────────────── */
type Tag = 'all' | 'weekly' | 'upcoming' | 'special'

const EVENTS = [
  {
    id: 1, tag: 'weekly' as Tag, featured: true,
    img: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1400&q=90&auto=format&fit=crop',
    badgeLabel: 'Weekly', badgeColor: '#c9a84c', badgeText: '#0f2418',
    titleEn: "Friday Jumu'ah Prayer",   titleAr: 'صلاة الجمعة',
    dateEn: 'Every Friday',             dateAr: 'كل جمعة',
    time: '1:00 PM – 2:00 PM',
    locEn: 'Main Prayer Hall',          locAr: 'قاعة الصلاة الرئيسية',
    descEn: "Join us every Friday for Jumu'ah. The Imam delivers the Khutbah in English, followed by congregational prayer. All are welcome — no registration required.",
    descAr: 'انضم إلينا كل جمعة. يلقي الإمام الخطبة بالإنجليزية، تليها صلاة الجمعة مفتوحة للجميع.',
  },
  {
    id: 2, tag: 'weekly' as Tag, featured: false,
    img: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=85&auto=format&fit=crop',
    badgeLabel: 'Weekly', badgeColor: '#1e4d33', badgeText: '#c9a84c',
    titleEn: 'Sunday Quran Circle',     titleAr: 'حلقة القرآن الكريم',
    dateEn: 'Every Sunday',             dateAr: 'كل أحد',
    time: '10:00 AM – 12:00 PM',
    locEn: 'Education Wing, Room 3',    locAr: 'جناح التعليم، غرفة ٣',
    descEn: 'Weekly Quran recitation and Tajweed for all levels. Beginners warmly welcomed. Free childcare provided.',
    descAr: 'درس أسبوعي في تلاوة القرآن والتجويد. المبتدئون موضع ترحيب. رعاية الأطفال مجانية.',
  },
  {
    id: 3, tag: 'upcoming' as Tag, featured: false,
    img: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=85&auto=format&fit=crop',
    badgeLabel: 'Apr 26', badgeColor: '#0f2418', badgeText: '#e8c97a',
    titleEn: 'Islamic History Lecture', titleAr: 'محاضرة التاريخ الإسلامي',
    dateEn: 'April 26, 2026',           dateAr: '٢٦ أبريل ٢٠٢٦',
    time: '6:00 PM – 8:00 PM',
    locEn: 'Main Hall',                 locAr: 'القاعة الرئيسية',
    descEn: 'A special lecture on the history of Islam in America. Open to all ages.',
    descAr: 'محاضرة خاصة عن تاريخ الإسلام في أمريكا. مفتوحة لجميع الأعمار.',
  },
  {
    id: 4, tag: 'upcoming' as Tag, featured: false,
    img: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?w=800&q=85&auto=format&fit=crop',
    badgeLabel: 'May 3', badgeColor: '#0f2418', badgeText: '#e8c97a',
    titleEn: 'Youth Halaqah',           titleAr: 'حلقة الشباب',
    dateEn: 'May 3, 2026',             dateAr: '٣ مايو ٢٠٢٦',
    time: '6:00 PM – 8:00 PM',
    locEn: 'Youth Room',               locAr: 'غرفة الشباب',
    descEn: 'A gathering for Muslim youth ages 13–25. Discussion on faith, identity, and thriving as a Muslim in America.',
    descAr: 'لقاء للشباب المسلم من ١٣ إلى ٢٥ سنة. نقاش حول الإيمان والهوية.',
  },
  {
    id: 5, tag: 'special' as Tag, featured: false,
    img: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=85&auto=format&fit=crop',
    badgeLabel: 'May 10', badgeColor: '#7a5200', badgeText: '#fdf6e3',
    titleEn: 'Parenting Workshop',      titleAr: 'ورشة التربية',
    dateEn: 'May 10, 2026',            dateAr: '١٠ مايو ٢٠٢٦',
    time: '2:00 PM – 5:00 PM',
    locEn: 'Conference Room',          locAr: 'قاعة المؤتمرات',
    descEn: 'Practical tools for raising children in the West with strong Islamic values. Free childcare. All families welcome.',
    descAr: 'أدوات عملية لتربية الأبناء في الغرب بقيم إسلامية. رعاية مجانية.',
  },
  {
    id: 6, tag: 'special' as Tag, featured: false,
    img: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=800&q=85&auto=format&fit=crop',
    badgeLabel: 'May 17', badgeColor: '#7a5200', badgeText: '#fdf6e3',
    titleEn: 'Community Iftar Dinner',  titleAr: 'إفطار جماعي',
    dateEn: 'May 17, 2026',            dateAr: '١٧ مايو ٢٠٢٦',
    time: '7:30 PM – 9:30 PM',
    locEn: 'Community Hall',           locAr: 'قاعة المجتمع',
    descEn: 'Share a meal and strengthen community bonds. Open to Muslims and non-Muslims alike. Bring your neighbors.',
    descAr: 'تناول الطعام وتعزيز روابط المجتمع. مفتوح للجميع.',
  },
]

const TABS: { key: Tag; label: string }[] = [
  { key: 'all',      label: 'All Events' },
  { key: 'weekly',   label: 'Weekly'     },
  { key: 'upcoming', label: 'Upcoming'   },
  { key: 'special',  label: 'Special'    },
]

/* ─── SVG icons ────────────────────────────────────────────────────────── */
const CalIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const ClockIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const PinIcon   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>

/* ══════════════════════════════════════════════════════════════════════ */
export default function EventsPage() {
  const { lang, isRTL } = useLang()
  const [activeTab, setActiveTab] = useState<Tag>('all')

  const g = (e: typeof EVENTS[0]) => ({
    title: lang === 'ar' ? e.titleAr : e.titleEn,
    date:  lang === 'ar' ? e.dateAr  : e.dateEn,
    loc:   lang === 'ar' ? e.locAr   : e.locEn,
    desc:  lang === 'ar' ? e.descAr  : e.descEn,
  })

  const featured = EVENTS[0]
  const filtered = EVENTS.filter(e => !e.featured && (activeTab === 'all' || e.tag === activeTab))
  const fd = g(featured)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .ev-card { transition: transform .28s cubic-bezier(.16,1,.3,1), box-shadow .28s; }
        .ev-card:hover { transform: translateY(-5px); box-shadow: 0 20px 60px rgba(0,0,0,.14) !important; }
        .ev-card:hover .ev-img { transform: scale(1.06); }
        .ev-img { transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .tab-btn { transition: background .15s, color .15s, border-color .15s; }
      `}</style>

      {/* ══════ HERO ══════ */}
      <section style={{ position: 'relative', height: 500, overflow: 'hidden' }} aria-labelledby="events-h1">
        <Image
          src="https://images.unsplash.com/photo-1466442929976-97f336a657be?w=1800&q=90&auto=format&fit=crop"
          alt="Mosque" fill sizes="100vw" priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,20,12,.3) 0%, rgba(5,20,12,.6) 50%, rgba(5,20,12,.95) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,.07) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, rgba(201,168,76,.6), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

        <div className={`${isRTL ? 'rtl' : ''}`} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: '0 20px 60px' }}>
          <p style={{ color: 'rgba(201,168,76,.8)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: 14 }}>
            Umatul Islam Center · Minneapolis
          </p>
          <h1 id="events-h1" className="font-cinzel" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, textShadow: '0 2px 30px rgba(0,0,0,.4)', marginBottom: 14 }}>
            {lang === 'ar' ? 'الفعاليات القادمة' : 'Community Events'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '1rem', maxWidth: 440 }}>
            {lang === 'ar' ? 'انضم إلينا في هذه الفعاليات المجتمعية' : 'Gather, learn, and grow together in faith and community'}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 80px', position: 'relative', zIndex: 10 }}>

        {/* ══════ FEATURED JUMMAH ══════ */}
        <article style={{ marginTop: -48, borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 70px rgba(15,36,24,.22)', border: '1px solid rgba(201,168,76,.25)', marginBottom: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

            {/* Image */}
            <div style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}>
              <Image
                src={featured.img}
                alt={fd.title}
                fill sizes="(min-width: 768px) 50vw, 100vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 50%, rgba(15,36,24,.5) 100%)' }} />
              <span style={{ position: 'absolute', top: 18, left: 18, background: featured.badgeColor, color: featured.badgeText, fontSize: '.65rem', fontWeight: 800, padding: '5px 13px', borderRadius: 99, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {featured.badgeLabel}
              </span>
              <div style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(15,36,24,.75)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 14px', border: '1px solid rgba(201,168,76,.2)' }}>
                <p style={{ color: '#e8c97a', fontFamily: 'monospace', fontWeight: 800, fontSize: '.9rem', lineHeight: 1 }}>{featured.time}</p>
              </div>
            </div>

            {/* Content */}
            <div style={{ background: 'linear-gradient(145deg, #0c1e12 0%, #1a3d2b 100%)', padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 2, background: '#c9a84c', borderRadius: 99 }} />
                  <span style={{ color: 'rgba(201,168,76,.7)', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>Featured</span>
                </div>
                <h2 className="font-cinzel" style={{ color: '#fff', fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
                  {fd.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,.55)', lineHeight: 1.8, fontSize: '.92rem', marginBottom: 24 }}>
                  {fd.desc}
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 24px', marginBottom: 20 }}>
                  {[{ icon: <CalIcon />, text: fd.date }, { icon: <ClockIcon />, text: featured.time }, { icon: <PinIcon />, text: fd.loc }].map(({ icon, text }, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.45)', fontSize: '.8rem', fontWeight: 500 }}>
                      <span style={{ color: '#c9a84c' }}>{icon}</span>{text}
                    </span>
                  ))}
                </div>
                <div style={{ height: 1, background: 'rgba(201,168,76,.15)', marginBottom: 18 }} />
                <p style={{ color: '#c9a84c', fontSize: '.85rem', fontWeight: 600 }}>All are welcome · No registration required</p>
              </div>
            </div>
          </div>
        </article>

        {/* ══════ FILTER TABS ══════ */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className="tab-btn"
              style={{
                padding: '9px 22px',
                borderRadius: 99,
                fontSize: '.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeTab === key ? '2px solid var(--g-800)' : '1.5px solid var(--border)',
                background: activeTab === key ? 'var(--g-800)' : 'var(--surface)',
                color: activeTab === key ? '#fff' : 'var(--muted)',
                letterSpacing: '.03em',
              }}
              aria-pressed={activeTab === key}
            >
              {label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', fontSize: '.8rem', color: 'var(--subtle)', fontWeight: 500 }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ══════ EVENT GRID ══════ */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--subtle)' }}>
            <p className="font-cinzel" style={{ fontSize: '1.1rem', marginBottom: 8 }}>No events in this category</p>
            <p style={{ fontSize: '.85rem' }}>Check back soon or view all events.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20 }}>
            {filtered.map(event => {
              const { title, date, loc, desc } = g(event)
              return (
                <article key={event.id} className="ev-card" style={{ background: 'var(--surface)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 2px 14px rgba(0,0,0,.05)', display: 'flex', flexDirection: 'column' }}>
                  {/* Image */}
                  <div style={{ height: 196, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                    <Image src={event.img} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center' }} className="ev-img" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,25,16,.75) 100%)' }} />
                    <span style={{ position: 'absolute', top: 14, left: 14, background: event.badgeColor, color: event.badgeText, fontSize: '.62rem', fontWeight: 800, padding: '4px 11px', borderRadius: 99, letterSpacing: '.1em', textTransform: 'uppercase' }}>{event.badgeLabel}</span>
                    <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,.85)', fontSize: '.75rem', fontWeight: 600 }}>
                        <span style={{ color: '#c9a84c' }}><CalIcon /></span> {date}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,.55)', fontSize: '.72rem' }}>{event.time}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '22px 22px 26px', display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
                    <h3 className="font-cinzel" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--g-900)', lineHeight: 1.3 }}>{title}</h3>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--subtle)', fontSize: '.77rem' }}>
                      <PinIcon /> {loc}
                    </span>
                    <p style={{ fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.7, flex: 1 }}>{desc}</p>
                    <div style={{ height: 1, background: 'var(--border)', marginTop: 10 }} />
                    <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--g-600)', fontWeight: 700, fontSize: '.8rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>
                      Learn more
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ══════ BOTTOM VERSE ══════ */}
        <div style={{ marginTop: 64, borderRadius: 22, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #071610 0%, #1a3d2b 100%)', border: '1px solid rgba(201,168,76,.18)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div style={{ position: 'relative', padding: '52px 32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(201,168,76,.5))', maxWidth: 80 }} />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(201,168,76,.5))', maxWidth: 80 }} />
            </div>
            <p className="font-amiri" lang="ar" style={{ color: '#e8c97a', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', direction: 'rtl', lineHeight: 1.7, marginBottom: 16 }}>
              وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ
            </p>
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.9rem', fontStyle: 'italic' }}>
              &ldquo;Help one another in righteousness and piety.&rdquo; — Quran 5:2
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
