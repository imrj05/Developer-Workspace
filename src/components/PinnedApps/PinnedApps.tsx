import { useState } from 'react'
import { ExternalLink, GripVertical, Pencil, Pin, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { Modal } from '../ui/Modal'
import type { PinnedApp } from '../../lib/types'

export function PinnedApps() {
  const { pinnedApps, addPinnedApp, updatePinnedApp, deletePinnedApp, reorderPinnedApps, resetPinnedApps } = useWorkspaceStore()
  const [open, setOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<PinnedApp | null>(null)
  const [form, setForm] = useState({ title: '', url: '', description: '', icon: '' })
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  const resetForm = () => {
    setEditingApp(null)
    setForm({ title: '', url: '', description: '', icon: '' })
  }

  if (pinnedApps.length === 0) return null

  return (
    <>
    <section className="mx-auto w-full max-w-6xl">
      <div className="card-glass p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="section-heading mb-2">Pinned Apps</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Daily essentials</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1.5 text-xs text-[var(--text-label)] sm:inline-flex">
              Drag or use arrow keys
            </div>
            <button
              type="button"
              onClick={() => void resetPinnedApps()}
              className="btn-secondary h-10 px-4"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-secondary h-10 px-4"
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add App
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pinnedApps.map((app) => (
            <div
              key={app.id}
              draggable
              onDragStart={() => setDraggedId(app.id)}
              onDragOver={(event) => {
                event.preventDefault()
                if (draggedId && draggedId !== app.id) {
                  setDropTargetId(app.id)
                }
              }}
              onDrop={() => {
                if (draggedId) {
                  void reorderPinnedApps(draggedId, app.id)
                }
                setDraggedId(null)
                setDropTargetId(null)
              }}
              onDragLeave={() => {
                if (dropTargetId === app.id) {
                  setDropTargetId(null)
                }
              }}
              onDragEnd={() => {
                setDraggedId(null)
                setDropTargetId(null)
              }}
              className={`card-subtle group flex min-w-0 items-start gap-3 px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/25 ${draggedId === app.id ? 'scale-[0.985] opacity-70' : ''} ${dropTargetId === app.id ? 'border-[var(--accent)] shadow-[var(--glow)]' : ''}`}
            >
              <button
                type="button"
                className="icon-button h-10 w-10 shrink-0 cursor-grab active:cursor-grabbing"
                aria-label={`Drag to reorder ${app.title}`}
                onKeyDown={(event) => {
                  const index = pinnedApps.findIndex((item) => item.id === app.id)
                  if (index === -1) return

                  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    const previous = pinnedApps[index - 1]
                    if (previous) {
                      void reorderPinnedApps(app.id, previous.id)
                    }
                  }

                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    const next = pinnedApps[index + 1]
                    if (next) {
                      void reorderPinnedApps(app.id, next.id)
                    }
                  }
                }}
              >
                <GripVertical aria-hidden="true" className="h-4 w-4" />
              </button>
              <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 flex-1 items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 text-[var(--accent)] shadow-sm">
                  {app.icon ? <span className="text-sm font-semibold uppercase tracking-[0.08em]">{app.icon}</span> : <Pin aria-hidden="true" className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{app.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{app.description}</div>
                </div>
                <ExternalLink aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--text-label)] transition-colors group-hover:text-[var(--text-primary)]" />
              </a>
              <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingApp(app)
                    setForm({ title: app.title, url: app.url, description: app.description, icon: app.icon || '' })
                    setOpen(true)
                  }}
                  className="icon-button h-8 w-8"
                  aria-label={`Edit ${app.title}`}
                >
                  <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => void deletePinnedApp(app.id)}
                  className="icon-button h-8 w-8 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                  aria-label={`Delete ${app.title}`}
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Modal
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
      title={editingApp ? 'Edit Pinned App' : 'Add Pinned App'}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (!form.title || !form.url || !form.description) return
          if (editingApp) {
            void updatePinnedApp(editingApp.id, { ...form, icon: form.icon.trim() || undefined })
          } else {
            void addPinnedApp({ ...form, icon: form.icon.trim() || undefined })
          }
          setOpen(false)
          resetForm()
        }}
      >
        <p className="section-copy">Keep your most-used apps here for faster access from the dashboard.</p>
        <div>
          <label htmlFor="pinned-app-title" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Title</label>
          <input
            id="pinned-app-title"
            autoComplete="off"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Ex: Linear"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="pinned-app-url" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">URL</label>
          <input
            id="pinned-app-url"
            type="url"
            value={form.url}
            onChange={(event) => setForm({ ...form, url: event.target.value })}
            placeholder="https://example.com"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="pinned-app-description" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Description</label>
          <input
            id="pinned-app-description"
            autoComplete="off"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Short helpful label"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="pinned-app-icon" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Custom Icon</label>
          <input
            id="pinned-app-icon"
            autoComplete="off"
            value={form.icon}
            onChange={(event) => setForm({ ...form, icon: event.target.value.slice(0, 4).toUpperCase() })}
            placeholder="Ex: GH or AI"
            className="input-field"
          />
          <p className="mt-2 text-xs text-[var(--text-label)]">Use up to 4 letters for a compact app badge.</p>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => { setOpen(false); resetForm() }} className="btn-secondary w-full sm:w-auto">
            Cancel
          </button>
          <button type="submit" disabled={!form.title || !form.url || !form.description} className="btn-primary w-full sm:w-auto">
            {editingApp ? 'Save Changes' : 'Add App'}
          </button>
        </div>
      </form>
    </Modal>
    </>
  )
}
