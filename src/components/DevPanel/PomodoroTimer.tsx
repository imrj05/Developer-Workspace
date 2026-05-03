import { useState, useEffect, useRef } from 'react'
import { Timer, ChevronDown, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { showNotification } from '../../lib/chrome'

const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export function PomodoroTimer() {
  const { settings, updateSettings } = useSettingsStore()
  const [mode, setMode] = useState<'work' | 'break'>('work')
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const originalTitle = useRef(document.title)

  useEffect(() => {
    if (!settings.showPomodoroTimer) return

    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            const message = mode === 'work' ? 'Time for a break!' : 'Break over! Back to work!'
            showNotification('Pomodoro Timer', message)
            if (mode === 'work') {
              setMode('break')
              return BREAK_TIME
            } else {
              setMode('work')
              return WORK_TIME
            }
          }
          document.title = `${Math.floor(prev / 60)}:${String(prev % 60).padStart(2, '0')} - ${mode === 'work' ? 'Work' : 'Break'}`
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft, mode, settings.showPomodoroTimer])

  useEffect(() => {
    if (!isRunning) {
      document.title = originalTitle.current
    }
  }, [isRunning])

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME)
    document.title = originalTitle.current
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (!settings.showPomodoroTimer) return null

  return (
    <section className="card-subtle space-y-3 p-3">
      <button
        type="button"
        onClick={() => updateSettings({ pomodoroTimerCollapsed: !settings.pomodoroTimerCollapsed })}
        aria-expanded={!settings.pomodoroTimerCollapsed}
        className="flex w-full items-center justify-between gap-3 text-left text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <div className="flex items-center gap-2">
          <Timer aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-sm font-medium">Pomodoro</span>
        </div>
        {settings.pomodoroTimerCollapsed ? <ChevronRight aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
      </button>

      {!settings.pomodoroTimerCollapsed && (
        <div className="flex flex-col items-center text-center">
          <div className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-label)]">{mode === 'work' ? 'Work Session' : 'Break Session'}</div>
          <div className="mb-4 w-full font-mono text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] tabular-nums">{formatTime(timeLeft)}</div>
          <div className="mb-4 flex w-full max-w-[10rem] items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              aria-label={isRunning ? 'Pause timer' : 'Start timer'}
              className="btn-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-0"
            >
              {isRunning ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
            </button>
            <button
              onClick={handleReset}
              aria-label="Reset timer"
              className="icon-button flex h-11 w-11 shrink-0 items-center justify-center"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="grid w-full max-w-[12rem] grid-cols-2 gap-2">
            <button
              onClick={() => { setMode('work'); setTimeLeft(WORK_TIME); setIsRunning(false); }}
              data-active={mode === 'work'}
              className="chip-button w-full"
            >
              Work
            </button>
            <button
              onClick={() => { setMode('break'); setTimeLeft(BREAK_TIME); setIsRunning(false); }}
              data-active={mode === 'break'}
              className="chip-button w-full"
            >
              Break
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
