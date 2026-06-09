import { Terminal, Wrench } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { TerminalNotes } from '../TerminalNotes/TerminalNotes'
import type { UtilityPanel } from '../../lib/layoutPresets'

export function UtilityDock() {
  const { settings, setUtilityPanel } = useSettingsStore()
  const showDock = (settings.showDevPanel || settings.showTerminalNotes) && !settings.focusMode

  if (!showDock) return null

  const activePanel = settings.utilityPanel

  const togglePanel = (panel: Exclude<UtilityPanel, 'none'>) => {
    void setUtilityPanel(activePanel === panel ? 'none' : panel)
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex w-full max-w-4xl -translate-x-1/2 flex-col items-center gap-2 px-4">
      {activePanel === 'terminal-notes' && settings.showTerminalNotes && (
        <div className="pointer-events-auto hidden w-full max-w-[680px] xl:block">
          <TerminalNotes embedded />
        </div>
      )}

      <div className="pointer-events-auto card-glass flex items-center gap-1 p-1">
        {settings.showTerminalNotes && (
          <button
            type="button"
            onClick={() => togglePanel('terminal-notes')}
            data-active={activePanel === 'terminal-notes'}
            className="chip-button px-3 py-2"
            aria-pressed={activePanel === 'terminal-notes'}
          >
            <Terminal aria-hidden="true" className="h-3.5 w-3.5" />
            Notes
          </button>
        )}
        {settings.showDevPanel && (
          <button
            type="button"
            onClick={() => togglePanel('dev-panel')}
            data-active={activePanel === 'dev-panel'}
            className="chip-button px-3 py-2"
            aria-pressed={activePanel === 'dev-panel'}
          >
            <Wrench aria-hidden="true" className="h-3.5 w-3.5" />
            Dev Panel
          </button>
        )}
      </div>
    </div>
  )
}
