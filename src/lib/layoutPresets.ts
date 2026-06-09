import type { Settings } from './types'

export type LayoutPreset = 'minimal' | 'developer' | 'full'
export type UtilityPanel = 'none' | 'dev-panel' | 'terminal-notes'
export type SettingsTab = 'appearance' | 'layout' | 'integrations'

export const LAYOUT_PRESET_CONFIG: Record<LayoutPreset, Partial<Settings>> = {
  minimal: {
    layoutPreset: 'minimal',
    showWeatherWidget: true,
    showBookmarks: false,
    showDevPanel: false,
    showTerminalNotes: false,
    showQuickActions: true,
    showPinnedApps: true,
    showTaskPlanner: false,
    showRecentActivity: false,
    showSnippetShelf: false,
    showDevShortcuts: false,
    utilityPanel: 'none',
    devPanelOpen: false,
    terminalNotesOpen: false
  },
  developer: {
    layoutPreset: 'developer',
    showWeatherWidget: true,
    showBookmarks: true,
    showDevPanel: true,
    showTerminalNotes: true,
    showQuickActions: true,
    showPinnedApps: true,
    showTaskPlanner: true,
    showRecentActivity: true,
    showSnippetShelf: false,
    showDevShortcuts: true,
    utilityPanel: 'none',
    devPanelOpen: false,
    terminalNotesOpen: false
  },
  full: {
    layoutPreset: 'full',
    showWeatherWidget: true,
    showBookmarks: true,
    showDevPanel: true,
    showTerminalNotes: true,
    showQuickActions: true,
    showPinnedApps: true,
    showTaskPlanner: true,
    showRecentActivity: true,
    showSnippetShelf: true,
    showDevShortcuts: true,
    utilityPanel: 'dev-panel',
    devPanelOpen: true,
    terminalNotesOpen: false
  }
}

export function migrateSettings(settings: Partial<Settings>): Settings {
  const merged = { ...settings } as Settings

  if (!merged.utilityPanel) {
    if (merged.devPanelOpen && merged.terminalNotesOpen) {
      merged.utilityPanel = 'dev-panel'
    } else if (merged.devPanelOpen) {
      merged.utilityPanel = 'dev-panel'
    } else if (merged.terminalNotesOpen) {
      merged.utilityPanel = 'terminal-notes'
    } else {
      merged.utilityPanel = 'none'
    }
  }

  if (!merged.layoutPreset) {
    merged.layoutPreset = 'developer'
  }

  return merged
}
