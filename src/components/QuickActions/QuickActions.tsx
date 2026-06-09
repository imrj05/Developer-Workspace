import { Command, ListTodo, Zap } from 'lucide-react'

interface QuickActionsProps {
  focusMode: boolean
  onOpenPalette: () => void
  onToggleFocusMode: () => void
  onCreateTask: () => void
  onOpenHelp: () => void
}

export function QuickActions({ focusMode, onOpenPalette, onToggleFocusMode, onCreateTask, onOpenHelp }: QuickActionsProps) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={onOpenPalette} className="chip-button">
        <Command aria-hidden="true" className="h-3.5 w-3.5" />
        Palette
        <span className="hidden text-xs font-medium text-[var(--text-label)] sm:inline">⌘K</span>
      </button>
      <button type="button" onClick={onCreateTask} className="chip-button">
        <ListTodo aria-hidden="true" className="h-3.5 w-3.5" />
        Task
      </button>
      <button type="button" onClick={onToggleFocusMode} data-active={focusMode} className="chip-button">
        <Zap aria-hidden="true" className="h-3.5 w-3.5" />
        {focusMode ? 'Exit focus' : 'Focus'}
      </button>
      <button type="button" onClick={onOpenHelp} className="chip-button">
        Help
        <span className="hidden text-xs font-medium text-[var(--text-label)] sm:inline">?</span>
      </button>
    </div>
  )
}
