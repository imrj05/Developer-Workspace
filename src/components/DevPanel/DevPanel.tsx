import { createPortal } from 'react-dom'
import { useSettingsStore } from '../../stores/settingsStore'
import { GithubActivity } from './GithubActivity'
import { ApiStatus } from './ApiStatus'
import { QuickDocs } from './QuickDocs'
import { PomodoroTimer } from './PomodoroTimer'
import { X } from 'lucide-react'

export function DevPanel() {
  const { settings, setUtilityPanel } = useSettingsStore()

  if (!settings.showDevPanel || settings.focusMode) return null
  if (settings.utilityPanel !== 'dev-panel') return null

  return createPortal(
    <aside className="dev-panel-sidebar" aria-label="Developer panel">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-4">
        <div className="min-w-0">
          <div className="section-heading mb-1.5">Utilities</div>
          <span className="text-base font-semibold text-[var(--text-primary)]">Dev Panel</span>
          <p className="mt-1 text-xs text-[var(--text-label)]">Status, docs, and focus tools.</p>
        </div>
        <button
          onClick={() => void setUtilityPanel('none')}
          aria-label="Close developer panel"
          className="icon-button h-10 w-10 shrink-0"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <GithubActivity />
        <ApiStatus />
        <QuickDocs />
        <PomodoroTimer />
      </div>
    </aside>,
    document.body
  )
}
