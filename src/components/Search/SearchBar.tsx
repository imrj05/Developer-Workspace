import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { search } from '../../lib/chrome'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'

function getHostnameLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { bookmarks } = useBookmarksStore()
  const { pinnedApps } = useWorkspaceStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingTarget = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable

      if (event.key === '/' && !isTypingTarget) {
        event.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }

      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        if (query) {
          setQuery('')
        } else {
          inputRef.current?.blur()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      await search(query.trim())
      setQuery('')
      setSuggestionsOpen(false)
    }
  }

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []

    const bookmarkSuggestions = bookmarks.map((bookmark) => ({
      id: `bookmark-${bookmark.id}`,
      label: bookmark.title,
      sublabel: getHostnameLabel(bookmark.url),
      value: bookmark.title
    }))

    const pinnedSuggestions = pinnedApps.map((app) => ({
      id: `pinned-${app.id}`,
      label: app.title,
      sublabel: app.description,
      value: app.title
    }))

    return [...pinnedSuggestions, ...bookmarkSuggestions]
      .filter((item) => `${item.label} ${item.sublabel}`.toLowerCase().includes(normalized))
      .slice(0, 5)
  }, [bookmarks, pinnedApps, query])

  return (
    <div className="mt-6 w-full max-w-2xl px-2 sm:px-0">
      <form onSubmit={handleSubmit} className="card-glass relative mx-auto flex max-w-2xl items-center gap-2 rounded-[2rem] p-2 sm:p-3">
        <label htmlFor="workspace-search" className="sr-only">Search the web</label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
        <input
          ref={inputRef}
          id="workspace-search"
          name="search"
          autoComplete="off"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSuggestionsOpen(true)
          }}
          onFocus={() => setSuggestionsOpen(true)}
          placeholder="Search the web…"
          className="input-field h-14 w-full min-w-0 border-transparent bg-transparent pl-12 pr-3 text-left text-base shadow-none focus:border-[var(--accent)]"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
              setSuggestionsOpen(false)
            }}
            className="icon-button h-10 w-10 shrink-0"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : (
          <div className="hidden shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-3 py-2 text-xs font-medium text-[var(--text-label)] sm:block">
            Press /
          </div>
        )}
        <button
          type="submit"
          aria-label="Submit search"
          disabled={!query.trim()}
          className="btn-primary h-11 shrink-0 px-4 sm:px-5"
        >
          <Search aria-hidden="true" className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>

        {suggestionsOpen && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 mx-2 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-overlay)]/95 p-2 shadow-[var(--card-shadow)] backdrop-blur-xl sm:mx-3">
            <div className="space-y-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    setQuery(suggestion.value)
                    setSuggestionsOpen(false)
                    inputRef.current?.focus()
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--accent)]/8"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--text-primary)]">{suggestion.label}</div>
                    <div className="truncate text-xs text-[var(--text-secondary)]">{suggestion.sublabel}</div>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-label)]">Use</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
