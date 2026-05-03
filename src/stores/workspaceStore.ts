import { create } from 'zustand'
import { getStorage, setStorage } from '../lib/chrome'
import type { PinnedApp, TaskItem } from '../lib/types'

interface WorkspaceState {
  pinnedApps: PinnedApp[]
  tasks: TaskItem[]
  loadWorkspace: () => Promise<void>
  addPinnedApp: (app: Omit<PinnedApp, 'id'>) => Promise<void>
  updatePinnedApp: (id: string, partial: Partial<PinnedApp>) => Promise<void>
  deletePinnedApp: (id: string) => Promise<void>
  reorderPinnedApps: (activeId: string, targetId: string) => Promise<void>
  resetPinnedApps: () => Promise<void>
  addTask: (title: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const DEFAULT_PINNED_APPS: PinnedApp[] = [
  { id: 'github', title: 'GitHub', url: 'https://github.com', description: 'Code, repos, and pull requests', icon: 'GH' },
  { id: 'chatgpt', title: 'ChatGPT', url: 'https://chat.openai.com', description: 'AI assistant', icon: 'AI' },
  { id: 'gmail', title: 'Gmail', url: 'https://mail.google.com', description: 'Inbox and notifications', icon: 'GM' },
  { id: 'notion', title: 'Notion', url: 'https://notion.so', description: 'Notes and docs', icon: 'NO' },
  { id: 'leetcode', title: 'LeetCode', url: 'https://leetcode.com', description: 'Practice and prep', icon: 'LC' },
  { id: 'calendar', title: 'Google Calendar', url: 'https://calendar.google.com', description: 'Meetings and schedule', icon: 'GC' }
]

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  pinnedApps: DEFAULT_PINNED_APPS,
  tasks: [],

  loadWorkspace: async () => {
    try {
      const data = await getStorage<{
        pinnedApps: PinnedApp[]
        tasks: TaskItem[]
      }>(['pinnedApps', 'tasks'])

      const pinnedApps = data?.pinnedApps?.length ? data.pinnedApps : DEFAULT_PINNED_APPS
      const tasks = data?.tasks || []

      set({ pinnedApps, tasks })

      if (!data?.pinnedApps?.length) {
        await setStorage({ pinnedApps })
      }
    } catch {
      set({ pinnedApps: DEFAULT_PINNED_APPS, tasks: [] })
    }
  },

  addPinnedApp: async (app) => {
    const pinnedApps = [...get().pinnedApps, { id: generateId(), ...app }]
    set({ pinnedApps })
    await setStorage({ pinnedApps })
  },

  updatePinnedApp: async (id, partial) => {
    const pinnedApps = get().pinnedApps.map((app) => app.id === id ? { ...app, ...partial } : app)
    set({ pinnedApps })
    await setStorage({ pinnedApps })
  },

  deletePinnedApp: async (id) => {
    const pinnedApps = get().pinnedApps.filter((app) => app.id !== id)
    set({ pinnedApps })
    await setStorage({ pinnedApps })
  },

  reorderPinnedApps: async (activeId, targetId) => {
    if (activeId === targetId) return

    const pinnedApps = [...get().pinnedApps]
    const fromIndex = pinnedApps.findIndex((app) => app.id === activeId)
    const toIndex = pinnedApps.findIndex((app) => app.id === targetId)

    if (fromIndex === -1 || toIndex === -1) return

    const [moved] = pinnedApps.splice(fromIndex, 1)
    pinnedApps.splice(toIndex, 0, moved)

    set({ pinnedApps })
    await setStorage({ pinnedApps })
  },

  resetPinnedApps: async () => {
    const pinnedApps = DEFAULT_PINNED_APPS
    set({ pinnedApps })
    await setStorage({ pinnedApps })
  },

  addTask: async (title) => {
    const tasks = [{ id: generateId(), title: title.trim(), completed: false, createdAt: Date.now() }, ...get().tasks]
    set({ tasks })
    await setStorage({ tasks })
  },

  toggleTask: async (id) => {
    const tasks = get().tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task)
    set({ tasks })
    await setStorage({ tasks })
  },

  deleteTask: async (id) => {
    const tasks = get().tasks.filter((task) => task.id !== id)
    set({ tasks })
    await setStorage({ tasks })
  }
}))
