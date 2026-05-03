import { useState, useEffect } from 'react'
import { Github, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { fetchGithubEvents, parseGithubEvent } from '../../lib/github'
import type { GithubEvent } from '../../lib/types'

interface ParsedEvent {
  type: string
  description: string
  time: string
  repo: string
}

export function GithubActivity() {
  const { settings, updateSettings } = useSettingsStore()
  const [events, setEvents] = useState<ParsedEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!settings.showGitHubActivity || !settings.githubUsername) return

    const loadEvents = async () => {
      setLoading(true)
      setError(false)
      try {
        const rawEvents = await fetchGithubEvents(settings.githubUsername)
        const parsed = rawEvents.slice(0, 20).map(parseGithubEvent)
        setEvents(parsed)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [settings.showGitHubActivity, settings.githubUsername])

  if (!settings.showGitHubActivity) return null

  return (
    <section className="card-subtle space-y-3 p-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => updateSettings({ githubActivityCollapsed: !settings.githubActivityCollapsed })}
          aria-expanded={!settings.githubActivityCollapsed}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Github aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
            <span className="truncate text-sm font-medium">GitHub Activity</span>
          </div>
          {settings.githubActivityCollapsed ? <ChevronRight aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => {
            setLoading(true)
            fetchGithubEvents(settings.githubUsername)
              .then(raw => raw.slice(0, 20).map(parseGithubEvent))
              .then(setEvents)
              .catch(() => setError(true))
              .finally(() => setLoading(false))
          }}
          aria-label="Refresh GitHub activity"
          className="icon-button h-8 w-8"
        >
          <RefreshCw aria-hidden="true" className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!settings.githubActivityCollapsed && (
        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-[var(--muted)]">Loading…</p>
          ) : error || !settings.githubUsername ? (
            <p className="text-xs text-[var(--muted)]">Unable to load activity</p>
          ) : events.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">No recent activity</p>
          ) : (
            events.slice(0, 10).map((event, i) => (
              <div key={i} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/55 p-3 text-xs">
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate font-medium">{event.description}</span>
                  <span className="shrink-0 text-[var(--muted)]">{event.time}</span>
                </div>
                <div className="text-[var(--muted)] truncate">{event.repo}</div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}
