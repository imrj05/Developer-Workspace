import { useState } from 'react'
import { Plus, Server, X } from 'lucide-react'
import { useDevShortcutsStore } from '../../stores/devShortcutsStore'
import { SectionPanel } from '../ui/SectionPanel'
import { EmptyState } from '../ui/EmptyState'
import { LinkTile } from '../ui/LinkTile'
import type { DevShortcut } from '../../lib/types'

const CATEGORIES = [
  { value: 'local' as const, label: 'Local' },
  { value: 'staging' as const, label: 'Staging' },
  { value: 'production' as const, label: 'Production' },
  { value: 'tool' as const, label: 'Tool' }
]

export function DevShortcuts() {
  const { shortcuts, addShortcut, updateShortcut, deleteShortcut } = useDevShortcutsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [filterCategory, setFilterCategory] = useState<DevShortcut['category'] | 'all'>('all')

  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState<DevShortcut['category']>('local')

  const startEdit = (shortcut: DevShortcut) => {
    setEditingId(shortcut.id)
    setFormName(shortcut.name)
    setFormUrl(shortcut.url)
    setFormDescription(shortcut.description)
    setFormCategory(shortcut.category)
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

  const isFormOpen = adding || editingId !== null
  const filtered = filterCategory === 'all' ? shortcuts : shortcuts.filter((s) => s.category === filterCategory)

  return (
    <SectionPanel
      title="Dev Shortcuts"
      badge={`${filtered.length}`}
      scroll
      actions={
        <button type="button" onClick={() => setAdding(true)} className="btn-primary h-9 px-3 text-sm">
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add
        </button>
      }
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setFilterCategory('all')} data-active={filterCategory === 'all'} className="chip-button">All</button>
        {CATEGORIES.map((cat) => (
          <button key={cat.value} type="button" onClick={() => setFilterCategory(cat.value)} data-active={filterCategory === cat.value} className="chip-button">
            {cat.label}
          </button>
        ))}
      </div>

      {isFormOpen && (
        <div className="card-subtle mb-3 space-y-2.5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-primary)]">{editingId ? 'Edit shortcut' : 'New shortcut'}</span>
            <button type="button" onClick={() => { setEditingId(null); setAdding(false) }} className="icon-button h-8 w-8" aria-label="Cancel">
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Name" className="input-field h-10 text-sm" />
            <input type="url" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="http://localhost:3000" className="input-field h-10 text-sm" />
          </div>
          <input type="text" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Description" className="input-field h-10 text-sm" />
          <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as DevShortcut['category'])} className="input-field h-10 w-full text-sm sm:w-44">
            {CATEGORIES.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => void handleSave()} disabled={!formName.trim() || !formUrl.trim()} className="btn-primary h-9 px-4 text-sm">
              {editingId ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={<Server aria-hidden="true" className="h-4 w-4" />} title="No shortcuts yet" description="Add local dev URLs and tools." />
      ) : (
        <div className="tile-grid">
          {filtered.map((shortcut) => (
            <LinkTile
              key={shortcut.id}
              title={shortcut.name}
              url={shortcut.url}
              subtitle={shortcut.description || shortcut.url}
              badge={shortcut.category}
              icon={<Server aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />}
              onEdit={() => startEdit(shortcut)}
              onDelete={() => void deleteShortcut(shortcut.id)}
            />
          ))}
        </div>
      )}
    </SectionPanel>
  )
}
