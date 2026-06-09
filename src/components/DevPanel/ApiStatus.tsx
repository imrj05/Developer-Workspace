import { useState, useEffect } from 'react'
import { Server, ChevronDown, ChevronRight, Trash2 } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import type { ApiStatus } from '../../lib/types'

const DEFAULT_APIS: ApiStatus[] = [
  { id: 'github', name: 'GitHub', url: 'https://www.githubstatus.com/api/v2/status.json', status: 'unknown' },
  { id: 'cloudflare', name: 'Cloudflare', url: 'https://www.cloudflarestatus.com/api/v2/status.json', status: 'unknown' },
  { id: 'npm', name: 'NPM', url: 'https://status.npmjs.org/api/v2/status.json', status: 'unknown' },
  { id: 'vercel', name: 'Vercel', url: 'https://www.vercel-status.com/api/v2/status.json', status: 'unknown' },
  { id: 'azure', name: 'Azure', url: 'https://status.dev.azure.com/_apis/status/health', status: 'unknown' },
  { id: 'netlify', name: 'Netlify', url: 'https://www.netlifystatus.com/api/v2/status.json', status: 'unknown' },
  { id: 'digitalocean', name: 'Digital Ocean', url: 'https://status.digitalocean.com/api/v2/status.json', status: 'unknown' },
  { id: 'heroku', name: 'Heroku', url: 'https://status.heroku.com/api/v4/current-status', status: 'unknown' },
  { id: 'circleci', name: 'CircleCI', url: 'https://status.circleci.com/api/v2/status.json', status: 'unknown' }
]

const STATUS_COLORS = {
  up: 'bg-[var(--accent)]',
  degraded: 'bg-[var(--warning)]',
  down: 'bg-[var(--error)]',
  unknown: 'bg-[var(--muted)]'
}

export function ApiStatus() {
  const { settings, updateSettings } = useSettingsStore()
  const { apiList, addApi, deleteApi, updateApiStatus, loadAll } = useBookmarksStore()

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (!settings.showApiStatus) return

    if (apiList.length === 0) {
      DEFAULT_APIS.forEach(api => addApi(api))
      return
    }

    const checkStatus = async (api: ApiStatus) => {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(api.url, { signal: controller.signal })
        clearTimeout(timeout)

        if (response.ok) {
          const data = await response.json()
          const status = data.status?.indicator || data.status?.status || 'up'
          updateApiStatus(api.id, status === 'operational' ? 'up' : status === 'degraded_performance' ? 'degraded' : 'down')
        } else {
          updateApiStatus(api.id, 'down')
        }
      } catch {
        updateApiStatus(api.id, 'unknown')
      }
    }

    apiList.forEach(checkStatus)
    const interval = setInterval(() => apiList.forEach(checkStatus), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [settings.showApiStatus, apiList.length, addApi, updateApiStatus])

  if (!settings.showApiStatus) return null

  return (
    <section className="card-subtle space-y-3 p-3">
      <button
        type="button"
        onClick={() => updateSettings({ apiStatusCollapsed: !settings.apiStatusCollapsed })}
        aria-expanded={!settings.apiStatusCollapsed}
        className="flex w-full items-center justify-between gap-3 text-left text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <div className="flex items-center gap-2">
          <Server aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-sm font-medium">API Status</span>
        </div>
        {settings.apiStatusCollapsed ? <ChevronRight aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
      </button>

      {!settings.apiStatusCollapsed && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {apiList.map(api => (
            <div key={api.id} className="group flex min-w-0 items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/55 p-2.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[api.status]}`} />
                <span className="truncate text-xs">{api.name}</span>
              </div>
              <button
                onClick={() => deleteApi(api.id)}
                aria-label={`Delete ${api.name} API status`}
                className="icon-button h-7 w-7 text-[var(--error)] opacity-0 transition-opacity group-hover:opacity-100 hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
              >
                <Trash2 aria-hidden="true" className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
