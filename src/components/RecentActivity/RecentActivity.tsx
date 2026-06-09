import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { getRecentHistory } from '../../lib/chrome'
import { SectionPanel } from '../ui/SectionPanel'
import { LinkTile } from '../ui/LinkTile'

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
    void getRecentHistory(8).then(setItems)
    const refresh = () => {
      if (document.visibilityState === 'visible') void getRecentHistory(8).then(setItems)
    }
    document.addEventListener('visibilitychange', refresh)
    return () => document.removeEventListener('visibilitychange', refresh)
  }, [])

  if (items.length === 0) return null

  return (
    <SectionPanel title="Recent" badge={`${items.length}`} scroll>
      <div className="tile-grid">
        {items.map((item, index) => (
          <LinkTile
            key={`${item.url}-${index}`}
            title={item.title || getHostnameLabel(item.url)}
            url={item.url || '#'}
            subtitle={getHostnameLabel(item.url)}
            icon={<Clock3 aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />}
          />
        ))}
      </div>
    </SectionPanel>
  )
}
