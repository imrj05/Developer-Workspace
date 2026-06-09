import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { formatTimezoneLabel, getGreeting } from '../../lib/greeting'

const TIMEZONE_LABELS: Record<string, string> = {
  local: 'Local',
  UTC: 'UTC',
  'America/New_York': 'New York',
  'America/Chicago': 'Chicago',
  'America/Denver': 'Denver',
  'America/Los_Angeles': 'Los Angeles',
  'Asia/Kolkata': 'Kolkata',
  'Europe/London': 'London',
  'Europe/Paris': 'Paris',
  'Asia/Tokyo': 'Tokyo'
}

const TICK_TRANSITION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
const COLON_TRANSITION = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const }

interface ClockProps {
  focusMode?: boolean
}

export function Clock({ focusMode = false }: ClockProps) {
  const { settings } = useSettingsStore()
  const [time, setTime] = useState(new Date())
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const timeZone = settings.timeZone === 'local' ? undefined : settings.timeZone

  const getTimeOptions = () => ({
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: settings.showSeconds ? '2-digit' as const : undefined,
    hour12: settings.clockFormat === '12',
    timeZone
  })

  const greeting = useMemo(() => {
    const hour = Number(time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, timeZone }))
    return getGreeting(hour)
  }, [time, timeZone])

  const dateLabel = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone
  })

  const timezoneLabel = settings.timeZone === 'local'
    ? formatTimezoneLabel('local')
    : TIMEZONE_LABELS[settings.timeZone] ?? formatTimezoneLabel(settings.timeZone)

  const timeString = time.toLocaleTimeString('en-US', getTimeOptions())
  const parts = timeString.split(/:| /)
  const hours = parts[0]
  const minutes = parts[1]
  const seconds = parts[2]
  const ampm = parts[3]

  const digitTransition = prefersReducedMotion
    ? { duration: 0 }
    : TICK_TRANSITION

  const colonTransition = prefersReducedMotion
    ? { duration: 0 }
    : COLON_TRANSITION

  const clockSizeClass = focusMode
    ? 'min-h-[6.5rem] text-[clamp(4.5rem,14vw,8.5rem)] sm:min-h-[7.5rem] lg:min-h-[8.5rem]'
    : 'min-h-[4.75rem] text-[clamp(3.25rem,9vw,5.75rem)] sm:min-h-[5.5rem] lg:min-h-[6.25rem]'

  const secondsSizeClass = focusMode ? 'text-[0.5em]' : 'text-[0.46em]'
  const suffixSizeClass = focusMode ? 'text-[0.24em]' : 'text-[0.22em]'

  return (
    <div className="relative flex w-full flex-col items-center text-center">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)]/10 blur-3xl ${focusMode ? 'top-6 h-40 w-72 sm:h-48 sm:w-96' : 'top-4 h-28 w-56 sm:h-36 sm:w-72'}`}
      />

      <p className={`relative z-[1] font-display font-medium tracking-tight text-[var(--text-secondary)] ${focusMode ? 'mb-4 text-base sm:text-lg' : 'mb-3 text-sm sm:text-[0.95rem]'}`}>
        {greeting}
      </p>

      <div
        className={`relative z-[1] flex w-full items-center justify-center px-2 font-display font-light leading-none tracking-[-0.05em] ${clockSizeClass} ${settings.showSeconds ? 'pb-1' : ''}`}
      >
        <div className="flex items-center justify-center tabular-nums">
          <motion.span
            key={hours}
            initial={prefersReducedMotion ? false : { y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={digitTransition}
            className="leading-none"
          >
            {hours}
          </motion.span>

          <motion.span
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0.45, 1] }}
            transition={colonTransition}
            className="px-1 leading-none text-[var(--text-label)]"
            aria-hidden="true"
          >
            :
          </motion.span>

          <motion.span
            key={minutes}
            initial={prefersReducedMotion ? false : { y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={digitTransition}
            className="leading-none"
          >
            {minutes}
          </motion.span>

          {settings.showSeconds && (
            <>
              <motion.span
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.75, 0.4, 0.75] }}
                transition={{ ...colonTransition, duration: 1.8 }}
                className="px-1 leading-none text-[var(--text-label)]"
                aria-hidden="true"
              >
                :
              </motion.span>
              <motion.span
                key={seconds}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={digitTransition}
                className={`inline-block min-w-[2.25ch] font-light leading-none tracking-tight text-[var(--text-secondary)] ${secondsSizeClass}`}
              >
                {seconds}
              </motion.span>
            </>
          )}

          {settings.clockFormat === '12' && ampm && (
            <span className={`ml-2 font-medium uppercase leading-none tracking-[0.18em] text-[var(--text-label)] ${suffixSizeClass}`}>
              {ampm}
            </span>
          )}
        </div>
      </div>

      <p className={`relative z-[1] mt-4 max-w-xl text-[var(--text-label)] ${focusMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
        <span className="text-[var(--text-secondary)]">{dateLabel}</span>
        <span aria-hidden="true" className="mx-2 text-[var(--border-strong)]">·</span>
        <span>{timezoneLabel}</span>
      </p>
    </div>
  )
}
