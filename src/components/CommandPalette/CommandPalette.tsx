import { useEffect, useMemo, useState } from 'react'
import { Command, ExternalLink, ListTodo, Search as SearchIcon, Settings2 } from 'lucide-react'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { search } from '../../lib/chrome'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenSettings: () => void
}

type PaletteItem = {
  id: string
  label: string
  hint: string
  icon: 'bookmark' | 'task' | 'action'
  run: () => void | Promise<void>
}

export function CommandPalette({ open, onOpenChange, onOpenSettings }: CommandPaletteProps) {
  const { bookmarks } = useBookmarksStore()
  const { pinnedApps, tasks, addTask, toggleTask } = useWorkspaceStore()
  const { settings, updateSettings } = useSettingsStore()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpenChange(!open)
      }

      if (event.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  const items = useMemo<PaletteItem[]>(() => {
    const actionItems: PaletteItem[] = [
      {
        id: 'open-settings',
        label: 'Open Settings',
        hint: 'Jump to dashboard preferences',
        icon: 'action',
        run: () => {
          onOpenChange(false)
          onOpenSettings()
        }
      },
      {
        id: 'toggle-focus',
        label: settings.focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode',
        hint: 'Hide distractions and simplify the layout',
        icon: 'action',
        run: async () => {
          await updateSettings({ focusMode: !settings.focusMode })
          onOpenChange(false)
        }
      }
    ]

    const pinnedItems: PaletteItem[] = pinnedApps.map((app) => ({
      id: `pinned-${app.id}`,
      label: app.title,
      hint: app.description,
      icon: 'bookmark',
      run: () => {
        window.open(app.url, '_blank', 'noopener,noreferrer')
        onOpenChange(false)
      }
    }))

    const bookmarkItems: PaletteItem[] = bookmarks.slice(0, 30).map((bookmark) => ({
      id: `bookmark-${bookmark.id}`,
      label: bookmark.title,
      hint: bookmark.url,
      icon: 'bookmark',
      run: () => {
        window.open(bookmark.url, '_blank', 'noopener,noreferrer')
        onOpenChange(false)
      }
    }))

    const taskItems: PaletteItem[] = tasks.slice(0, 10).map((task) => ({
      id: `task-${task.id}`,
      label: task.title,
      hint: task.completed ? 'Mark as active again' : 'Mark task complete',
      icon: 'task',
      run: async () => {
        await toggleTask(task.id)
        onOpenChange(false)
      }
    }))

    return [...actionItems, ...pinnedItems, ...bookmarkItems, ...taskItems]
  }, [bookmarks, onOpenChange, onOpenSettings, pinnedApps, settings.focusMode, tasks, toggleTask, updateSettings])

  const normalizedQuery = query.trim().toLowerCase()
  const filteredItems = normalizedQuery
    ? items.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(normalizedQuery))
    : items.slice(0, 8)

  const showCreateTask = normalizedQuery.length > 1
  const showWebSearch = normalizedQuery.length > 0

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div className="mx-auto flex min-h-screen max-w-2xl items-start px-4 pt-[10vh]" onClick={(event) => event.stopPropagation()}>
        <div className="card-glass w-full overflow-hidden">
          <div className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center gap-2 text-[var(--text-label)]">
              <Command aria-hidden="true" className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-[0.18em]">Command Palette</span>
            </div>
            <label htmlFor="command-palette" className="sr-only">Search commands</label>
            <div className="relative">
              <SearchIcon aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                id="command-palette"
                autoFocus
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bookmarks, apps, tasks, and actions…"
                className="input-field h-12 pl-10"
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-3 py-3 sm:px-4">
            <div className="space-y-2">
              {showWebSearch && (
                <button
                  type="button"
                  onClick={() => {
                    void search(query.trim())
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/55 px-3 py-3 text-left transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/8"
                >
                  <SearchIcon aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--text-primary)]">Search the web for “{query.trim()}”</div>
                    <div className="text-xs text-[var(--text-secondary)]">Open results in a new tab</div>
                  </div>
                </button>
              )}

              {showCreateTask && (
                <button
                  type="button"
                  onClick={async () => {
                    await addTask(query.trim())
                    onOpenChange(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/55 px-3 py-3 text-left transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/8"
                >
                  <ListTodo aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--text-primary)]">Create task “{query.trim()}”</div>
                    <div className="text-xs text-[var(--text-secondary)]">Add it to Today</div>
                  </div>
                </button>
              )}

              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void item.run()}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/55 px-3 py-3 text-left transition-colors hover:border-[var(--accent)]/35 hover:bg-[var(--accent)]/8"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface)]/80 text-[var(--accent)]">
                    {item.icon === 'bookmark' ? <ExternalLink aria-hidden="true" className="h-4 w-4" /> : item.icon === 'task' ? <ListTodo aria-hidden="true" className="h-4 w-4" /> : <Settings2 aria-hidden="true" className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--text-primary)]">{item.label}</div>
                    <div className="truncate text-xs text-[var(--text-secondary)]">{item.hint}</div>
                  </div>
                </button>
              ))}

              {filteredItems.length === 0 && !showCreateTask && !showWebSearch && (
                <div className="card-subtle flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                  <Command aria-hidden="true" className="h-5 w-5 text-[var(--text-label)]" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">No matching actions.</p>
                  <p className="text-xs text-[var(--text-secondary)]">Try searching by bookmark title, URL, app name, or task.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
