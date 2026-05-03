import { useState, useRef, useEffect } from 'react'
import { Terminal, Minus, Square, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import { useSettingsStore } from '../../stores/settingsStore'

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export function TerminalNotes() {
  const { settings, updateSettings } = useSettingsStore()
  const { devNotes, addNote, toggleNote, deleteNote, clearNotes } = useBookmarksStore()
  const [input, setInput] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [devNotes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (input.toLowerCase() === 'clear') {
      await clearNotes()
    } else if (input.toLowerCase() === 'help') {
    } else {
      await addNote({
        id: generateId(),
        content: input,
        completed: false,
        timestamp: Date.now()
      })
    }
    setInput('')
  }

  const parseContent = (content: string) => {
    const parts: React.ReactNode[] = []
    const regex = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
    let lastIndex = 0
    let match
    let key = 0

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index))
      }

      if (match[1]) {
        parts.push(<code key={key++} className="px-1 py-0.5 rounded bg-[var(--accent)]/20 text-[var(--accent)] text-xs">{match[1]}</code>)
      } else if (match[2] && match[3]) {
        parts.push(<a key={key++} href={match[3]} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">{match[2]}</a>)
      }

      lastIndex = regex.lastIndex
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex))
    }

    return parts
  }

  if (!settings.showTerminalNotes || !settings.terminalNotesOpen) return null

  return (
    <div
      className={`w-full max-w-[94vw] xl:w-[680px] xl:max-w-[94vw] card-glass transition-[height,width,transform] duration-300 ${
        collapsed ? 'h-12' : minimized ? 'h-12' : 'h-80'
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-sm font-medium">Terminal Notes</span>
          <span className="rounded-full bg-[var(--surface)]/70 px-2 py-0.5 text-[10px] font-medium text-[var(--text-label)]">
            {devNotes.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {devNotes.length > 0 && !collapsed && !minimized && (
            <button
              aria-label="Clear all notes"
              onClick={() => void clearNotes()}
              className="chip-button h-8 px-3 text-[var(--text-secondary)]"
            >
              Clear
            </button>
          )}
          <button aria-label={collapsed ? 'Expand terminal notes' : 'Collapse terminal notes'} onClick={() => setCollapsed(!collapsed)} className="icon-button h-8 w-8">
            {collapsed ? <ChevronUp aria-hidden="true" className="h-4 w-4" /> : <ChevronDown aria-hidden="true" className="h-4 w-4" />}
          </button>
          <button aria-label={minimized ? 'Restore terminal notes' : 'Minimize terminal notes'} onClick={() => setMinimized(!minimized)} className="icon-button h-8 w-8">
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <button aria-label="Restore terminal notes panel" onClick={() => setMinimized(false)} className="icon-button h-8 w-8">
            <Square aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            onClick={() => updateSettings({ terminalNotesOpen: false })}
            aria-label="Close terminal notes"
            className="icon-button h-8 w-8"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!collapsed && !minimized && (
        <>
          <div
            ref={outputRef}
            className="h-48 space-y-2 overflow-y-auto p-4 font-mono text-sm"
          >
            {devNotes.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-[var(--muted)]">
                <p>Welcome to Terminal Notes!</p>
                <p className="mt-2 text-xs">Commands:</p>
                <ul className="mt-1 text-xs space-y-0.5">
                  <li>- Type anything to add a note</li>
                  <li>- Use `code` for inline code</li>
                  <li>- Use [text](url) for links</li>
                  <li>- Type <span className="text-[var(--accent)]">clear</span> to clear all notes</li>
                </ul>
              </div>
            ) : (
              devNotes.map(note => (
                <div key={note.id} className={`rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]/50 p-3 ${note.completed ? 'opacity-50' : ''}`}>
                  <div className="flex min-w-0 items-start gap-2">
                  <span className="text-[var(--accent)]">$</span>
                  <div className="min-w-0 flex-1">
                    <p className={note.completed ? 'line-through' : ''}>
                      {parseContent(note.content)}
                    </p>
                    <div className="text-xs text-[var(--muted)]">
                      {new Date(note.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1 self-start">
                    <button
                      onClick={() => toggleNote(note.id)}
                      className="chip-button px-3 py-1"
                      data-active={note.completed}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="chip-button border-[var(--error)]/30 bg-[var(--error)]/10 text-[var(--error)] hover:border-[var(--error)]/50 hover:bg-[var(--error)]/15 hover:text-[var(--error)]"
                    >
                      Del
                    </button>
                  </div>
                </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-3">
            <span className="text-[var(--accent)] font-mono">$</span>
            <label htmlFor="terminal-note-input" className="sr-only">Add terminal note</label>
            <input
              id="terminal-note-input"
              name="terminal-note-input"
              autoComplete="off"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a note…"
              className="flex-1 rounded-full border border-transparent bg-transparent px-2 py-1 text-sm font-mono focus-visible:border-[var(--accent)]"
            />
            <button type="submit" disabled={!input.trim()} className="btn-primary h-9 shrink-0 px-3">
              Save
            </button>
          </form>
        </>
      )}
    </div>
  )
}
