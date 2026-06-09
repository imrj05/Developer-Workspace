import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { openInNewTab, search } from '../../lib/chrome'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'

function getHostnameLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

interface SearchBarProps {
  embedded?: boolean
}

interface SearchSuggestion {
  id: string
  label: string
  sublabel: string
  url: string
}

export function SearchBar({ embedded = false }: SearchBarProps) {
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

  const suggestions = useMemo<SearchSuggestion[]>(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []

    const bookmarkSuggestions = bookmarks.map((bookmark) => ({
      id: `bookmark-${bookmark.id}`,
      label: bookmark.title,
      sublabel: getHostnameLabel(bookmark.url),
      url: bookmark.url
    }))

    const pinnedSuggestions = pinnedApps.map((app) => ({
      id: `pinned-${app.id}`,
      label: app.title,
      sublabel: app.description || getHostnameLabel(app.url),
      url: app.url
    }))

    return [...pinnedSuggestions, ...bookmarkSuggestions]
      .filter((item) => `${item.label} ${item.sublabel} ${item.url}`.toLowerCase().includes(normalized))
      .slice(0, 5)
  }, [bookmarks, pinnedApps, query])

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    openInNewTab(suggestion.url)
    setQuery('')
    setSuggestionsOpen(false)
    inputRef.current?.blur()
  }

  return (
    <div className={`search-bar w-full ${embedded ? 'max-w-md' : 'mx-auto mt-4 max-w-lg px-2 sm:px-0'}`}>
      <form
        onSubmit={handleSubmit}
        className={`relative flex w-full items-center gap-1 rounded-full px-1 py-1 ${
          embedded
            ? 'border border-[var(--border)]/80 bg-[var(--surface)]/35 shadow-none'
            : 'card-glass !p-1'
        }`}
      >
        <label htmlFor="workspace-search" className="sr-only">Search the web</label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
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
          onBlur={() => {
            window.setTimeout(() => setSuggestionsOpen(false), 150)
          }}
          placeholder="Search…"
          className="input-field h-9 w-full min-w-0 border-transparent bg-transparent py-1 pl-9 pr-2 text-left text-sm shadow-none focus:border-transparent focus:shadow-none"
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
            className="icon-button h-7 w-7 shrink-0"
          >
            <X aria-hidden="true" className="h-3 w-3" />
          </button>
        ) : (
          <span className="hidden shrink-0 pr-2 text-[11px] font-medium text-[var(--text-label)] sm:inline">/</span>
        )}

        {suggestionsOpen && suggestions.length > 0 && (
          <div className="search-suggestions absolute left-0 right-0 top-[calc(100%+0.375rem)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-overlay)]/95 p-1.5 shadow-[var(--card-shadow-soft)] backdrop-blur-xl">
            <div className="space-y-0.5">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    handleSuggestionSelect(suggestion)
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] px-2.5 py-2 text-left transition-colors hover:bg-[var(--accent)]/8"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-[var(--text-primary)]">{suggestion.label}</div>
                    <div className="truncate text-[11px] text-[var(--text-secondary)]">{suggestion.sublabel}</div>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-label)]">Open</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
