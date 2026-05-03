import { Command, Keyboard, ListTodo, Settings2, Zap } from 'lucide-react'

interface QuickActionsProps {
  focusMode: boolean
  onOpenPalette: () => void
  onOpenSettings: () => void
  onToggleFocusMode: () => void
  onCreateTask: () => void
  onOpenHelp: () => void
}

export function QuickActions({ focusMode, onOpenPalette, onOpenSettings, onToggleFocusMode, onCreateTask, onOpenHelp }: QuickActionsProps) {
  return (
    <div className="mt-4 flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 px-2 sm:px-0">
      <button type="button" onClick={onOpenPalette} className="chip-button px-4 py-2">
        <Command aria-hidden="true" className="h-3.5 w-3.5" />
        Command Palette
      </button>
      <button type="button" onClick={onCreateTask} className="chip-button px-4 py-2">
        <ListTodo aria-hidden="true" className="h-3.5 w-3.5" />
        New Task
      </button>
      <button type="button" onClick={onToggleFocusMode} data-active={focusMode} className="chip-button px-4 py-2">
        <Zap aria-hidden="true" className="h-3.5 w-3.5" />
        {focusMode ? 'Exit Focus Mode' : 'Focus Mode'}
      </button>
      <button type="button" onClick={onOpenSettings} className="chip-button px-4 py-2">
        <Settings2 aria-hidden="true" className="h-3.5 w-3.5" />
        Settings
      </button>
      <button type="button" onClick={onOpenHelp} className="chip-button px-4 py-2">
        <Keyboard aria-hidden="true" className="h-3.5 w-3.5" />
        Shortcuts
      </button>
    </div>
  )
}
