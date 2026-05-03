import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'

const TIMEZONES = [
  { value: 'local', label: 'Local' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'EST' },
  { value: 'America/Chicago', label: 'CST' },
  { value: 'America/Denver', label: 'MST' },
  { value: 'America/Los_Angeles', label: 'PST' },
  { value: 'Asia/Kolkata', label: 'IST' },
  { value: 'Europe/London', label: 'GMT' },
  { value: 'Europe/Paris', label: 'CET' },
  { value: 'Asia/Tokyo', label: 'JST' }
]

export function Clock() {
  const { settings } = useSettingsStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const getTimeOptions = () => ({
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: settings.showSeconds ? '2-digit' as const : undefined,
    hour12: settings.clockFormat === '12',
    timeZone: settings.timeZone === 'local' ? undefined : settings.timeZone
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: settings.timeZone === 'local' ? undefined : settings.timeZone
    })
  }

  const formatTimezone = () => {
    if (settings.timeZone === 'local') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    return TIMEZONES.find(tz => tz.value === settings.timeZone)?.label || 'Local'
  }

  const timeString = time.toLocaleTimeString('en-US', getTimeOptions())
  const parts = timeString.split(/:| /)
  const hours = parts[0]
  const minutes = parts[1]
  const seconds = parts[2]
  const ampm = parts[3]

  return (
    <section className="w-full max-w-4xl px-2 text-center sm:px-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 rounded-[2rem] border border-[var(--border)]/80 bg-[var(--surface-overlay)]/75 px-5 py-7 shadow-[var(--card-shadow-soft)] backdrop-blur-xl sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <div className="section-heading">Focus Time</div>
        <div className="flex min-h-[5.5rem] w-full items-end justify-center text-[clamp(3.8rem,10vw,7rem)] font-extralight leading-none tracking-[-0.06em] sm:min-h-[6.25rem] lg:min-h-[7rem]">
          <div className="flex items-end justify-center gap-1.5 tabular-nums">
        <motion.span
          key={hours}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="tabular-nums"
        >
          {hours}
        </motion.span>

        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-1 text-[var(--text-label)]"
        >
          :
        </motion.span>

        <motion.span
          key={minutes}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="tabular-nums"
        >
          {minutes}
        </motion.span>

        {settings.showSeconds && (
          <>
            <motion.span
              animate={{ opacity: [0.7, 0.3, 0.7] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mx-1 text-[var(--text-label)]"
            >
              :
            </motion.span>
            <motion.span
              key={seconds}
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.8, 0, 0.1, 1] }}
              className="relative -top-[0.14em] tabular-nums text-[0.36em] text-[var(--text-secondary)]"
            >
              {seconds}
            </motion.span>
          </>
        )}

        {settings.clockFormat === '12' && ampm && (
          <span
            className="ml-2 text-[0.22em] font-medium uppercase tracking-[0.24em] text-[var(--text-label)]"
          >
            {ampm}
          </span>
        )}
          </div>
      </div>

        <div className="flex w-full flex-col items-center justify-center gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-3">
          <div className="inline-flex min-h-[2.4rem] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/55 px-4 py-2 text-center text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[var(--text-secondary)]">
            {formatDate(time)}
          </div>
          <div className="inline-flex min-h-[2.4rem] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/55 px-4 py-2 text-center text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--text-label)]">
            {formatTimezone()}
          </div>
        </div>
      </div>
    </section>
  )
}
