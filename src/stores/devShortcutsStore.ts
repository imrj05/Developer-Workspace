import { create } from 'zustand'
import { getStorage, setStorage } from '../lib/chrome'
import type { DevShortcut } from '../lib/types'

interface DevShortcutsState {
  shortcuts: DevShortcut[]
  loadDevShortcuts: () => Promise<void>
  addShortcut: (shortcut: Omit<DevShortcut, 'id'>) => Promise<void>
  updateShortcut: (id: string, partial: Partial<DevShortcut>) => Promise<void>
  deleteShortcut: (id: string) => Promise<void>
}

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

const DEFAULT_SHORTCUTS: DevShortcut[] = [
  { id: 'ds-1', name: 'Local App', url: 'http://localhost:3000', description: 'Frontend dev server', category: 'local' },
  { id: 'ds-2', name: 'Local API', url: 'http://localhost:8080', description: 'Backend API server', category: 'local' },
  { id: 'ds-3', name: 'Local DB Admin', url: 'http://localhost:5432', description: 'Database admin panel', category: 'local' },
  { id: 'ds-4', name: 'Staging', url: 'https://staging.example.com', description: 'Staging environment', category: 'staging' },
  { id: 'ds-5', name: 'Storybook', url: 'http://localhost:6006', description: 'Component library', category: 'tool' }
]

export const useDevShortcutsStore = create<DevShortcutsState>((set, get) => ({
  shortcuts: DEFAULT_SHORTCUTS,

  loadDevShortcuts: async () => {
    try {
      const data = await getStorage<{ devShortcuts: DevShortcut[] }>(['devShortcuts'])
      const shortcuts = data?.devShortcuts?.length ? data.devShortcuts : DEFAULT_SHORTCUTS
      set({ shortcuts })
      if (!data?.devShortcuts?.length) {
        await setStorage({ devShortcuts: shortcuts })
      }
    } catch {
      set({ shortcuts: DEFAULT_SHORTCUTS })
    }
  },

  addShortcut: async (shortcut) => {
    const shortcuts = [...get().shortcuts, { id: generateId(), ...shortcut }]
    set({ shortcuts })
    await setStorage({ devShortcuts: shortcuts })
  },

  updateShortcut: async (id, partial) => {
    const shortcuts = get().shortcuts.map((s) => s.id === id ? { ...s, ...partial } : s)
    set({ shortcuts })
    await setStorage({ devShortcuts: shortcuts })
  },

  deleteShortcut: async (id) => {
    const shortcuts = get().shortcuts.filter((s) => s.id !== id)
    set({ shortcuts })
    await setStorage({ devShortcuts: shortcuts })
  }
}))