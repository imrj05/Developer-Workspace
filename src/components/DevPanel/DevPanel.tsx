import { useSettingsStore } from '../../stores/settingsStore'
import { GithubActivity } from './GithubActivity'
import { ApiStatus } from './ApiStatus'
import { QuickDocs } from './QuickDocs'
import { PomodoroTimer } from './PomodoroTimer'
import { X } from 'lucide-react'

export function DevPanel() {
  const { settings, updateSettings } = useSettingsStore()

  if (!settings.showDevPanel || !settings.devPanelOpen) return null

  return (
    <div className="card-glass flex w-full flex-col gap-4 p-4 xl:max-h-[calc(100vh-2rem)] xl:w-[20rem] xl:max-w-[20rem]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <div className="section-heading mb-2">Utilities</div>
          <span className="text-base font-semibold text-[var(--text-primary)]">Dev Panel</span>
          <p className="mt-1 text-xs text-[var(--text-label)]">Quick tools for status checks, docs, and focus work.</p>
        </div>
        <button
          onClick={() => updateSettings({ devPanelOpen: false })}
          aria-label="Close developer panel"
          className="icon-button h-10 w-10"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <GithubActivity />
        <ApiStatus />
        <QuickDocs />
        <PomodoroTimer />
      </div>
    </div>
  )
}
