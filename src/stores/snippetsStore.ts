import { create } from 'zustand'
import { getStorage, setStorage } from '../lib/chrome'
import type { Snippet } from '../lib/types'

interface SnippetsState {
  snippets: Snippet[]
  loadSnippets: () => Promise<void>
  addSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt'>) => Promise<void>
  updateSnippet: (id: string, partial: Partial<Snippet>) => Promise<void>
  deleteSnippet: (id: string) => Promise<void>
}

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

const DEFAULT_SNIPPETS: Snippet[] = [
  { id: 'snippet-1', title: 'Git Amend', content: 'git commit --amend --no-edit', language: 'bash', createdAt: Date.now() - 86400000 },
  { id: 'snippet-2', title: 'Docker Rebuild', content: 'docker compose up -d --build --force-recreate', language: 'bash', createdAt: Date.now() - 43200000 },
  { id: 'snippet-3', title: 'Port Kill', content: "lsof -ti:3000 | xargs kill -9", language: 'bash', createdAt: Date.now() }
]

export const useSnippetsStore = create<SnippetsState>((set, get) => ({
  snippets: DEFAULT_SNIPPETS,

  loadSnippets: async () => {
    try {
      const data = await getStorage<{ snippets: Snippet[] }>(['snippets'])
      const snippets = data?.snippets?.length ? data.snippets : DEFAULT_SNIPPETS
      set({ snippets })
      if (!data?.snippets?.length) {
        await setStorage({ snippets })
      }
    } catch {
      set({ snippets: DEFAULT_SNIPPETS })
    }
  },

  addSnippet: async (snippet) => {
    const snippets = [{ id: generateId(), ...snippet, createdAt: Date.now() }, ...get().snippets]
    set({ snippets })
    await setStorage({ snippets })
  },

  updateSnippet: async (id, partial) => {
    const snippets = get().snippets.map((s) => s.id === id ? { ...s, ...partial } : s)
    set({ snippets })
    await setStorage({ snippets })
  },

  deleteSnippet: async (id) => {
    const snippets = get().snippets.filter((s) => s.id !== id)
    set({ snippets })
    await setStorage({ snippets })
  }
}))