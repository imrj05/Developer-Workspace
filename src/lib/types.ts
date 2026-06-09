import type { LayoutPreset, UtilityPanel } from './layoutPresets'

export interface Settings {
  layoutPreset: LayoutPreset
  utilityPanel: UtilityPanel
  darkMode: boolean
  focusMode: boolean
  clockFormat: '12' | '24'
  background: string
  customBackground: string | null
  backgroundIntensity: number
  backgroundBlur: number
  timeZone: string
  showSeconds: boolean
  useFahrenheit: boolean
  githubUsername: string
  autoRotateBackgrounds: boolean
  showWeatherWidget: boolean
  showBookmarks: boolean
  bookmarksShowMostVisited: boolean
  showDevPanel: boolean
  showTerminalNotes: boolean
  showGitHubActivity: boolean
  showApiStatus: boolean
  showQuickDocs: boolean
  showPomodoroTimer: boolean
  showQuickActions: boolean
  showPinnedApps: boolean
  showTaskPlanner: boolean
  showRecentActivity: boolean
  showSnippetShelf: boolean
  showDevShortcuts: boolean
  weatherApiKey: string
  devPanelOpen: boolean
  terminalNotesOpen: boolean
  githubActivityCollapsed: boolean
  apiStatusCollapsed: boolean
  quickDocsCollapsed: boolean
  pomodoroTimerCollapsed: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  layoutPreset: 'developer',
  utilityPanel: 'none',
  darkMode: true,
  focusMode: false,
  clockFormat: '24',
  background: 'https://images.unsplash.com/photo-1572270907014-c31da1c54124?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80',
  customBackground: null,
  backgroundIntensity: 34,
  backgroundBlur: 3,
  timeZone: 'local',
  showSeconds: true,
  useFahrenheit: false,
  githubUsername: 'github',
  autoRotateBackgrounds: false,
  showWeatherWidget: true,
  showBookmarks: true,
  bookmarksShowMostVisited: true,
  showDevPanel: true,
  showTerminalNotes: true,
  showGitHubActivity: true,
  showApiStatus: true,
  showQuickDocs: true,
  showPomodoroTimer: true,
  showQuickActions: true,
  showPinnedApps: true,
  showTaskPlanner: true,
  showRecentActivity: true,
  showSnippetShelf: false,
  showDevShortcuts: true,
  weatherApiKey: '',
  devPanelOpen: false,
  terminalNotesOpen: false,
  githubActivityCollapsed: false,
  apiStatusCollapsed: false,
  quickDocsCollapsed: false,
  pomodoroTimerCollapsed: false
}

export interface Bookmark {
  id: string
  title: string
  url: string
  icon?: string
  color?: string
  category: string
  folderId?: string
  isChromeBookmark?: boolean
}

export interface Folder {
  id: string
  name: string
  icon?: string
  color?: string
  parentId?: string
  category?: string
}

export interface ApiStatus {
  id: string
  name: string
  url: string
  status: 'up' | 'degraded' | 'down' | 'unknown'
  lastChecked?: number
}

export interface DevNote {
  id: string
  content: string
  completed: boolean
  timestamp: number
}

export interface TaskItem {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

export interface PinnedApp {
  id: string
  title: string
  url: string
  description: string
  icon?: string
}

export interface Snippet {
  id: string
  title: string
  content: string
  language: string
  createdAt: number
}

export interface DevShortcut {
  id: string
  name: string
  url: string
  description: string
  category: 'local' | 'staging' | 'production' | 'tool'
}

export interface GithubEvent {
  type: string
  repo: string
  payload: {
    head?: string
    comment?: { body: string }
    description?: string
  }
  created_at: string
}
