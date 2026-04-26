'use client'

import { useState, useEffect } from 'react'

export interface PrayerTime {
  key: string
  label: string
  adhan: string      // "6:14 AM"
  iqamah: string | null
  mins: number       // minutes from midnight for active detection
}

export interface PrayerData {
  prayers: PrayerTime[]
  hijriDate: string
  gregorianDate: string
  loading: boolean
  error: boolean
}

// Iqamah offsets in minutes after adhan (mosque-set)
const IQAMAH_OFFSETS: Record<string, number | null> = {
  fajr: 20,
  sunrise: null,
  dhuhr: 15,
  asr: 15,
  maghrib: 10,
  isha: 15,
}

function to12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function addMins(time24: string, mins: number): string {
  const [h, m] = time24.split(':').map(Number)
  const total = h * 60 + m + mins
  return `${Math.floor(total / 60) % 24}:${String(total % 60).padStart(2, '0')}`
}

function toMins(time24: string): number {
  const [h, m] = time24.split(':').map(Number)
  return h * 60 + m
}

export function usePrayerTimes(): PrayerData {
  const [data, setData] = useState<PrayerData>({
    prayers: [],
    hijriDate: '',
    gregorianDate: '',
    loading: true,
    error: false,
  })

  useEffect(() => {
    async function fetchTimes() {
      try {
        const res = await fetch(
          'https://api.aladhan.com/v1/timingsByCity?city=Minneapolis&country=US&method=2&school=0',
          { next: { revalidate: 3600 } }
        )
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        const t = json.data.timings
        const hijri = json.data.date.hijri

        const raw: Array<{ key: string; label: string; adhan24: string }> = [
          { key: 'fajr',    label: 'Fajr',    adhan24: t.Fajr },
          { key: 'sunrise', label: 'Sunrise', adhan24: t.Sunrise },
          { key: 'dhuhr',   label: 'Dhuhr',   adhan24: t.Dhuhr },
          { key: 'asr',     label: 'Asr',     adhan24: t.Asr },
          { key: 'maghrib', label: 'Maghrib', adhan24: t.Maghrib },
          { key: 'isha',    label: 'Isha',    adhan24: t.Isha },
        ]

        const prayers: PrayerTime[] = raw.map(({ key, label, adhan24 }) => {
          const offset = IQAMAH_OFFSETS[key]
          const iqamah24 = offset != null ? addMins(adhan24, offset) : null
          return {
            key,
            label,
            adhan: to12h(adhan24),
            iqamah: iqamah24 ? to12h(iqamah24) : null,
            mins: toMins(adhan24),
          }
        })

        const hijriStr = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`
        const gregorian = new Date()
        const gregStr = gregorian.toLocaleDateString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        })

        setData({ prayers, hijriDate: hijriStr, gregorianDate: gregStr, loading: false, error: false })
      } catch {
        // fallback to approximate Minneapolis times if API fails
        const fallback: PrayerTime[] = [
          { key: 'fajr',    label: 'Fajr',    adhan: '5:18 AM', iqamah: '5:38 AM', mins: 318 },
          { key: 'sunrise', label: 'Sunrise', adhan: '6:40 AM', iqamah: null,       mins: 400 },
          { key: 'dhuhr',   label: 'Dhuhr',   adhan: '1:05 PM', iqamah: '1:20 PM', mins: 785 },
          { key: 'asr',     label: 'Asr',     adhan: '4:51 PM', iqamah: '5:06 PM', mins: 1011 },
          { key: 'maghrib', label: 'Maghrib', adhan: '7:39 PM', iqamah: '7:49 PM', mins: 1179 },
          { key: 'isha',    label: 'Isha',    adhan: '9:10 PM', iqamah: '9:25 PM', mins: 1270 },
        ]
        const now = new Date()
        setData({
          prayers: fallback,
          hijriDate: '',
          gregorianDate: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          loading: false,
          error: true,
        })
      }
    }
    fetchTimes()
  }, [])

  return data
}
