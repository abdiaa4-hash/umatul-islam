'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'

/* ─── Config — replace with real values ────────────────────────────────── */
const CONFIG = {
  paypalMe:       'https://www.paypal.com/donate/?business=donate%40umatulislam.org&currency_code=USD',
  stripeLink:     'https://buy.stripe.com/test_eVqcN60GU8cD5EJ521a3u00',
  zelleEmail:     'donate@umatulislam.org',
  zellePhone:     '(612) 555-0190',
  cashAppTag:     '$UmatulIslam',
  mailingAddress: 'Umatul Islam Center\n2824 Lyndale Ave N\nMinneapolis, MN 55411',
}
/* ─────────────────────────────────────────────────────────────────────── */

const AMOUNTS = [25, 50, 100, 250, 500]

type Method = 'stripe' | 'paypal' | 'zelle' | 'cashapp' | 'check'

/* ─── CopyBtn ────────────────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000) }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 7, border: `1px solid ${ok ? '#2d6a4f' : '#d4dbd5'}`, background: ok ? 'rgba(45,106,79,.08)' : '#f5f7f5', color: ok ? '#2d6a4f' : '#6b8f72', cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap' }}
    >
      {ok ? 'Copied' : 'Copy'}
    </button>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid #f0f2f0' }}>
      <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#9bb5a2', textTransform: 'uppercase', letterSpacing: '.08em', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: '.88rem', color: '#0f2418', fontFamily: 'monospace' }}>{value}</span>
        <CopyBtn text={value} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function DonationsPage() {
  const { t } = useLang()
  const [freq, setFreq]     = useState<'one-time' | 'monthly'>('one-time')
  const [sel, setSel]       = useState<number | null>(100)
  const [custom, setCustom] = useState('')
  const [reason, setReason] = useState('')
  const [method, setMethod] = useState<Method | null>(null)

  const amount = custom ? Number(custom) : sel

  const STATS = [
    { n: '2001',      label: t('statEstablished') },
    { n: '12',        label: t('statPrograms')    },
    { n: '501(c)(3)', label: t('statNonprofit')   },
    { n: '100%',      label: t('allToMasjid')     },
  ]

  const METHODS: { id: Method; label: string; sub: string; accentColor: string; accentBg: string; icon: React.ReactNode }[] = [
    {
      id: 'stripe', label: t('methodCardLabel'), sub: t('methodCardSub'), accentColor: '#635bff', accentBg: '#f0efff',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    },
    {
      id: 'paypal', label: 'PayPal', sub: t('methodPaypalSub'), accentColor: '#003087', accentBg: '#eef4ff',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>,
    },
    {
      id: 'zelle', label: 'Zelle', sub: t('methodZelleSub'), accentColor: '#6d1ed4', accentBg: '#f5f0ff',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    },
    {
      id: 'cashapp', label: 'Cash App', sub: t('methodCashSub'), accentColor: '#00b140', accentBg: '#f0fff5',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
      id: 'check', label: t('methodCheckLabel'), sub: t('methodCheckSub'), accentColor: '#c9a84c', accentBg: '#fffbee',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    },
  ]

  const payUrl = (m: Method): string => {
    const amt = amount ?? 0
    if (m === 'stripe')  return CONFIG.stripeLink
    if (m === 'paypal')  return amt > 0 ? `${CONFIG.paypalMe}/${amt}USD` : CONFIG.paypalMe
    return ''
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <style>{`
        .method-btn { transition: border-color .15s, background .15s, box-shadow .15s; }
        .method-btn:hover { border-color: var(--g-400) !important; }
        .amt-btn { transition: background .15s, border-color .15s, box-shadow .15s; }
        .amt-btn:hover { box-shadow: 0 4px 16px rgba(15,36,24,.12); }
      `}</style>

      {/* ══════ HERO ══════ */}
      <section style={{ position: 'relative', height: 480, overflow: 'hidden' }}>
        <Image
          src="https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&q=85&auto=format&fit=crop"
          alt="Masjid" fill sizes="100vw" priority
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,18,10,.35) 0%, rgba(5,18,10,.7) 60%, rgba(5,18,10,.97) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,.06) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #c9a84c, transparent)' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: '0 20px 52px' }}>
          <p style={{ color: 'rgba(201,168,76,.8)', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.25em', textTransform: 'uppercase', marginBottom: 12 }}>{t('sadaqahTitle')}</p>
          <h1 className="font-cinzel" style={{ color: '#fff', fontSize: 'clamp(2.2rem, 6vw, 3.75rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 14, textShadow: '0 2px 30px rgba(0,0,0,.4)' }}>
            {t('donateTitle')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '1rem', maxWidth: 420 }}>
            {t('donateHeroSub')}
          </p>
        </div>
      </section>

      {/* ══════ STATS STRIP ══════ */}
      <div style={{ background: 'var(--g-900)', borderBottom: '1px solid rgba(201,168,76,.15)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, textAlign: 'center' }}>
          {STATS.map(({ n, label }) => (
            <div key={label}>
              <p className="font-cinzel" style={{ color: '#c9a84c', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1, marginBottom: 4 }}>{n}</p>
              <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.7rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════ MAIN LAYOUT ══════ */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Why donate card */}
        <div style={{ background: 'linear-gradient(135deg, #0c1e12, #1a3d2b)', borderRadius: 20, padding: '28px 28px', marginBottom: 20, border: '1px solid rgba(201,168,76,.2)' }}>
          <p className="font-cinzel" style={{ color: '#c9a84c', fontWeight: 700, fontSize: '.75rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 12 }}>{t('whereMoneyGoes')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
            {[[t('donArea1Title'), t('donArea1Desc')], [t('donArea2Title'), t('donArea2Desc')], [t('donArea3Title'), t('donArea3Desc')]].map(([title, desc]) => (
              <div key={String(title)} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ color: '#e8c97a', fontWeight: 700, fontSize: '.85rem' }}>{title}</p>
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.75rem', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sadaqah note */}
        <div style={{ background: '#fffbee', border: '1px solid #f0d97a', borderRadius: 16, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '.85rem', color: '#7a5a00', marginBottom: 3 }}>{t('sadaqahJariyahTitle')}</p>
            <p style={{ fontSize: '.78rem', lineHeight: 1.65, color: '#a07800' }}>{t('sadaqahJariyahDesc')}</p>
          </div>
        </div>

        {/* ══ Donation form card ══ */}
        <div style={{ background: 'var(--surface)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 8px 40px rgba(15,36,24,.1)' }}>

          {/* Card header */}
          <div style={{ background: 'linear-gradient(135deg, #0f2418, #1a3d2b)', padding: '24px 28px', borderBottom: '1px solid rgba(201,168,76,.2)' }}>
            <p className="font-cinzel" style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{t('makeDonation')}</p>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: '.78rem' }}>{t('secureDonation')}</p>
          </div>

          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Frequency toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 5, borderRadius: 14, background: 'var(--g-50)', border: '1px solid var(--border)' }}>
              {(['one-time', 'monthly'] as const).map(f => (
                <button key={f} type="button" onClick={() => setFreq(f)} aria-pressed={freq === f}
                  style={{ padding: '11px 8px', borderRadius: 10, fontSize: '.85rem', fontWeight: 700, cursor: 'pointer', border: 'none', background: freq === f ? 'var(--surface)' : 'transparent', color: freq === f ? 'var(--g-900)' : 'var(--subtle)', boxShadow: freq === f ? '0 2px 8px rgba(0,0,0,.09)' : 'none', transition: 'all .15s' }}
                >
                  {f === 'one-time' ? t('oneTime') : `↻ ${t('monthly')}`}
                  {f === 'monthly' && <span style={{ display: 'block', fontSize: '.68rem', fontWeight: 400, color: freq === 'monthly' ? 'var(--gold)' : 'var(--subtle)', marginTop: 1 }}>{t('ongoingReward')}</span>}
                </button>
              ))}
            </div>

            {/* Amount selection */}
            <div>
              <p style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--subtle)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>{t('selectAmount')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 10 }}>
                {AMOUNTS.map(a => {
                  const active = sel === a && !custom
                  return (
                    <button key={a} type="button" onClick={() => { setSel(a); setCustom('') }} aria-pressed={active}
                      className="amt-btn"
                      style={{ padding: '13px 4px', borderRadius: 12, cursor: 'pointer', background: active ? 'var(--g-900)' : 'var(--surface)', border: active ? '2px solid var(--g-900)' : '1.5px solid var(--border)', boxShadow: active ? '0 4px 16px rgba(15,36,24,.22)' : '0 1px 3px rgba(0,0,0,.04)', transition: 'all .15s' }}
                    >
                      <span className="font-cinzel" style={{ fontWeight: 900, fontSize: '.95rem', color: active ? '#c9a84c' : 'var(--g-800)' }}>${a}</span>
                    </button>
                  )
                })}
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: custom ? 'var(--g-800)' : 'var(--subtle)', fontSize: '1rem' }}>$</span>
                <input type="number" min="1" placeholder={t('customAmount')} value={custom}
                  onChange={e => { setCustom(e.target.value); setSel(null) }}
                  className="field" style={{ paddingLeft: 32, fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Reason / dedication */}
            {amount ? (
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(201,168,76,.25)' }}>
                <div style={{ background: 'linear-gradient(135deg, #0f2418, #1e4d33)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '.78rem', fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('donatingLabel')}</p>
                  <span className="font-cinzel" style={{ fontWeight: 900, fontSize: '1.2rem', color: '#c9a84c' }}>${amount}{freq === 'monthly' ? '/mo' : ''}</span>
                </div>
                <div style={{ padding: '14px 18px', background: 'rgba(15,36,24,.03)' }}>
                  <label htmlFor="don-reason" style={{ display: 'block', fontSize: '.72rem', fontWeight: 700, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>
                    {t('donationReasonLabel')} <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{t('donationReasonOptional')}</span>
                  </label>
                  <input
                    id="don-reason"
                    type="text"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder={t('donationReasonPlaceholder')}
                    className="field"
                    maxLength={120}
                  />
                </div>
              </div>
            ) : (
              <div style={{ borderRadius: 14, padding: '14px', textAlign: 'center', background: 'var(--g-50)', border: '1px dashed var(--border-strong)' }}>
                <p style={{ fontSize: '.85rem', color: 'var(--subtle)' }}>{t('selectAmountPrompt')}</p>
              </div>
            )}

            <div style={{ height: 1, background: 'var(--border)' }} />

            {/* Payment method selection */}
            <div>
              <p style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--subtle)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>{t('howToGive')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {METHODS.map(m => {
                  const active = method === m.id
                  return (
                    <button key={m.id} type="button" onClick={() => setMethod(m.id)} aria-pressed={active}
                      className="method-btn"
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: active ? `2px solid ${m.accentColor}` : '1.5px solid var(--border)', background: active ? m.accentBg : 'var(--surface)', boxShadow: active ? `0 0 0 3px ${m.accentColor}18` : '0 1px 3px rgba(0,0,0,.04)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}
                    >
                      <span style={{ color: active ? m.accentColor : 'var(--subtle)', flexShrink: 0 }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: '.88rem', color: 'var(--g-900)', marginBottom: 1 }}>{m.label}</p>
                        <p style={{ fontSize: '.72rem', color: 'var(--subtle)' }}>{m.sub}</p>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: active ? `5px solid ${m.accentColor}` : '2px solid var(--border-strong)', background: active ? '#fff' : 'transparent', flexShrink: 0, transition: 'all .15s' }} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Method panels ── */}

            {method === 'stripe' && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #635bff' }}>
                <div style={{ background: '#635bff', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <p style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff', flex: 1 }}>{t('payCardSecured')}</p>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div style={{ padding: '18px', background: '#f0efff' }}>
                  {CONFIG.stripeLink.includes('REPLACE') ? (
                    <div style={{ borderRadius: 12, padding: '14px 16px', background: '#fff3cd', border: '1px solid #ffc107', marginBottom: 12 }}>
                      <p style={{ fontWeight: 700, fontSize: '.82rem', color: '#856404', marginBottom: 4 }}>Stripe Not Configured</p>
                      <p style={{ fontSize: '.75rem', color: '#856404', lineHeight: 1.6 }}>
                        To accept card payments, create a Payment Link at{' '}
                        <strong>stripe.com/payment-links</strong> and paste the URL into <code style={{ background: 'rgba(0,0,0,.08)', padding: '1px 5px', borderRadius: 4 }}>CONFIG.stripeLink</code> in the donations page file.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                        {['VISA', 'MASTERCARD', 'AMEX', 'APPLE PAY'].map(c => (
                          <span key={c} style={{ fontSize: '.58rem', fontWeight: 800, padding: '3px 9px', borderRadius: 5, background: '#fff', color: '#635bff', border: '1px solid #d0cefc', letterSpacing: '.05em' }}>{c}</span>
                        ))}
                      </div>
                      <a href={payUrl('stripe')} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#635bff', color: '#fff', fontWeight: 700, fontSize: '.92rem', padding: '14px 20px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 16px rgba(99,91,255,.35)' }}
                      >
                        {t('donateWithCard')}{amount ? ` $${amount}` : ''} →
                      </a>
                      <p style={{ fontSize: '.72rem', textAlign: 'center', marginTop: 10, color: '#9896cc' }}>{t('stripeSSLNote')}</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {method === 'paypal' && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #003087' }}>
                <div style={{ background: '#003087', padding: '12px 18px' }}>
                  <p style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>{t('paypalDonation')}</p>
                </div>
                <div style={{ padding: '18px', background: '#eef4ff' }}>
                  <p style={{ fontSize: '.8rem', lineHeight: 1.7, color: '#334', marginBottom: 14 }}>
                    {t('paypalGuestNote')}
                  </p>
                  <a href={payUrl('paypal')} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#0070ba', color: '#fff', fontWeight: 700, fontSize: '.92rem', padding: '14px 20px', borderRadius: 12, textDecoration: 'none' }}
                  >
                    {t('donateViaPaypal')}{amount ? ` $${amount}` : ''} →
                  </a>
                  <p style={{ fontSize: '.72rem', textAlign: 'center', marginTop: 10, color: '#6a8cc4' }}>{t('paypalSecuredNote')}</p>
                </div>
              </div>
            )}

            {method === 'zelle' && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #6d1ed4' }}>
                <div style={{ background: '#6d1ed4', padding: '12px 18px' }}>
                  <p style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>{t('sendViaZelle')}</p>
                </div>
                <div style={{ padding: '18px', background: '#f5f0ff' }}>
                  <p style={{ fontSize: '.8rem', lineHeight: 1.7, color: '#3a2060', marginBottom: 12 }}>
                    {t('zelleInstructions')}
                  </p>
                  <div style={{ background: '#fff', borderRadius: 12, padding: '4px 14px', border: '1px solid #ddd4f5', marginBottom: 12 }}>
                    <InfoRow label="Email" value={CONFIG.zelleEmail} />
                    <InfoRow label="Phone" value={CONFIG.zellePhone} />
                    <div style={{ padding: '8px 0 4px' }}>
                      <span style={{ fontSize: '.72rem', color: 'var(--subtle)' }}>{t('masjidName')}</span>
                    </div>
                  </div>
                  {amount && (
                    <div style={{ borderRadius: 10, padding: '10px 14px', textAlign: 'center', fontSize: '.8rem', fontWeight: 600, background: 'rgba(109,30,212,.08)', color: '#6d1ed4', border: '1px solid rgba(109,30,212,.15)' }}>
                      {t('sendAmount')} <strong>${amount}{freq === 'monthly' ? '/mo' : ''}</strong> — {t('zelleMemoSuggest')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {method === 'cashapp' && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #00b140' }}>
                <div style={{ background: '#00b140', padding: '12px 18px' }}>
                  <p style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>{t('sendViaCashApp')}</p>
                </div>
                <div style={{ padding: '18px', background: '#f0fff5' }}>
                  <p style={{ fontSize: '.8rem', lineHeight: 1.7, color: '#0a4020', marginBottom: 12 }}>
                    {t('cashInstructions')}
                  </p>
                  <div style={{ background: '#fff', borderRadius: 12, padding: '4px 14px', border: '1px solid #c8f0d4', marginBottom: 12 }}>
                    <InfoRow label="$Cashtag" value={CONFIG.cashAppTag} />
                  </div>
                  {amount && (
                    <div style={{ borderRadius: 10, padding: '10px 14px', textAlign: 'center', fontSize: '.8rem', fontWeight: 600, background: 'rgba(0,177,64,.08)', color: '#007a28', border: '1px solid rgba(0,177,64,.15)' }}>
                      {t('sendAmount')} <strong>${amount}{freq === 'monthly' ? '/mo' : ''}</strong> — {t('cashNoteSuggest')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {method === 'check' && (
              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #c9a84c' }}>
                <div style={{ background: 'linear-gradient(135deg, #0f2418, #1a3d2b)', padding: '12px 18px' }}>
                  <p style={{ fontWeight: 700, fontSize: '.88rem', color: '#fff' }}>{t('checkInPerson')}</p>
                </div>
                <div style={{ padding: '18px', background: '#fffbee' }}>
                  <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #f0e0a0', marginBottom: 12 }}>
                    <p style={{ fontSize: '.68rem', fontWeight: 700, color: '#a07800', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{t('makePayableTo')}</p>
                    <p style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--g-900)', marginBottom: 14 }}>{t('masjidName')}</p>
                    <p style={{ fontSize: '.68rem', fontWeight: 700, color: '#a07800', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{t('mailingAddressLabel')}</p>
                    <p style={{ fontWeight: 500, fontSize: '.88rem', color: 'var(--g-900)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 14 }}>{CONFIG.mailingAddress}</p>
                    <p style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{t('envelopeNote')}</p>
                  </div>
                </div>
              </div>
            )}

            {!method && (
              <div style={{ borderRadius: 14, padding: '14px', textAlign: 'center', background: 'var(--g-50)', border: '1px dashed var(--border-strong)' }}>
                <p style={{ fontSize: '.85rem', color: 'var(--subtle)' }}>{t('selectMethodPrompt')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ background: 'var(--surface)', borderRadius: 18, padding: '20px 24px', border: '1px solid var(--border)', marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
            {[{ label: t('trustSecure'), sub: t('donateSecureSub') }, { label: '501(c)(3)', sub: t('donate501Sub') }, { label: '100%', sub: t('donateAllSub') }].map(b => (
              <div key={b.label}>
                <p style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--g-900)' }}>{b.label}</p>
                <p style={{ fontSize: '.65rem', color: 'var(--subtle)' }}>{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--subtle)', marginTop: 18, lineHeight: 1.7 }}>
          {t('donationMayAllah')}<br />
          <span className="font-amiri" style={{ fontSize: '1.1rem', color: 'var(--gold-700)' }} lang="ar">آمين</span>
        </p>
      </div>
    </div>
  )
}
