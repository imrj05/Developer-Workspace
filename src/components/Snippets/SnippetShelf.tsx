import { useState } from 'react'
import { ClipboardCopy, Code2, Plus, X } from 'lucide-react'
import { useSnippetsStore } from '../../stores/snippetsStore'
import { SectionPanel } from '../ui/SectionPanel'
import { EmptyState } from '../ui/EmptyState'

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

  const isFormOpen = adding || editingId !== null

  return (
    <SectionPanel
      title="Snippets"
      badge={`${snippets.length}`}
      scroll
      actions={
        <button type="button" onClick={() => setAdding(true)} className="btn-primary h-9 px-3 text-sm">
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add
        </button>
      }
    >
      {isFormOpen && (
        <div className="card-subtle mb-3 space-y-2.5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-primary)]">{editingId ? 'Edit snippet' : 'New snippet'}</span>
            <button type="button" onClick={() => { setEditingId(null); setAdding(false) }} className="icon-button h-8 w-8" aria-label="Cancel">
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
          <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Title" className="input-field h-10 text-sm" />
          <select value={formLanguage} onChange={(e) => setFormLanguage(e.target.value)} className="input-field h-10 w-full text-sm sm:w-40">
            {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="Snippet content…" rows={3} className="input-field resize-none rounded-[var(--radius-md)] font-mono text-sm" />
          <button type="button" onClick={() => void handleSave()} disabled={!formTitle.trim() || !formContent.trim()} className="btn-primary h-9 px-4 text-sm">
            {editingId ? 'Save' : 'Add'}
          </button>
        </div>
      )}

      {snippets.length === 0 ? (
        <EmptyState icon={<Code2 aria-hidden="true" className="h-4 w-4" />} title="No snippets yet" description="Save commands and code blocks for quick copy." />
      ) : (
        <div className="space-y-2">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="card-subtle group p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[var(--text-primary)]">{snippet.title}</div>
                  <div className="text-xs text-[var(--text-label)]">{snippet.language}</div>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button type="button" onClick={() => void handleCopy(snippet.id, snippet.content)} className="chip-button px-2.5 py-1 text-xs">
                    <ClipboardCopy aria-hidden="true" className="h-3.5 w-3.5" />
                    {copiedId === snippet.id ? 'Copied' : 'Copy'}
                  </button>
                  <button type="button" onClick={() => { setEditingId(snippet.id); setFormTitle(snippet.title); setFormContent(snippet.content); setFormLanguage(snippet.language) }} className="chip-button px-2.5 py-1 text-xs">Edit</button>
                  <button type="button" onClick={() => void deleteSnippet(snippet.id)} className="chip-button px-2.5 py-1 text-xs text-[var(--error)]">Del</button>
                </div>
              </div>
              <pre className="max-h-20 overflow-auto rounded-[var(--radius-sm)] bg-[var(--code-bg)] p-2.5 font-mono text-xs text-[var(--text-secondary)]"><code>{snippet.content}</code></pre>
            </div>
          ))}
        </div>
      )}
    </SectionPanel>
  )
}
