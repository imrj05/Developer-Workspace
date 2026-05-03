import { useState } from 'react'
import { ClipboardCopy, Code2, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useSnippetsStore } from '../../stores/snippetsStore'
import { Modal } from '../ui/Modal'

const LANGUAGES = ['bash', 'javascript', 'typescript', 'python', 'sql', 'json', 'yaml', 'plaintext']

export function SnippetShelf() {
  const { snippets, addSnippet, updateSnippet, deleteSnippet } = useSnippetsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formLanguage, setFormLanguage] = useState('bash')

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {}
  }

  const startEdit = (snippet: typeof snippets[0]) => {
    setEditingId(snippet.id)
    setFormTitle(snippet.title)
    setFormContent(snippet.content)
    setFormLanguage(snippet.language)
  }

  const startAdd = () => {
    setAdding(true)
    setFormTitle('')
    setFormContent('')
    setFormLanguage('bash')
  }

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) return
    if (editingId) {
      await updateSnippet(editingId, { title: formTitle.trim(), content: formContent.trim(), language: formLanguage })
      setEditingId(null)
    } else {
      await addSnippet({ title: formTitle.trim(), content: formContent.trim(), language: formLanguage })
      setAdding(false)
    }
    setFormTitle('')
    setFormContent('')
    setFormLanguage('bash')
  }

  const handleCancel = () => {
    setEditingId(null)
    setAdding(false)
    setFormTitle('')
    setFormContent('')
    setFormLanguage('bash')
  }

  const isFormOpen = adding || editingId !== null

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="card-glass p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="section-heading mb-2">Snippets</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Clipboard Shelf</h3>
          </div>
          <button type="button" onClick={startAdd} className="chip-button px-4 py-2">
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
            Add
          </button>
        </div>

        {isFormOpen && (
          <div className="card-subtle mb-4 space-y-3 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">{editingId ? 'Edit Snippet' : 'New Snippet'}</span>
              <button type="button" onClick={handleCancel} className="icon-button h-8 w-8" aria-label="Cancel">
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Snippet title…"
              className="input-field h-11"
            />
            <div className="flex gap-2">
              <select
                value={formLanguage}
                onChange={(e) => setFormLanguage(e.target.value)}
                className="input-field h-11 w-36 shrink-0"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Paste or type your snippet…"
              rows={3}
              className="input-field resize-none rounded-[var(--radius-lg)] font-mono text-sm"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="btn-secondary px-4 py-2">Cancel</button>
              <button type="button" onClick={() => void handleSave()} disabled={!formTitle.trim() || !formContent.trim()} className="btn-primary px-4 py-2">
                {editingId ? 'Save' : 'Add Snippet'}
              </button>
            </div>
          </div>
        )}

        {snippets.length === 0 ? (
          <div className="card-subtle flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <Code2 aria-hidden="true" className="h-5 w-5 text-[var(--text-label)]" />
            <p className="text-sm font-medium text-[var(--text-primary)]">No snippets yet.</p>
            <p className="text-xs text-[var(--text-secondary)]">Save frequently used commands and code blocks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {snippets.map((snippet) => (
              <div key={snippet.id} className="card-subtle group flex flex-col gap-2 p-4 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{snippet.title}</div>
                    <div className="mt-0.5 text-xs text-[var(--text-label)]">{snippet.language}</div>
                  </div>
                  <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button type="button" onClick={() => startEdit(snippet)} className="icon-button h-7 w-7" aria-label={`Edit ${snippet.title}`}>
                      <Pencil aria-hidden="true" className="h-3 w-3" />
                    </button>
                    <button type="button" onClick={() => void deleteSnippet(snippet.id)} className="icon-button h-7 w-7 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10" aria-label={`Delete ${snippet.title}`}>
                      <Trash2 aria-hidden="true" className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <pre className="max-h-24 overflow-auto rounded-[var(--radius-sm)] bg-[var(--code-bg)] p-2.5 font-mono text-xs text-[var(--text-secondary)]">
                  <code>{snippet.content}</code>
                </pre>
                <button
                  type="button"
                  onClick={() => void handleCopy(snippet.id, snippet.content)}
                  className="btn-secondary w-full justify-center py-2 text-xs"
                >
                  <ClipboardCopy aria-hidden="true" className="h-3.5 w-3.5" />
                  {copiedId === snippet.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}