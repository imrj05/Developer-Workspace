import { create } from 'zustand'
import { getStorageWithFallback, setStorage } from '../lib/chrome'
import type { Bookmark, Folder, ApiStatus, DevNote } from '../lib/types'

type DefaultBookmarkSeed = {
  title: string
  url: string
  icon: string
  color: string
  category: string
}

type DefaultFolderSeed = {
  id: string
  name: string
  color: string
  category: string
  items: Omit<DefaultBookmarkSeed, 'category'>[]
}

const CATEGORY_LABELS: Record<string, string> = {
  dev: 'Dev',
  prod: 'Prod',
  ai: 'AI',
  social: 'Social',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  education: 'Education',
  other: 'Other'
}

const DEFAULT_BOOKMARKS: DefaultBookmarkSeed[] = [
  { title: 'GitHub', url: 'https://github.com', icon: 'GH', color: '#ffffff0f', category: 'dev' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'SO', color: '#ffffff0f', category: 'dev' },
  { title: 'GeeksforGeeks', url: 'https://geeksforgeeks.org', icon: 'GFG', color: '#ffffff0f', category: 'dev' },
  { title: 'InterviewBit', url: 'https://www.interviewbit.com', icon: 'IB', color: '#ffffff0f', category: 'dev' },
  { title: 'LeetCode', url: 'https://leetcode.com', icon: 'LC', color: '#ffffff0f', category: 'dev' },
  { title: 'HackerRank', url: 'https://hackerrank.com', icon: 'HR', color: '#ffffff0f', category: 'dev' },
  { title: 'CodeChef', url: 'https://codechef.com', icon: 'CC', color: '#ffffff0f', category: 'dev' },
  { title: 'HackerEarth', url: 'https://hackerearth.com', icon: 'HE', color: '#ffffff0f', category: 'dev' },
  { title: 'Dev.to', url: 'https://dev.to', icon: 'DT', color: '#ffffff0f', category: 'dev' },
  { title: 'Hashnode', url: 'https://hashnode.com', icon: 'HN', color: '#ffffff0f', category: 'dev' },
  { title: 'Gmail', url: 'https://mail.google.com', icon: 'GM', color: '#ffffff0f', category: 'prod' },
  { title: 'Zoho Mail', url: 'https://mail.zoho.in', icon: 'ZH', color: '#ffffff0f', category: 'prod' },
  { title: 'Notion', url: 'https://notion.so', icon: 'N', color: '#ffffff0f', category: 'prod' },
  { title: 'Calendly', url: 'https://calendly.com', icon: 'CL', color: '#ffffff0f', category: 'prod' },
  { title: 'Microsoft Teams', url: 'https://teams.microsoft.com', icon: 'MT', color: '#ffffff0f', category: 'prod' },
  { title: 'Google Meet', url: 'https://meet.google.com', icon: 'GM', color: '#ffffff0f', category: 'prod' },
  { title: 'Google Drive', url: 'https://drive.google.com', icon: 'GD', color: '#ffffff0f', category: 'prod' },
  { title: 'Trello', url: 'https://trello.com', icon: 'TR', color: '#ffffff0f', category: 'prod' },
  { title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI', color: '#ffffff0f', category: 'ai' },
  { title: 'Claude', url: 'https://claude.ai', icon: 'CL', color: '#ffffff0f', category: 'ai' },
  { title: 'Bard', url: 'https://bard.google.com', icon: 'BA', color: '#ffffff0f', category: 'ai' },
  { title: 'Bing Chat', url: 'https://bing.com/chat', icon: 'BC', color: '#ffffff0f', category: 'ai' },
  { title: 'Hugging Face', url: 'https://huggingface.co', icon: 'HF', color: '#ffffff0f', category: 'ai' },
  { title: 'Midjourney', url: 'https://www.midjourney.com', icon: 'MJ', color: '#ffffff0f', category: 'ai' },
  { title: 'RunwayML', url: 'https://runwayml.com', icon: 'RW', color: '#ffffff0f', category: 'ai' },
  { title: 'Jasper', url: 'https://www.jasper.ai', icon: 'JP', color: '#ffffff0f', category: 'ai' },
  { title: 'WhatsApp Web', url: 'https://web.whatsapp.com', icon: 'WA', color: '#ffffff0f', category: 'social' },
  { title: 'LinkedIn', url: 'https://linkedin.com', icon: 'LI', color: '#ffffff0f', category: 'social' },
  { title: 'Instagram', url: 'https://instagram.com', icon: 'IG', color: '#ffffff0f', category: 'social' },
  { title: 'Twitter', url: 'https://twitter.com', icon: 'TW', color: '#ffffff0f', category: 'social' },
  { title: 'Telegram', url: 'https://web.telegram.org', icon: 'TG', color: '#ffffff0f', category: 'social' },
  { title: 'Reddit', url: 'https://reddit.com', icon: 'RD', color: '#ffffff0f', category: 'social' },
  { title: 'Discord', url: 'https://discord.com', icon: 'DC', color: '#ffffff0f', category: 'social' },
  { title: 'Slack', url: 'https://slack.com', icon: 'SL', color: '#ffffff0f', category: 'social' },
  { title: 'Amazon.in', url: 'https://amazon.in', icon: 'AZ', color: '#ffffff0f', category: 'shopping' },
  { title: 'Flipkart', url: 'https://flipkart.com', icon: 'FK', color: '#ffffff0f', category: 'shopping' },
  { title: 'Myntra', url: 'https://myntra.com', icon: 'MY', color: '#ffffff0f', category: 'shopping' },
  { title: 'Nykaa', url: 'https://nykaa.com', icon: 'NK', color: '#ffffff0f', category: 'shopping' },
  { title: 'Meesho', url: 'https://meesho.com', icon: 'ME', color: '#ffffff0f', category: 'shopping' },
  { title: 'Ajio', url: 'https://ajio.com', icon: 'AJ', color: '#ffffff0f', category: 'shopping' },
  { title: 'Tata CLiQ', url: 'https://tatacliq.com', icon: 'TC', color: '#ffffff0f', category: 'shopping' },
  { title: 'Reliance Digital', url: 'https://reliancedigital.in', icon: 'RD', color: '#ffffff0f', category: 'shopping' },
  { title: 'YouTube', url: 'https://youtube.com', icon: 'YT', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Hotstar', url: 'https://hotstar.com', icon: 'HS', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Prime Video', url: 'https://primevideo.com', icon: 'PV', color: '#ffffff0f', category: 'entertainment' },
  { title: 'SonyLIV', url: 'https://sonyliv.com', icon: 'SL', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Netflix', url: 'https://netflix.com', icon: 'NF', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Zee5', url: 'https://zee5.com', icon: 'Z5', color: '#ffffff0f', category: 'entertainment' },
  { title: 'Voot', url: 'https://voot.com', icon: 'VT', color: '#ffffff0f', category: 'entertainment' },
  { title: 'MX Player', url: 'https://mxplayer.in', icon: 'MX', color: '#ffffff0f', category: 'entertainment' },
  { title: 'NPTEL', url: 'https://nptel.ac.in', icon: 'NP', color: '#ffffff0f', category: 'education' },
  { title: 'Coursera', url: 'https://coursera.org', icon: 'CO', color: '#ffffff0f', category: 'education' },
  { title: 'Unacademy', url: 'https://unacademy.com', icon: 'UA', color: '#ffffff0f', category: 'education' },
  { title: "BYJU'S", url: 'https://byjus.com', icon: 'BJ', color: '#ffffff0f', category: 'education' },
  { title: 'upGrad', url: 'https://upgrad.com', icon: 'UG', color: '#ffffff0f', category: 'education' },
  { title: 'Vedantu', url: 'https://vedantu.com', icon: 'VD', color: '#ffffff0f', category: 'education' },
  { title: 'Great Learning', url: 'https://greatlearning.in', icon: 'GL', color: '#ffffff0f', category: 'education' },
  { title: 'Simplilearn', url: 'https://simplilearn.com', icon: 'SL', color: '#ffffff0f', category: 'education' },
  { title: 'IRCTC', url: 'https://irctc.co.in', icon: 'IR', color: '#ffffff0f', category: 'other' },
  { title: 'Paytm', url: 'https://paytm.com', icon: 'PT', color: '#ffffff0f', category: 'other' },
  { title: 'PhonePe', url: 'https://phonepe.com', icon: 'PP', color: '#ffffff0f', category: 'other' },
  { title: 'Aarogya Setu', url: 'https://aarogyasetu.gov.in', icon: 'AS', color: '#ffffff0f', category: 'other' },
  { title: 'DigiLocker', url: 'https://digilocker.gov.in', icon: 'DL', color: '#ffffff0f', category: 'other' },
  { title: 'Google Pay', url: 'https://pay.google.com', icon: 'GP', color: '#ffffff0f', category: 'other' },
  { title: 'MMT', url: 'https://makemytrip.com', icon: 'MT', color: '#ffffff0f', category: 'other' },
  { title: 'Swiggy', url: 'https://swiggy.com', icon: 'SW', color: '#ffffff0f', category: 'other' },
  { title: 'Zomato', url: 'https://zomato.com', icon: 'ZM', color: '#ffffff0f', category: 'other' },
  { title: 'Uber', url: 'https://uber.com', icon: 'UB', color: '#ffffff0f', category: 'other' }
]

const DEFAULT_FOLDERS: DefaultFolderSeed[] = [
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    color: '#007ACC',
    category: 'dev',
    items: [
      { title: 'GitHub', url: 'https://www.github.com', icon: 'GH', color: '#ffffff0f' },
      { title: 'CodePen', url: 'https://codepen.io', icon: 'CP', color: '#ffffff0f' },
      { title: 'NPM', url: 'https://www.npmjs.com', icon: 'NPM', color: '#ffffff0f' }
    ]
  },
  {
    id: 'web-frameworks',
    name: 'Web Frameworks',
    color: '#61DAFB',
    category: 'dev',
    items: [
      { title: 'React', url: 'https://react.dev', icon: 'R', color: '#ffffff0f' },
      { title: 'Next.js', url: 'https://nextjs.org', icon: 'NX', color: '#ffffff0f' },
      { title: 'TypeScript', url: 'https://www.typescriptlang.org', icon: 'TS', color: '#ffffff0f' },
      { title: 'Tailwind CSS', url: 'https://tailwindcss.com', icon: 'TW', color: '#ffffff0f' },
      { title: 'Bootstrap', url: 'https://getbootstrap.com', icon: 'BS', color: '#ffffff0f' },
      { title: 'Material UI', url: 'https://mui.com', icon: 'MUI', color: '#ffffff0f' },
      { title: 'Vue.js', url: 'https://vuejs.org', icon: 'V', color: '#ffffff0f' },
      { title: 'Angular', url: 'https://angular.io', icon: 'A', color: '#ffffff0f' },
      { title: 'Svelte', url: 'https://svelte.dev', icon: 'SV', color: '#ffffff0f' },
      { title: 'Ember.js', url: 'https://emberjs.com', icon: 'E', color: '#ffffff0f' },
      { title: 'Django', url: 'https://www.djangoproject.com', icon: 'DJ', color: '#ffffff0f' },
      { title: 'Flask', url: 'https://flask.palletsprojects.com', icon: 'FL', color: '#ffffff0f' },
      { title: 'Ruby on Rails', url: 'https://rubyonrails.org', icon: 'RR', color: '#ffffff0f' },
      { title: 'Spring', url: 'https://spring.io', icon: 'SP', color: '#ffffff0f' },
      { title: 'Laravel', url: 'https://laravel.com', icon: 'L', color: '#ffffff0f' },
      { title: 'ASP.NET', url: 'https://dotnet.microsoft.com/apps/aspnet', icon: 'ASPNET', color: '#ffffff0f' },
      { title: 'Express.js', url: 'https://expressjs.com', icon: 'EX', color: '#ffffff0f' }
    ]
  },
  {
    id: 'ai-resources',
    name: 'AI & Machine Learning',
    color: '#FF6F61',
    category: 'ai',
    items: [
      { title: 'Claude', url: 'https://claude.ai', icon: 'CL', color: '#ffffff0f' },
      { title: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI', color: '#ffffff0f' },
      { title: 'Hugging Face', url: 'https://huggingface.co', icon: 'HF', color: '#ffffff0f' },
      { title: 'Google AI', url: 'https://ai.google', icon: 'GA', color: '#ffffff0f' },
      { title: 'v0 by Vercel', url: 'https://v0.dev', icon: 'V0', color: '#ffffff0f' },
      { title: 'Bolt AI', url: 'https://bolt.ai', icon: 'BA', color: '#ffffff0f' },
      { title: 'Perplexity', url: 'https://perplexity.ai', icon: 'PP', color: '#ffffff0f' },
      { title: 'Midjourney', url: 'https://midjourney.com', icon: 'MJ', color: '#ffffff0f' },
      { title: 'Runway', url: 'https://runwayml.com', icon: 'RW', color: '#ffffff0f' },
      { title: 'Anthropic', url: 'https://anthropic.com', icon: 'AN', color: '#ffffff0f' },
      { title: 'Cohere', url: 'https://cohere.com', icon: 'CH', color: '#ffffff0f' },
      { title: 'Stability AI', url: 'https://stability.ai', icon: 'SA', color: '#ffffff0f' },
      { title: 'GPT-4 API', url: 'https://openai.com/api', icon: 'G4', color: '#ffffff0f' }
    ]
  }
]

function normalizeCategory(category: string) {
  return CATEGORY_LABELS[category.toLowerCase()] || category
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function makeBookmarkId(category: string, title: string) {
  return `default-${slugify(category)}-${slugify(title)}`
}

function isImageUrl(icon?: string) {
  return Boolean(icon && /^(https?:)?\/\//.test(icon))
}

function getFaviconUrl(url: string) {
  try {
    const hostname = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return undefined
  }
}

function migrateStoredBookmarks(bookmarks: Bookmark[]) {
  let changed = false

  const migrated = bookmarks.map((bookmark) => {
    if (!bookmark.icon || isImageUrl(bookmark.icon)) {
      return bookmark
    }

    const faviconUrl = getFaviconUrl(bookmark.url)
    if (!faviconUrl) {
      return bookmark
    }

    changed = true
    return {
      ...bookmark,
      icon: faviconUrl
    }
  })

  return { migrated, changed }
}

function createDefaultBookmarkData() {
  const folders: Folder[] = DEFAULT_FOLDERS.map((folder) => ({
    id: folder.id,
    name: folder.name,
    color: folder.color,
    category: normalizeCategory(folder.category)
  }))

  const folderBookmarks: Bookmark[] = DEFAULT_FOLDERS.flatMap((folder) =>
    folder.items.map((item) => ({
      id: makeBookmarkId(folder.id, item.title),
      title: item.title,
      url: item.url,
      icon: item.icon,
      color: item.color,
      category: normalizeCategory(folder.category),
      folderId: folder.id
    }))
  )

  const standaloneBookmarks: Bookmark[] = DEFAULT_BOOKMARKS.map((bookmark) => ({
    id: makeBookmarkId(bookmark.category, bookmark.title),
    title: bookmark.title,
    url: bookmark.url,
    icon: bookmark.icon,
    color: bookmark.color,
    category: normalizeCategory(bookmark.category)
  }))

  return {
    folders,
    bookmarks: [...standaloneBookmarks, ...folderBookmarks]
  }
}

interface BookmarksState {
  bookmarks: Bookmark[]
  folders: Folder[]
  apiList: ApiStatus[]
  devNotes: DevNote[]
  loadAll: () => Promise<void>
  addBookmark: (bookmark: Bookmark) => Promise<void>
  updateBookmark: (id: string, partial: Partial<Bookmark>) => Promise<void>
  deleteBookmark: (id: string) => Promise<void>
  addFolder: (folder: Folder) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
  addApi: (api: ApiStatus) => Promise<void>
  deleteApi: (id: string) => Promise<void>
  updateApiStatus: (id: string, status: ApiStatus['status']) => Promise<void>
  addNote: (note: DevNote) => Promise<void>
  toggleNote: (id: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  clearNotes: () => Promise<void>
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  folders: [],
  apiList: [],
  devNotes: [],

  loadAll: async () => {
    try {
      const data = await getStorageWithFallback<{
        bookmarks: Bookmark[]
        folders: Folder[]
        apiList: ApiStatus[]
        devNotes: DevNote[]
      }>(['bookmarks', 'folders', 'apiList', 'devNotes'], 'local', 'sync')
      const hasStoredBookmarks = Array.isArray(data?.bookmarks) && data.bookmarks.length > 0
      const hasStoredFolders = Array.isArray(data?.folders) && data.folders.length > 0
      const defaults = !hasStoredBookmarks && !hasStoredFolders ? createDefaultBookmarkData() : null
      const seededBookmarks = data?.bookmarks?.length ? data.bookmarks : defaults?.bookmarks || []
      const { migrated: bookmarks, changed: bookmarksMigrated } = migrateStoredBookmarks(seededBookmarks)
      const folders = data?.folders?.length ? data.folders : defaults?.folders || []

      set({
        bookmarks,
        folders,
        apiList: data?.apiList || [],
        devNotes: data?.devNotes || []
      })

      if (defaults || bookmarksMigrated) {
        await setStorage({ bookmarks, folders }, 'local')
      }
    } catch {
      // Keep defaults
    }
  },

  addBookmark: async (bookmark) => {
    const bookmarks = [...get().bookmarks, bookmark]
    set({ bookmarks })
    await setStorage({ bookmarks }, 'local')
  },

  updateBookmark: async (id, partial) => {
    const bookmarks = get().bookmarks.map(b =>
      b.id === id ? { ...b, ...partial } : b
    )
    set({ bookmarks })
    await setStorage({ bookmarks }, 'local')
  },

  deleteBookmark: async (id) => {
    const bookmarks = get().bookmarks.filter(b => b.id !== id)
    set({ bookmarks })
    await setStorage({ bookmarks }, 'local')
  },

  addFolder: async (folder) => {
    const folders = [...get().folders, folder]
    set({ folders })
    await setStorage({ folders }, 'local')
  },

  deleteFolder: async (id) => {
    const folders = get().folders.filter(f => f.id !== id)
    const bookmarks = get().bookmarks.map(b =>
      b.folderId === id ? { ...b, folderId: undefined } : b
    )
    set({ folders, bookmarks })
    await setStorage({ folders, bookmarks }, 'local')
  },

  addApi: async (api) => {
    const exists = get().apiList.some(a => a.id === api.id)
    if (exists) return
    const apiList = [...get().apiList, api]
    set({ apiList })
    await setStorage({ apiList }, 'local')
  },

  deleteApi: async (id) => {
    const apiList = get().apiList.filter(a => a.id !== id)
    set({ apiList })
    await setStorage({ apiList }, 'local')
  },

  updateApiStatus: async (id, status) => {
    const apiList = get().apiList.map(a =>
      a.id === id ? { ...a, status, lastChecked: Date.now() } : a
    )
    set({ apiList })
    await setStorage({ apiList }, 'local')
  },

  addNote: async (note) => {
    const devNotes = [note, ...get().devNotes]
    set({ devNotes })
    await setStorage({ devNotes }, 'local')
  },

  toggleNote: async (id) => {
    const devNotes = get().devNotes.map(n =>
      n.id === id ? { ...n, completed: !n.completed } : n
    )
    set({ devNotes })
    await setStorage({ devNotes }, 'local')
  },

  deleteNote: async (id) => {
    const devNotes = get().devNotes.filter(n => n.id !== id)
    set({ devNotes })
    await setStorage({ devNotes }, 'local')
  },

  clearNotes: async () => {
    set({ devNotes: [] })
    await setStorage({ devNotes: [] }, 'local')
  }
}))
