'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'

type Cat = 'catFiqh' | 'catCommunity' | 'catEvents' | 'catGeneral'

/* ─── Icons ──────────────────────────────────────────────────────────── */
const SendIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const CheckCircle = () => <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
const EyeOffIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const ChevIcon = ({ open }: { open: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><polyline points="6 9 12 15 18 9"/></svg>

/* ─── FAQ accordion item ─────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
        aria-expanded={open}
      >
        <span style={{ fontWeight: 600, fontSize: '.92rem', color: 'var(--g-900)', lineHeight: 1.4 }}>{q}</span>
        <span style={{ flexShrink: 0, color: 'var(--gold)' }}><ChevIcon open={open} /></span>
      </button>
      {open && (
        <p style={{ fontSize: '.88rem', color: 'var(--muted)', lineHeight: 1.8, paddingBottom: 18 }}>{a}</p>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function AskPage() {
  const { t, isRTL } = useLang()
  const [question, setQuestion] = useState('')
  const [cat, setCat]           = useState<Cat>('catGeneral')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [anon, setAnon]         = useState(false)
  const [done, setDone]         = useState(false)
  const [busy, setBusy]         = useState(false)
  const [err, setErr]           = useState('')

  const CAT_META: { key: Cat; label: string }[] = [
    { key: 'catFiqh',      label: t('catFiqh')      },
    { key: 'catCommunity', label: t('catCommunity') },
    { key: 'catEvents',    label: t('catEvents')    },
    { key: 'catGeneral',   label: t('catGeneral')   },
  ]

  const FAQS = [
    { q: t('faq1q'), a: t('faq1a') },
    { q: t('faq2q'), a: t('faq2a') },
    { q: t('faq3q'), a: t('faq3a') },
    { q: t('faq4q'), a: t('faq4a') },
  ]

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) { setErr(t('questionLabel') + ' required'); return }
    if (!anon && !name.trim()) { setErr(t('nameLabel') + ' required'); return }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr(t('emailError')); return }
    setErr('')
    setEmailErr('')
    setBusy(true)
    try {
      const body = new FormData()
      body.append('question', question)
      body.append('category', cat)
      body.append('name', anon ? 'Anonymous' : name)
      if (email) body.append('email', email)
      body.append('isAnonymous', String(anon))
      const res = await fetch('https://formspree.io/f/meevwzdq', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })
      if (!res.ok) throw new Error('Formspree error')
    } catch {
      setErr('Failed to send. Please try again.')
      setBusy(false)
      return
    }
    setBusy(false)
    setDone(true)
  }

  /* ══ Success screen ══ */
  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 480, width: '100%' }} role="alert" aria-live="polite">
        <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 12px 60px rgba(15,36,24,.15)' }}>
          <div style={{ background: 'linear-gradient(145deg, #0c1e12, #1e4d33)', padding: '48px 36px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,.12)', border: '1.5px solid rgba(201,168,76,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#c9a84c' }}>
              <CheckCircle />
            </div>
            <h2 className="font-cinzel" style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>{t('questionReceived')}</h2>
            <p className="font-amiri" lang="ar" style={{ color: '#e8c97a', fontSize: '1.6rem', direction: 'rtl' }}>جَزَاكَ اللَّهُ خَيْرًا</p>
          </div>
          <div style={{ background: 'var(--surface)', padding: '28px 28px', border: '1px solid var(--border)', borderTop: 'none' }}>
            <p style={{ fontSize: '.88rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7, marginBottom: 20 }}>
              {t('confirmDesc')}
            </p>
            <div style={{ borderRadius: 14, padding: '16px 18px', background: 'var(--g-50)', border: '1px solid var(--border)', marginBottom: 16 }}>
              <p style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>{t('yourQuestionLabel')}</p>
              <p style={{ fontSize: '.88rem', fontStyle: 'italic', color: 'var(--g-900)', lineHeight: 1.65 }}>&ldquo;{question}&rdquo;</p>
            </div>
            {anon && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 12, padding: '12px 14px', background: 'rgba(15,36,24,.04)', border: '1px solid var(--border)', marginBottom: 16 }}>
                <span style={{ color: 'var(--g-600)', flexShrink: 0 }}><EyeOffIcon /></span>
                <p style={{ fontSize: '.78rem', color: 'var(--g-700)', fontWeight: 500 }}>{t('submittedAnonymously')}</p>
              </div>
            )}
            <button onClick={() => { setDone(false); setQuestion(''); setName(''); setEmail(''); setAnon(false); setCat('catGeneral') }}
              className="btn-primary" style={{ width: '100%', fontSize: '.92rem', padding: '13px' }}>
              {t('submitAnother')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ══ Main ══ */
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .cat-btn { transition: background .15s, border-color .15s, color .15s; }
        .cat-btn:hover { border-color: var(--g-400) !important; }
      `}</style>

      {/* ══════ HERO ══════ */}
      <section style={{ position: 'relative', height: 420, overflow: 'hidden' }} aria-labelledby="ask-h1">
        <Image
          src="https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1600&q=80&auto=format&fit=crop"
          alt="Islamic books and study" fill sizes="100vw" priority
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,22,16,.3) 0%, rgba(7,22,16,.7) 55%, rgba(7,22,16,.96) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,.06) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: '0 20px 52px' }}>
          <p style={{ color: 'rgba(201,168,76,.8)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: 12 }}>{t('islamicGuidance')}</p>
          <h1 id="ask-h1" className="font-cinzel" style={{ color: '#fff', fontSize: 'clamp(2rem, 5.5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 14, textShadow: '0 2px 30px rgba(0,0,0,.4)' }}>
            {t('askTitle')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '1rem', maxWidth: 420 }}>{t('askSub')}</p>
        </div>
      </section>

      <div className={isRTL ? 'rtl' : ''} style={{ maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* ══════ TRUST CARDS ══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, title: t('trustImamReviewed'), desc: t('trustImamDesc') },
            { icon: <EyeOffIcon />, title: t('trustAnonymous'), desc: t('trustAnonDesc') },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: t('trustResponse'), desc: t('trustResponseDesc') },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--surface)', borderRadius: 18, padding: '20px 14px', textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 2px 10px rgba(0,0,0,.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--g-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--g-700)' }}>{icon}</div>
              <p style={{ fontWeight: 700, fontSize: '.8rem', color: 'var(--g-900)', lineHeight: 1.3 }}>{title}</p>
              <p style={{ fontSize: '.72rem', color: 'var(--subtle)', lineHeight: 1.4 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* ══════ FAQ SECTION ══════ */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '28px 28px', border: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{ width: 28, height: 2, background: 'var(--gold)', borderRadius: 99 }} />
            <h2 className="font-cinzel" style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--g-900)', letterSpacing: '.04em' }}>{t('commonQuestions')}</h2>
          </div>
          <div>
            {FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>

        {/* ══════ FORM CARD ══════ */}
        <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(15,36,24,.1)' }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0f2418, #1a3d2b)', padding: '24px 28px', borderBottom: '1px solid rgba(201,168,76,.2)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', flexShrink: 0 }}>
              <SendIcon />
            </div>
            <div>
              <p className="font-cinzel" style={{ color: '#fff', fontWeight: 700, fontSize: '.95rem', lineHeight: 1.2 }}>{t('submitYourQuestion')}</p>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', marginTop: 2 }}>{t('allQuestionsReviewed')}</p>
            </div>
          </div>

          <form onSubmit={submit} style={{ padding: '28px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 22 }} noValidate>

            {/* Category */}
            <fieldset style={{ border: 'none', padding: 0 }}>
              <legend style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12, width: '100%' }}>
                {t('categoryLabel')}
              </legend>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {CAT_META.map(({ key, label }) => (
                  <button key={key} type="button" onClick={() => setCat(key)} aria-pressed={cat === key}
                    className="cat-btn"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderRadius: 14, fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', background: cat === key ? 'var(--g-900)' : 'var(--g-50)', border: cat === key ? '2px solid var(--g-900)' : '1.5px solid var(--border)', color: cat === key ? '#fff' : 'var(--muted)', boxShadow: cat === key ? '0 4px 14px rgba(15,36,24,.2)' : 'none' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div style={{ height: 1, background: 'var(--border)' }} />

            {/* Privacy toggle */}
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>{t('privacyLabel')}</p>
              <button type="button" onClick={() => setAnon(!anon)} aria-pressed={anon}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 14, background: anon ? 'rgba(15,36,24,.05)' : 'var(--g-50)', border: `2px solid ${anon ? 'var(--g-800)' : 'var(--border)'}`, cursor: 'pointer', transition: 'all .15s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: anon ? 'var(--g-900)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: anon ? '#c9a84c' : 'var(--muted)', flexShrink: 0 }}>
                    <EyeOffIcon />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--g-900)' }}>{anon ? t('submittingAnon') : t('submitAnonymously')}</p>
                    <p style={{ fontSize: '.72rem', color: 'var(--subtle)', marginTop: 1 }}>{anon ? t('nameNotShared') : t('nameVisibleToImam')}</p>
                  </div>
                </div>
                {/* Toggle */}
                <div style={{ width: 42, height: 24, borderRadius: 99, background: anon ? 'var(--g-800)' : 'var(--border)', position: 'relative', flexShrink: 0, transition: 'background .15s' }}>
                  <div style={{ position: 'absolute', width: 18, height: 18, background: '#fff', borderRadius: '50%', top: 3, left: anon ? 21 : 3, transition: 'left .15s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
                </div>
              </button>
            </div>

            {/* Name */}
            {!anon && (
              <div>
                <label htmlFor="q-name" style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                  {t('nameLabel')} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '.78rem' }}>({t('donationReasonOptional')})</span>
                </label>
                <input id="q-name" type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={t('namePlaceholder')} className="field" autoComplete="name" />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="q-email" style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                {t('emailAddressLabel')} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '.78rem' }}>{t('emailOptionalDesc')}</span>
              </label>
              <input
                id="q-email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); if (emailErr) setEmailErr('') }}
                placeholder={t('emailPlaceholder')}
                className="field"
                autoComplete="email"
                style={{ borderColor: emailErr ? '#ef4444' : email ? 'var(--g-600)' : 'var(--border)' }}
                aria-invalid={!!emailErr}
                aria-describedby={emailErr ? 'q-email-err' : undefined}
              />
              {emailErr && (
                <p id="q-email-err" style={{ fontSize: '.78rem', fontWeight: 600, color: '#ef4444', marginTop: 6 }} role="alert">{emailErr}</p>
              )}
            </div>

            <div style={{ height: 1, background: 'var(--border)' }} />

            {/* Question textarea */}
            <div>
              <label htmlFor="q-text" style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                {t('questionLabel')} <span style={{ color: 'var(--gold)' }} aria-hidden="true">*</span>
              </label>
              <textarea id="q-text" value={question} rows={5} required
                onChange={e => { setQuestion(e.target.value); if (err) setErr('') }}
                placeholder={t('questionPlaceholder')}
                className="field"
                style={{ resize: 'vertical', lineHeight: 1.7, borderColor: err ? '#ef4444' : question.trim() ? 'var(--g-600)' : 'var(--border)' }}
                aria-required="true" aria-invalid={!!err} aria-describedby={err ? 'q-err' : undefined}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                {err
                  ? <p id="q-err" style={{ fontSize: '.78rem', fontWeight: 600, color: '#ef4444' }} role="alert">{err}</p>
                  : <span />
                }
                <p style={{ fontSize: '.72rem', color: question.length > 480 ? '#ef4444' : 'var(--subtle)' }}>{question.length}/500</p>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={busy} className="btn-primary" style={{ fontSize: '.95rem', padding: '15px', width: '100%' }} aria-disabled={busy}>
              {busy ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} aria-hidden="true" />
                  {t('sendingQuestion')}
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <SendIcon />
                  {t('submitQuestion')}
                </span>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--subtle)', lineHeight: 1.7 }}>
              {t('reviewedByImam')}
            </p>
          </form>
        </div>

        {/* Contact alternative */}
        <div style={{ marginTop: 20, borderRadius: 18, padding: '20px 24px', background: 'var(--g-50)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--g-900)', marginBottom: 2 }}>{t('preferInPerson')}</p>
            <p style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{t('imamAvailable')}</p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.8rem', fontWeight: 700, color: 'var(--g-600)', whiteSpace: 'nowrap' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            2824 Lyndale Ave N
          </span>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
