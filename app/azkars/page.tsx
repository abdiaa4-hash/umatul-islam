'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useLang } from '../contexts/LanguageContext'

type Tab = 'morning' | 'evening' | 'after'

const TABS: { key: Tab; en: string; ar: string; so: string }[] = [
  { key: 'morning', en: 'Morning',      ar: 'الصباح',     so: 'Subaxda'         },
  { key: 'evening', en: 'Evening',      ar: 'المساء',     so: 'Fiidkii'         },
  { key: 'after',   en: 'After Prayer', ar: 'بعد الصلاة', so: 'Ka dib Salaadda' },
]

const AZKARS: Record<Tab, { id: number; arabic: string; translit: string; en: string; count: number; source: string; virtue?: string }[]> = {
  morning: [
    {
      id: 1, count: 100,
      arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
      translit: 'Subḥāna llāhi wa biḥamdih',
      en: 'Glory be to Allah and praise be to Him.',
      source: 'Muslim 2692',
      virtue: 'Whoever says this 100 times has his sins forgiven even if they were like the foam of the sea.',
    },
    {
      id: 2, count: 1,
      arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
      translit: 'Aṣbaḥnā wa aṣbaḥa l-mulku li-llāh',
      en: 'We have entered morning and sovereignty belongs to Allah.',
      source: 'Abu Dawud 5071',
    },
    {
      id: 3, count: 3,
      arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
      translit: "A'ūdhu bi kalimāti llāhi t-tāmmāti min sharri mā khalaq",
      en: 'I seek refuge in the perfect words of Allah from the evil of what He created.',
      source: 'Muslim 2708',
      virtue: 'Nothing will harm the one who says this until morning.',
    },
    {
      id: 4, count: 1,
      arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا',
      translit: 'Allāhumma bika aṣbaḥnā wa bika amsaynā',
      en: 'O Allah, by You we enter morning and by You we enter evening.',
      source: 'Abu Dawud 5068',
    },
  ],
  evening: [
    {
      id: 5, count: 1,
      arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
      translit: 'Amsaynā wa amsa l-mulku li-llāh',
      en: 'We have entered the evening and sovereignty belongs to Allah.',
      source: 'Abu Dawud 5071',
    },
    {
      id: 6, count: 3,
      arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ',
      translit: "Bismi llāhi lladhī lā yaḍurru ma'a smihi shay'",
      en: 'In the name of Allah, with whose name nothing can cause harm.',
      source: 'Abu Dawud 5088',
      virtue: 'Whoever says this 3 times in the evening will not be afflicted by sudden calamity.',
    },
    {
      id: 7, count: 1,
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ',
      translit: "Allāhumma innī as'aluka l-'afwa wa l-'āfiyah",
      en: 'O Allah, I ask You for pardon and well-being.',
      source: 'Abu Dawud 5074',
    },
  ],
  after: [
    {
      id: 8, count: 33,
      arabic: 'سُبْحَانَ اللَّهِ',
      translit: 'Subḥāna llāh',
      en: 'Glory be to Allah.',
      source: 'Muslim 595',
    },
    {
      id: 9, count: 33,
      arabic: 'الْحَمْدُ لِلَّهِ',
      translit: 'Al-ḥamdu li-llāh',
      en: 'All praise is due to Allah.',
      source: 'Muslim 595',
    },
    {
      id: 10, count: 34,
      arabic: 'اللَّهُ أَكْبَرُ',
      translit: 'Allāhu Akbar',
      en: 'Allah is the Greatest.',
      source: 'Muslim 595',
      virtue: 'Whoever recites these after every prayer will have his sins forgiven even if they are like sea foam.',
    },
    {
      id: 11, count: 10,
      arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
      translit: 'Lā ilāha illā llāhu waḥdahū lā sharīka lah',
      en: 'There is no god but Allah, alone, with no partner.',
      source: 'Bukhari 6404',
    },
    {
      id: 12, count: 1,
      arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      translit: "Allāhumma a'innī 'alā dhikrika wa shukrika wa ḥusni 'ibādatik",
      en: 'O Allah, help me to remember You, be grateful to You, and worship You well.',
      source: 'Abu Dawud 1522',
    },
  ],
}

export default function AzkarsPage() {
  const { lang, isRTL, t } = useLang()
  const [active, setActive] = useState<Tab>('morning')
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [speaking, setSpeaking] = useState<number | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const speak = useCallback((id: number, arabic: string) => {
    if (speaking === id) {
      window.speechSynthesis.cancel()
      setSpeaking(null)
      return
    }
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(arabic)
    utter.lang = 'ar'
    utter.rate = 0.8
    utter.onend = () => setSpeaking(null)
    utter.onerror = () => setSpeaking(null)
    utterRef.current = utter
    setSpeaking(id)
    window.speechSynthesis.speak(utter)
  }, [speaking])

  const tap = useCallback((id: number, max: number) => {
    setCounts(prev => {
      const cur = prev[id] ?? 0
      if (cur >= max) return prev
      return { ...prev, [id]: cur + 1 }
    })
  }, [])

  const reset = useCallback((id: number) => {
    setCounts(prev => ({ ...prev, [id]: 0 }))
  }, [])

  const toggleExpand = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const tabLabel = (tab: typeof TABS[0]) =>
    lang === 'ar' ? tab.ar : lang === 'so' ? tab.so : tab.en

  const getText = (a: typeof AZKARS.morning[0]) => a.en

  const allDone = AZKARS[active].every(az => (counts[az.id] ?? 0) >= az.count)
  const totalComplete = AZKARS[active].filter(az => (counts[az.id] ?? 0) >= az.count).length
  const totalCount = AZKARS[active].length

  return (
    <div style={{ background: '#0b1c12', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #071610 0%, #0f2418 50%, #122a1c 100%)',
          paddingTop: 48, paddingBottom: 0,
        }}
      >
        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,168,76,.07) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }} />
        {/* Gold top line */}
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

        <div className="relative z-10 text-center px-5 pb-8">
          <p className="text-xs font-bold uppercase tracking-[.22em] mb-3" style={{ color: 'rgba(201,168,76,.6)' }}>
            {t('masjidName')}
          </p>
          <h1 className="font-cinzel font-black text-white mb-4" style={{ fontSize: 'clamp(1.8rem,6vw,2.8rem)' }}>
            {t('azkarsTitle')}
          </h1>

          {/* Quran verse */}
          <div className="inline-block px-6 py-4 rounded-2xl mb-5" style={{ background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.18)' }}>
            <p className="font-amiri mb-1.5" style={{ color: '#e8c97a', fontSize: 'clamp(1.1rem,3.5vw,1.4rem)', direction: 'rtl', lineHeight: 1.8 }} lang="ar">
              أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,.4)' }}>
              {t('verseRemember')}
            </p>
          </div>

          {/* Progress summary */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.08)' }}>
              {totalComplete} / {totalCount} {t('completeLabel')}
            </div>
            {allDone && (
              <div className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: 'rgba(201,168,76,.15)', color: '#e8c97a', border: '1px solid rgba(201,168,76,.3)' }}>
                {t('sessionComplete')}
              </div>
            )}
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div role="tablist" className="flex gap-0 max-w-lg mx-auto px-4" style={{ position: 'relative', zIndex: 10 }}>
          {TABS.map(tab => {
            const isActive = active === tab.key
            const tabDone = AZKARS[tab.key].every(az => (counts[az.id] ?? 0) >= az.count)
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.key)}
                style={{
                  flex: 1,
                  padding: '14px 8px 18px',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all .18s',
                }}
              >
                <span className="text-xs font-bold" style={{ color: isActive ? '#c9a84c' : 'rgba(255,255,255,.35)', transition: 'color .18s' }}>
                  {tabLabel(tab)}
                </span>
                <span style={{ fontSize: '.6rem', color: isActive ? 'rgba(201,168,76,.55)' : 'rgba(255,255,255,.2)' }}>
                  {tab.key === 'morning' ? t('afterFajr') : tab.key === 'evening' ? t('afterAsr') : t('everySalah')}
                </span>
                {tabDone && <span style={{ fontSize: '.55rem', color: '#52b788', fontWeight: 700 }}>{t('doneLabel')}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── AZKAR LIST ── */}
      <section
        role="tabpanel"
        className="max-w-lg mx-auto px-4 pb-24"
        style={{ paddingTop: 20 }}
        aria-label={TABS.find(t => t.key === active)?.en}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AZKARS[active].map((az, idx) => {
            const cur = counts[az.id] ?? 0
            const done = cur >= az.count
            const pct = Math.min((cur / az.count) * 100, 100)
            const isExpanded = expanded[az.id]

            return (
              <div
                key={az.id}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: done
                    ? '1px solid rgba(82,183,136,.3)'
                    : '1px solid rgba(255,255,255,.06)',
                  boxShadow: done
                    ? '0 0 0 1px rgba(82,183,136,.1), 0 4px 24px rgba(0,0,0,.3)'
                    : '0 4px 24px rgba(0,0,0,.3)',
                  transition: 'all .2s',
                  background: done
                    ? 'linear-gradient(135deg, #0d2016, #112b1c)'
                    : 'linear-gradient(135deg, #101f16, #152a1e)',
                }}
              >
                {/* Number + listen button + completion indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px 0' }}>
                  <span style={{ fontSize: '.65rem', fontWeight: 700, color: 'rgba(255,255,255,.2)', letterSpacing: '.1em' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Listen / audio button */}
                    <button
                      type="button"
                      onClick={() => speak(az.id, az.arabic)}
                      aria-label={speaking === az.id ? 'Stop audio' : 'Listen to Arabic pronunciation'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 99,
                        border: speaking === az.id ? '1px solid rgba(201,168,76,.6)' : '1px solid rgba(255,255,255,.12)',
                        background: speaking === az.id ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.05)',
                        cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      {speaking === az.id ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#c9a84c" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      ) : (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                      )}
                      <span style={{ fontSize: '.6rem', fontWeight: 700, color: speaking === az.id ? '#c9a84c' : 'rgba(255,255,255,.3)', letterSpacing: '.06em' }}>
                        {speaking === az.id ? 'STOP' : 'LISTEN'}
                      </span>
                    </button>
                    {done && (
                      <span style={{ fontSize: '.65rem', fontWeight: 800, color: '#52b788', letterSpacing: '.1em', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#52b788" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {t('completeUpper')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arabic — tap to count */}
                <button
                  type="button"
                  onClick={() => tap(az.id, az.count)}
                  disabled={done}
                  dir="rtl"
                  lang="ar"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '20px 20px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: done ? 'default' : 'pointer',
                    textAlign: 'center',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                  aria-label={`Tap to count: ${az.en}`}
                >
                  <p
                    className="font-amiri"
                    style={{
                      color: done ? 'rgba(255,255,255,.45)' : '#fff',
                      fontSize: 'clamp(1.2rem, 5vw, 1.65rem)',
                      lineHeight: 2,
                      transition: 'color .2s',
                      userSelect: 'none',
                    }}
                  >
                    {az.arabic}
                  </p>
                </button>

                {/* Progress bar */}
                {az.count > 1 && (
                  <div style={{ height: 3, background: 'rgba(255,255,255,.06)', margin: '0 16px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: done ? '#52b788' : 'linear-gradient(to right, #c9a84c, #e8c97a)',
                        borderRadius: 99,
                        transition: 'width .2s ease',
                      }}
                    />
                  </div>
                )}

                {/* Details */}
                <div style={{ padding: '12px 16px 16px', direction: isRTL ? 'rtl' : 'ltr' }}>

                  {/* Transliteration */}
                  <p style={{ fontSize: '.75rem', fontStyle: 'italic', color: 'rgba(255,255,255,.3)', marginBottom: 5, letterSpacing: '.02em' }}>
                    {az.translit}
                  </p>

                  {/* Translation */}
                  <p style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.55, marginBottom: 12 }}>
                    {getText(az)}
                  </p>

                  {/* Virtue — expandable */}
                  {az.virtue && (
                    <div style={{ marginBottom: 12 }}>
                      <button
                        type="button"
                        onClick={() => toggleExpand(az.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}
                      >
                        <span style={{ fontSize: '.65rem', fontWeight: 700, color: '#c9a84c', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                          {isExpanded ? '▲' : '▼'} {t('virtueLabel')}
                        </span>
                      </button>
                      {isExpanded && (
                        <p style={{ fontSize: '.78rem', color: '#c9a84c', lineHeight: 1.55, marginTop: 6, padding: '8px 12px', background: 'rgba(201,168,76,.08)', borderRadius: 8, borderLeft: '2px solid rgba(201,168,76,.4)' }}>
                          {az.virtue}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bottom row: counter + source + reset */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>

                    {/* Tap counter */}
                    <button
                      type="button"
                      onClick={() => tap(az.id, az.count)}
                      disabled={done}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 14px',
                        borderRadius: 99,
                        border: done ? '1px solid rgba(82,183,136,.3)' : '1px solid rgba(201,168,76,.3)',
                        background: done ? 'rgba(82,183,136,.1)' : 'rgba(201,168,76,.1)',
                        cursor: done ? 'default' : 'pointer',
                        transition: 'all .15s',
                      }}
                    >
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: done ? '#52b788' : '#e8c97a',
                        minWidth: 28,
                        textAlign: 'right',
                      }}>
                        {cur}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.75rem' }}>/</span>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: '.85rem',
                        color: 'rgba(255,255,255,.35)',
                      }}>
                        {az.count}×
                      </span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Source */}
                      <span style={{
                        fontSize: '.65rem', fontWeight: 600,
                        color: 'rgba(255,255,255,.2)',
                        padding: '4px 8px',
                        borderRadius: 99,
                        border: '1px solid rgba(255,255,255,.07)',
                        background: 'rgba(255,255,255,.03)',
                      }}>
                        {az.source}
                      </span>

                      {/* Reset */}
                      {cur > 0 && (
                        <button
                          type="button"
                          onClick={() => reset(az.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'rgba(255,255,255,.2)', fontSize: '.65rem', padding: '4px 6px',
                          }}
                          aria-label="Reset count"
                        >
                          ↺
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Bottom verse ── */}
        <div className="mt-8 text-center">
          <div style={{ width: 40, height: 1, background: 'rgba(201,168,76,.3)', margin: '0 auto 16px' }} />
          <p className="font-amiri" style={{ color: 'rgba(201,168,76,.5)', fontSize: '1rem', direction: 'rtl' }} lang="ar">
            وَاذْكُرُوا اللَّهَ كَثِيرًا لَعَلَّكُمْ تُفْلِحُونَ
          </p>
          <p style={{ color: 'rgba(255,255,255,.2)', fontSize: '.7rem', marginTop: 6 }}>
            {t('verseRememberBottom')}
          </p>
        </div>
      </section>
    </div>
  )
}
