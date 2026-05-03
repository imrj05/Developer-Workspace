import { Keyboard } from 'lucide-react'
import { Modal } from '../ui/Modal'

interface ShortcutsHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SHORTCUTS = [
  { keys: '/', description: 'Focus the main search input' },
  { keys: 'Esc', description: 'Clear or blur the search input' },
  { keys: 'Cmd/Ctrl + K', description: 'Open the command palette' },
  { keys: 'Arrow keys', description: 'Reorder pinned apps when focused on the drag handle' }
]

export function ShortcutsHelpModal({ open, onOpenChange }: ShortcutsHelpModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Keyboard Shortcuts">
      <div className="space-y-4">
        <p className="section-copy">Use the keyboard-first actions below to move around the dashboard faster.</p>
        <div className="space-y-2">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.keys} className="card-subtle flex items-center justify-between gap-4 px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)]">{shortcut.description}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
                <Keyboard aria-hidden="true" className="h-3.5 w-3.5" />
                {shortcut.keys}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
