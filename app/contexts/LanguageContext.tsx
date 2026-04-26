'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Lang = 'en' | 'ar'

export const translations = {
  en: {
    /* ── Nav ── */
    masjidName: 'Umatul Islam',
    masjidSub: 'Islamic Center of Minneapolis',
    navHome: 'Prayer Times',
    navEvents: 'Events',
    navAzkars: 'Azkars',
    navDonations: 'Donate',
    navAsk: 'Ask a Question',
    /* ── Home ── */
    heroTitle: 'Umatul Islam',
    heroArabic: 'أُمَّةُ الإسْلَام',
    heroSub: 'Islamic Center of Minneapolis',
    todayPrayers: 'Today\'s Prayer Times',
    hijriDate: '9 Shawwal 1447 AH',
    adhan: 'Adhan',
    iqamah: 'Iqamah',
    currentPrayer: 'Current prayer',
    completed: 'Completed',
    upNext: 'Up next',
    /* ── Prayer Names ── */
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    jummah: "Jumu'ah",
    jummahTime: "Khutbah: 1:00 PM · Prayer: 1:30 PM",
    /* ── Events ── */
    eventsTitle: 'Upcoming Events',
    eventsSub: 'Stay connected with your community',
    /* ── Azkars ── */
    azkarsTitle: 'Daily Azkars',
    azkarsSub: 'Remembrance of Allah',
    tabMorning: 'Morning',
    tabEvening: 'Evening',
    tabAfterPrayer: 'After Prayer',
    repetitions: 'times',
    /* ── Donations ── */
    donateTitle: 'Support Your Masjid',
    donateSub: 'Your generosity keeps this community thriving',
    oneTime: 'One-time',
    monthly: 'Monthly',
    customAmount: 'Custom amount',
    yourName: 'Your Name (optional)',
    yourEmail: 'Email (optional)',
    submitDonation: 'Donate Now',
    sadaqahTitle: 'Sadaqah Jariyah',
    sadaqahDesc: 'Every donation to the masjid is an ongoing charity. When you give, Allah rewards you continuously — even after you pass.',
    donationNote: '* This is a demonstration form. Contact the masjid to donate.',
    /* ── Ask ── */
    askTitle: 'Ask Leadership',
    askSub: 'Submit your question to our Imam or Board',
    questionLabel: 'Your Question',
    questionPlaceholder: 'Type your question here...',
    categoryLabel: 'Category',
    catFiqh: 'Islamic Ruling (Fiqh)',
    catCommunity: 'Community',
    catEvents: 'Events',
    catGeneral: 'General',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    anonymousLabel: 'Submit anonymously',
    submitQuestion: 'Submit Question',
    confirmTitle: 'JazakAllah Khair!',
    confirmDesc: 'Your question has been received. Our Imam will respond during the next Jumu\'ah announcement or via email.',
    submitAnother: 'Submit Another Question',
    /* ── General ── */
    loading: 'Loading...',
    footer: '© 2025 Umatul Islam · Minneapolis, MN · All rights reserved',
  },
  ar: {
    masjidName: 'أمة الإسلام',
    masjidSub: 'المركز الإسلامي في مينيابوليس',
    navHome: 'أوقات الصلاة',
    navEvents: 'الفعاليات',
    navAzkars: 'الأذكار',
    navDonations: 'التبرع',
    navAsk: 'اسأل الإمام',
    heroTitle: 'أمة الإسلام',
    heroArabic: 'أُمَّةُ الإسْلَام',
    heroSub: 'المركز الإسلامي في مينيابوليس',
    todayPrayers: 'مواقيت الصلاة اليوم',
    hijriDate: '٩ شوال ١٤٤٧ هـ',
    adhan: 'الأذان',
    iqamah: 'الإقامة',
    currentPrayer: 'الصلاة الحالية',
    completed: 'مكتملة',
    upNext: 'التالية',
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    jummah: 'صلاة الجمعة',
    jummahTime: 'الخطبة: ١:٠٠ م · الصلاة: ١:٣٠ م',
    eventsTitle: 'الفعاليات القادمة',
    eventsSub: 'ابقَ على تواصل مع مجتمعك',
    azkarsTitle: 'الأذكار اليومية',
    azkarsSub: 'ذكر الله تعالى',
    tabMorning: 'أذكار الصباح',
    tabEvening: 'أذكار المساء',
    tabAfterPrayer: 'أذكار بعد الصلاة',
    repetitions: 'مرة',
    donateTitle: 'ادعم مسجدك',
    donateSub: 'كرمك يُبقي هذا المجتمع مزدهراً',
    oneTime: 'مرة واحدة',
    monthly: 'شهريًا',
    customAmount: 'مبلغ آخر',
    yourName: 'اسمك (اختياري)',
    yourEmail: 'البريد الإلكتروني (اختياري)',
    submitDonation: 'تبرّع الآن',
    sadaqahTitle: 'الصدقة الجارية',
    sadaqahDesc: 'كل تبرع للمسجد هو صدقة جارية. حين تعطي، يثيبك الله باستمرار — حتى بعد وفاتك.',
    donationNote: '* هذا نموذج تجريبي. تواصل مع المسجد للتبرع.',
    askTitle: 'اسأل القيادة',
    askSub: 'أرسل سؤالك إلى الإمام أو مجلس الإدارة',
    questionLabel: 'سؤالك',
    questionPlaceholder: 'اكتب سؤالك هنا...',
    categoryLabel: 'التصنيف',
    catFiqh: 'حكم شرعي (فقه)',
    catCommunity: 'المجتمع',
    catEvents: 'الفعاليات',
    catGeneral: 'عام',
    nameLabel: 'اسمك',
    namePlaceholder: 'أدخل اسمك',
    anonymousLabel: 'إرسال بشكل مجهول',
    submitQuestion: 'إرسال السؤال',
    confirmTitle: 'جزاك الله خيراً!',
    confirmDesc: 'تم استلام سؤالك. سيجيب إمامنا في خطبة الجمعة القادمة أو عبر البريد الإلكتروني.',
    submitAnother: 'إرسال سؤال آخر',
    loading: 'جار التحميل...',
    footer: '© ٢٠٢٥ أمة الإسلام · مينيابوليس، مينيسوتا · جميع الحقوق محفوظة',
  },
} satisfies Record<Lang, Record<string, string>>

export type TKey = keyof typeof translations.en

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TKey) => string
  isRTL: boolean
}

const LangCtx = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => translations.en[k],
  isRTL: false,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const stored = localStorage.getItem('ui-lang') as Lang | null
    if (stored && ['en', 'ar'].includes(stored)) setLangState(stored)
    else if (stored) { setLangState('en'); localStorage.setItem('ui-lang', 'en') }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('ui-lang', l)
  }

  const t = (key: TKey): string => translations[lang][key] ?? translations.en[key]
  const isRTL = lang === 'ar'

  return (
    <LangCtx.Provider value={{ lang, setLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} lang={lang}>
        {children}
      </div>
    </LangCtx.Provider>
  )
}

export const useLang = () => useContext(LangCtx)
