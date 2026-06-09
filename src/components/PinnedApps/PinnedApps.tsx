import { useState } from 'react'
import { GripVertical, Pencil, Pin, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { Modal } from '../ui/Modal'
import { SectionPanel } from '../ui/SectionPanel'
import { LinkTile } from '../ui/LinkTile'
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
      <SectionPanel
        title="Pinned Apps"
        badge={`${pinnedApps.length}`}
        scroll
        actions={
          <>
            <button type="button" onClick={() => void resetPinnedApps()} className="icon-button h-9 w-9" aria-label="Reset defaults">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setOpen(true)} className="btn-primary h-9 px-3 text-sm">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add
            </button>
          </>
        }
      >
        <div className="tile-grid">
          {pinnedApps.map((app) => (
            <div
              key={app.id}
              draggable
              onDragStart={() => setDraggedId(app.id)}
              onDragOver={(event) => {
                event.preventDefault()
                if (draggedId && draggedId !== app.id) setDropTargetId(app.id)
              }}
              onDrop={() => {
                if (draggedId) void reorderPinnedApps(draggedId, app.id)
                setDraggedId(null)
                setDropTargetId(null)
              }}
              onDragEnd={() => {
                setDraggedId(null)
                setDropTargetId(null)
              }}
              className={`flex items-center gap-1 ${draggedId === app.id ? 'opacity-60' : ''} ${dropTargetId === app.id ? 'rounded-[var(--radius-md)] ring-1 ring-[var(--accent)]/40' : ''}`}
            >
              <button
                type="button"
                className="icon-button h-8 w-8 shrink-0 cursor-grab active:cursor-grabbing"
                aria-label={`Drag to reorder ${app.title}`}
                onKeyDown={(event) => {
                  const index = pinnedApps.findIndex((item) => item.id === app.id)
                  if (index === -1) return
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    event.preventDefault()
                    const previous = pinnedApps[index - 1]
                    if (previous) void reorderPinnedApps(app.id, previous.id)
                  }
                  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    const next = pinnedApps[index + 1]
                    if (next) void reorderPinnedApps(app.id, next.id)
                  }
                }}
              >
                <GripVertical aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              <div className="min-w-0 flex-1">
                <LinkTile
                  title={app.title}
                  url={app.url}
                  subtitle={app.description}
                  icon={app.icon ? <span className="uppercase">{app.icon}</span> : <Pin aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />}
                  onEdit={() => {
                    setEditingApp(app)
                    setForm({ title: app.title, url: app.url, description: app.description, icon: app.icon || '' })
                    setOpen(true)
                  }}
                  onDelete={() => void deletePinnedApp(app.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

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
          <div>
            <label htmlFor="pinned-app-title" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Title</label>
            <input id="pinned-app-title" autoComplete="off" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label htmlFor="pinned-app-url" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">URL</label>
            <input id="pinned-app-url" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="input-field" />
          </div>
          <div>
            <label htmlFor="pinned-app-description" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Description</label>
            <input id="pinned-app-description" autoComplete="off" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          </div>
          <div>
            <label htmlFor="pinned-app-icon" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Badge</label>
            <input id="pinned-app-icon" autoComplete="off" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value.slice(0, 4).toUpperCase() })} placeholder="GH" className="input-field" />
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => { setOpen(false); resetForm() }} className="btn-secondary w-full sm:w-auto">Cancel</button>
            <button type="submit" disabled={!form.title || !form.url || !form.description} className="btn-primary w-full sm:w-auto">
              {editingApp ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
