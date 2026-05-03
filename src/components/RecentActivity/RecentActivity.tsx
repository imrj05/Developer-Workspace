import { useEffect, useState } from 'react'
import { Clock3, ExternalLink } from 'lucide-react'
import { getRecentHistory } from '../../lib/chrome'

interface RecentHistoryItem {
  url?: string
  title?: string
}

function getHostnameLabel(url?: string) {
  if (!url) return 'Unknown'
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function RecentActivity() {
  const [items, setItems] = useState<RecentHistoryItem[]>([])

  useEffect(() => {
    void getRecentHistory(6).then(setItems)
  }, [])

  if (items.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="card-glass p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="section-heading mb-2">Recent Activity</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Jump back in</h3>
          </div>
          <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1.5 text-xs text-[var(--text-label)] sm:inline-flex">
            Recently visited
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <a
              key={`${item.url}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-subtle group flex min-w-0 items-start gap-3 px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/25"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 text-[var(--accent)] shadow-sm">
                <Clock3 aria-hidden="true" className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.title || getHostnameLabel(item.url)}</div>
                <div className="mt-1 truncate text-xs text-[var(--text-secondary)]">{getHostnameLabel(item.url)}</div>
              </div>
              <ExternalLink aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--text-label)] transition-colors group-hover:text-[var(--text-primary)]" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
