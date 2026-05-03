import { create } from 'zustand'
import { DEFAULT_SETTINGS, type Settings } from '../lib/types'
import { getStorage, setStorage } from '../lib/chrome'

interface SettingsState {
  settings: Settings
  isLoaded: boolean
  loadSettings: () => Promise<void>
  updateSettings: (partial: Partial<Settings>) => Promise<void>
  resetSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const data = await getStorage<{ settings: Settings }>(['settings'])
      if (data?.settings) {
        set({ settings: { ...DEFAULT_SETTINGS, ...data.settings }, isLoaded: true })
      } else {
        set({ isLoaded: true })
      }
    } catch {
      set({ isLoaded: true })
    }
  },

  updateSettings: async (partial) => {
    const newSettings = { ...get().settings, ...partial }
    set({ settings: newSettings })
    await setStorage({ settings: newSettings })
  },

  resetSettings: async () => {
    set({ settings: DEFAULT_SETTINGS })
    await setStorage({ settings: DEFAULT_SETTINGS })
  }
}))
