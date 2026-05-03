import { useState } from 'react'
import { ExternalLink, Globe, Pencil, Plus, Server, Trash2, Wrench, X } from 'lucide-react'
import { useDevShortcutsStore } from '../../stores/devShortcutsStore'
import type { DevShortcut } from '../../lib/types'

const CATEGORIES = [
  { value: 'local' as const, label: 'Local', icon: Server },
  { value: 'staging' as const, label: 'Staging', icon: Globe },
  { value: 'production' as const, label: 'Production', icon: Globe },
  { value: 'tool' as const, label: 'Tool', icon: Wrench }
]

const CATEGORY_COLORS: Record<DevShortcut['category'], string> = {
  local: 'bg-[var(--accent)]/12 text-[var(--accent)] border-[var(--accent)]/25',
  staging: 'bg-[var(--warning)]/12 text-[var(--warning)] border-[var(--warning)]/25',
  production: 'bg-[var(--error)]/12 text-[var(--error)] border-[var(--error)]/25',
  tool: 'bg-[var(--text-label)]/12 text-[var(--text-label)] border-[var(--text-label)]/25'
}

function getCategoryBadge(category: DevShortcut['category']) {
  const cat = CATEGORIES.find((c) => c.value === category)
  return cat?.label ?? category
}

export function DevShortcuts() {
  const { shortcuts, addShortcut, updateShortcut, deleteShortcut } = useDevShortcutsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [filterCategory, setFilterCategory] = useState<DevShortcut['category'] | 'all'>('all')

  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState<DevShortcut['category']>('local')

  const startEdit = (shortcut: typeof shortcuts[0]) => {
    setEditingId(shortcut.id)
    setFormName(shortcut.name)
    setFormUrl(shortcut.url)
    setFormDescription(shortcut.description)
    setFormCategory(shortcut.category)
  }

  const startAdd = () => {
    setAdding(true)
    setFormName('')
    setFormUrl('')
    setFormDescription('')
    setFormCategory('local')
  }

  const handleSave = async () => {
    if (!formName.trim() || !formUrl.trim()) return
    if (editingId) {
      await updateShortcut(editingId, { name: formName.trim(), url: formUrl.trim(), description: formDescription.trim(), category: formCategory })
      setEditingId(null)
    } else {
      await addShortcut({ name: formName.trim(), url: formUrl.trim(), description: formDescription.trim(), category: formCategory })
      setAdding(false)
    }
    setFormName('')
    setFormUrl('')
    setFormDescription('')
    setFormCategory('local')
  }

  const handleCancel = () => {
    setEditingId(null)
    setAdding(false)
  }

  const isFormOpen = adding || editingId !== null
  const filtered = filterCategory === 'all' ? shortcuts : shortcuts.filter((s) => s.category === filterCategory)

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="card-glass p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="section-heading mb-2">Dev Shortcuts</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Quick Access</h3>
          </div>
          <button type="button" onClick={startAdd} className="chip-button px-4 py-2">
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`chip-button px-3 py-1.5 ${filterCategory === 'all' ? "border-[var(--accent)]/50 bg-[var(--accent)]/12 text-[var(--accent)]" : ""}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilterCategory(cat.value)}
              className={`chip-button px-3 py-1.5 ${filterCategory === cat.value ? "border-[var(--accent)]/50 bg-[var(--accent)]/12 text-[var(--accent)]" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {isFormOpen && (
          <div className="card-subtle mb-4 space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">{editingId ? 'Edit Shortcut' : 'New Shortcut'}</span>
              <button type="button" onClick={handleCancel} className="icon-button h-8 w-8" aria-label="Cancel">
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Name…"
                className="input-field h-11"
              />
              <input
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="input-field h-11"
              />
            </div>
            <input
              type="text"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Short description…"
              className="input-field h-11"
            />
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as DevShortcut['category'])}
              className="input-field h-11 w-40"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="btn-secondary px-4 py-2">Cancel</button>
              <button type="button" onClick={() => void handleSave()} disabled={!formName.trim() || !formUrl.trim()} className="btn-primary px-4 py-2">
                {editingId ? 'Save' : 'Add Shortcut'}
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="card-subtle flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <Server aria-hidden="true" className="h-5 w-5 text-[var(--text-label)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">No shortcuts yet.</p>
            <p className="text-xs text-[var(--text-secondary)]">Add your local dev URLs and tools for quick access.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((shortcut) => (
              <a
                key={shortcut.id}
                href={shortcut.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-subtle group relative flex flex-col gap-2 p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/25"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{shortcut.name}</div>
                    <div className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">{shortcut.description}</div>
                  </div>
                  <div className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[shortcut.category]}`}>
                    {getCategoryBadge(shortcut.category)}
                  </div>
                </div>
                <div className="truncate font-mono text-xs text-[var(--text-label)]">{shortcut.url}</div>
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.preventDefault()}>
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); startEdit(shortcut) }} className="icon-button h-7 w-7" aria-label={`Edit ${shortcut.name}`}>
                    <Pencil aria-hidden="true" className="h-3 w-3" />
                  </button>
                  <button type="button" onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await deleteShortcut(shortcut.id) }} className="icon-button h-7 w-7 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10" aria-label={`Delete ${shortcut.name}`}>
                    <Trash2 aria-hidden="true" className="h-3 w-3" />
                  </button>
                </div>
                <ExternalLink aria-hidden="true" className="absolute bottom-3 right-3 h-3.5 w-3.5 text-[var(--text-label)] opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}