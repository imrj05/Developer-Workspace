import { create } from 'zustand'
import { DEFAULT_SETTINGS, type Settings } from '../lib/types'
import { LAYOUT_PRESET_CONFIG, migrateSettings, type LayoutPreset } from '../lib/layoutPresets'
import { getStorage, setStorage } from '../lib/chrome'
import {
  isLocalWallpaperMarker,
  isWallpaperDataUrl,
  loadCustomWallpaper,
  LOCAL_WALLPAPER_MARKER,
  removeCustomWallpaper,
  saveCustomWallpaper
} from '../lib/wallpaperStorage'

interface SettingsState {
  settings: Settings
  isLoaded: boolean
  loadSettings: () => Promise<void>
  updateSettings: (partial: Partial<Settings>) => Promise<void>
  applyLayoutPreset: (preset: LayoutPreset) => Promise<void>
  setUtilityPanel: (panel: Settings['utilityPanel']) => Promise<void>
  resetSettings: () => Promise<void>
}

function syncUtilityPanelFlags(panel: Settings['utilityPanel']): Pick<Settings, 'utilityPanel' | 'devPanelOpen' | 'terminalNotesOpen'> {
  return {
    utilityPanel: panel,
    devPanelOpen: panel === 'dev-panel',
    terminalNotesOpen: panel === 'terminal-notes'
  }
}

function settingsForSync(settings: Settings): Settings {
  return {
    ...settings,
    customBackground: settings.customBackground ? LOCAL_WALLPAPER_MARKER : null
  }
}

async function hydrateCustomWallpaper(settings: Settings): Promise<Settings> {
  if (isWallpaperDataUrl(settings.customBackground)) {
    await saveCustomWallpaper(settings.customBackground)
    return settings
  }

  if (!settings.customBackground || !isLocalWallpaperMarker(settings.customBackground)) {
    return { ...settings, customBackground: null }
  }

  const localWallpaper = await loadCustomWallpaper()
  return {
    ...settings,
    customBackground: localWallpaper
  }
}

async function persistSettings(settings: Settings): Promise<void> {
  await setStorage({ settings: settingsForSync(settings) })
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const data = await getStorage<{ settings: Partial<Settings> }>(['settings'])
      if (data?.settings) {
        const merged = migrateSettings({ ...DEFAULT_SETTINGS, ...data.settings })
        const hydrated = await hydrateCustomWallpaper(merged)
        set({ settings: hydrated, isLoaded: true })

        if (isWallpaperDataUrl(merged.customBackground)) {
          await persistSettings(hydrated)
        }
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  updateSettings: async (partial) => {
    let patch = { ...partial }

    if ('utilityPanel' in patch && patch.utilityPanel !== undefined) {
      patch = { ...patch, ...syncUtilityPanelFlags(patch.utilityPanel) }
    }

    if ('devPanelOpen' in patch || 'terminalNotesOpen' in patch) {
      const devOpen = patch.devPanelOpen ?? get().settings.devPanelOpen
      const notesOpen = patch.terminalNotesOpen ?? get().settings.terminalNotesOpen
      if (devOpen && notesOpen) {
        patch.utilityPanel = 'dev-panel'
      } else if (devOpen) {
        patch.utilityPanel = 'dev-panel'
      } else if (notesOpen) {
        patch.utilityPanel = 'terminal-notes'
      } else {
        patch.utilityPanel = 'none'
      }
    }

    if ('customBackground' in patch) {
      if (patch.customBackground === null) {
        await removeCustomWallpaper()
      } else if (isWallpaperDataUrl(patch.customBackground)) {
        await saveCustomWallpaper(patch.customBackground)
      }
    }

    const newSettings = { ...get().settings, ...patch }
    set({ settings: newSettings })
    await persistSettings(newSettings)
  },

  applyLayoutPreset: async (preset) => {
    const presetConfig = LAYOUT_PRESET_CONFIG[preset]
    const newSettings = { ...get().settings, ...presetConfig }
    set({ settings: newSettings })
    await persistSettings(newSettings)
  },

  setUtilityPanel: async (panel) => {
    const newSettings = { ...get().settings, ...syncUtilityPanelFlags(panel) }
    set({ settings: newSettings })
    await persistSettings(newSettings)
  },

  resetSettings: async () => {
    await removeCustomWallpaper()
    set({ settings: DEFAULT_SETTINGS })
    await persistSettings(DEFAULT_SETTINGS)
  }
}))
