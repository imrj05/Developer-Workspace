import { useState } from 'react'
import { Book, ChevronDown, ChevronRight, Search } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'

const DOCS_LINKS = [
  { name: 'MDN', url: 'https://developer.mozilla.org', icon: 'M' },
  { name: 'DevDocs', url: 'https://devdocs.io', icon: 'D' },
  { name: 'Can I Use', url: 'https://caniuse.com', icon: 'C' },
  { name: 'W3Schools', url: 'https://www.w3schools.com', icon: 'W' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'S' },
  { name: 'Web.dev', url: 'https://web.dev', icon: 'W' }
]

export function QuickDocs() {
  const { settings, updateSettings } = useSettingsStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocs = searchQuery
    ? DOCS_LINKS.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : DOCS_LINKS

  return (
    <section className="card-subtle space-y-3 p-3">
      <button
        type="button"
        onClick={() => updateSettings({ quickDocsCollapsed: !settings.quickDocsCollapsed })}
        aria-expanded={!settings.quickDocsCollapsed}
        className="flex w-full items-center justify-between gap-3 text-left text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
      >
        <div className="flex items-center gap-2">
          <Book aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-sm font-medium">Quick Docs</span>
        </div>
        {settings.quickDocsCollapsed ? <ChevronRight aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
      </button>

      {!settings.quickDocsCollapsed && (
        <div className="space-y-2">
          <div className="relative">
            <label htmlFor="docs-search" className="sr-only">Search documentation links</label>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
            <input
              id="docs-search"
              name="docs-search"
              autoComplete="off"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs…"
              className="input-field py-2.5 pl-8 pr-3 text-xs"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filteredDocs.map(doc => (
              <a
                key={doc.name}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip-button px-3"
              >
                {doc.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
