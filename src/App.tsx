import { useEffect, useState } from 'react'
import { Settings as SettingsIcon, Zap } from 'lucide-react'
import headerIcon from '../icons/icon-48.png'
import { useSettingsStore } from './stores/settingsStore'
import { useBookmarksStore } from './stores/bookmarksStore'
import { useSnippetsStore } from './stores/snippetsStore'
import { useDevShortcutsStore } from './stores/devShortcutsStore'
import { Clock } from './components/Clock/Clock'
import { Weather } from './components/Weather/Weather'
import { SearchBar } from './components/Search/SearchBar'
import { Bookmarks } from './components/Bookmarks/Bookmarks'
import { TerminalNotes } from './components/TerminalNotes/TerminalNotes'
import { Settings } from './components/Settings/Settings'
import { Tooltip } from './components/ui/Tooltip'
import { useWorkspaceStore } from './stores/workspaceStore'
import { QuickActions } from './components/QuickActions/QuickActions'
import { PinnedApps } from './components/PinnedApps/PinnedApps'
import { TaskPlanner } from './components/Tasks/TaskPlanner'
import { CommandPalette } from './components/CommandPalette/CommandPalette'
import { ShortcutsHelpModal } from './components/Help/ShortcutsHelpModal'
import { RecentActivity } from './components/RecentActivity/RecentActivity'
import { SnippetShelf } from './components/Snippets/SnippetShelf'
import { DevShortcuts } from './components/DevShortcuts/DevShortcuts'
import { UtilityDock } from './components/UtilityDock/UtilityDock'
import { DevPanel } from './components/DevPanel/DevPanel'
import type { SettingsTab } from './lib/layoutPresets'

function App() {
  const { settings, loadSettings, updateSettings } = useSettingsStore()
  const { loadAll: loadBookmarks } = useBookmarksStore()
  const { loadWorkspace } = useWorkspaceStore()
  const { loadSnippets } = useSnippetsStore()
  const { loadDevShortcuts } = useDevShortcutsStore()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('appearance')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [taskFocusRequest, setTaskFocusRequest] = useState(0)
  const [mounted, setMounted] = useState(false)

  const openSettings = (tab: SettingsTab = 'appearance') => {
    setSettingsTab(tab)
    setSettingsOpen(true)
  }

  useEffect(() => {
    loadSettings()
    loadBookmarks()
    loadWorkspace()
    loadSnippets()
    loadDevShortcuts()
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light')
    }
  }, [settings.darkMode, mounted])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingTarget = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable

      if (event.key === '?' && !isTypingTarget && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        setShortcutsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const showWeather = settings.showWeatherWidget && !settings.focusMode
  const showBookmarks = settings.showBookmarks && !settings.focusMode
  const showDevPanel = settings.showDevPanel && !settings.focusMode
  const showTerminalNotes = settings.showTerminalNotes && !settings.focusMode
  const showQuickActions = settings.showQuickActions
  const showPinnedApps = settings.showPinnedApps && !settings.focusMode
  const showTaskPlanner = settings.showTaskPlanner && !settings.focusMode
  const showRecentActivity = settings.showRecentActivity && !settings.focusMode
  const showSnippetShelf = settings.showSnippetShelf && !settings.focusMode
  const showDevShortcuts = settings.showDevShortcuts && !settings.focusMode
  const hasSecondaryContent = showBookmarks || showTerminalNotes || showPinnedApps || showTaskPlanner || showRecentActivity || showSnippetShelf || showDevShortcuts
  const centerHero = !hasSecondaryContent
  const terminalNotesOpen = showTerminalNotes && settings.utilityPanel === 'terminal-notes'
  const bottomPaddingClass = terminalNotesOpen ? 'pb-28 sm:pb-32' : ''

  const backgroundStyle = settings.background || settings.customBackground
    ? {
        backgroundImage: `url(${settings.customBackground || settings.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        opacity: settings.backgroundIntensity / 100,
        filter: settings.darkMode
          ? `blur(${settings.backgroundBlur}px) saturate(0.9)`
          : `blur(${Math.max(settings.backgroundBlur - 1, 0)}px) saturate(0.95)`,
        transform: 'scale(1.02)',
        pointerEvents: 'none' as const,
      }
    : {
        width: '100vw',
        height: '100vh',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        pointerEvents: 'none' as const,
      }

  return (
    <div className="app-shell relative min-h-dvh overflow-x-hidden">
      <div aria-hidden="true" style={backgroundStyle} />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background: settings.darkMode
            ? 'linear-gradient(180deg, rgba(11, 15, 13, 0.62) 0%, rgba(11, 15, 13, 0.78) 100%)'
            : 'linear-gradient(180deg, rgba(251, 252, 250, 0.48) 0%, rgba(245, 247, 244, 0.68) 100%)'
        }}
      />

      <DevPanel />

      <div className={`relative min-h-dvh px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 ${bottomPaddingClass}`}>
        <div className="workspace-column relative flex min-h-[calc(100vh-2rem)] flex-col gap-5 sm:min-h-[calc(100vh-3rem)] sm:gap-6">
          <header className={`${centerHero ? 'pointer-events-none absolute inset-x-0 top-0 z-[100]' : ''} flex w-full items-center justify-between gap-3`}>
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="header-brand pointer-events-auto">
                <img src={headerIcon} alt="Developer Workspace" className="header-brand-icon" width={36} height={36} />
              </div>
              {showWeather && <Weather onOpenSettings={() => openSettings('integrations')} />}
            </div>

            <div className={`z-[110] flex shrink-0 items-center gap-1.5 ${centerHero ? 'pointer-events-auto' : ''}`}>
              {settings.focusMode && (
                <div className="panel hidden items-center gap-1.5 !px-3 !py-2 text-xs font-medium text-[var(--accent)] sm:inline-flex">
                  <Zap aria-hidden="true" className="h-3.5 w-3.5" />
                  Focus
                </div>
              )}
              <Tooltip content="Settings" side="left">
                <button
                  onClick={() => openSettings('appearance')}
                  aria-label="Open settings"
                  className="icon-button h-10 w-10"
                >
                  <SettingsIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
          </header>

          <div className={`flex w-full flex-1 flex-col ${centerHero ? 'justify-center' : 'gap-4 sm:gap-5'}`}>
            <main className={`flex w-full flex-col items-center text-center ${centerHero ? 'flex-1 justify-center' : ''}`}>
              <section
                className={`hero-stack w-full ${settings.focusMode ? 'hero-stack--focus' : ''} ${centerHero ? 'hero-stack--minimal' : ''}`}
                aria-label="Time and search"
              >
                <Clock focusMode={settings.focusMode || centerHero} />
                <SearchBar embedded />
                {showQuickActions && (
                  <QuickActions
                    focusMode={settings.focusMode}
                    onOpenPalette={() => setCommandPaletteOpen(true)}
                    onToggleFocusMode={() => void updateSettings({ focusMode: !settings.focusMode })}
                    onCreateTask={() => setTaskFocusRequest((value) => value + 1)}
                    onOpenHelp={() => setShortcutsOpen(true)}
                  />
                )}
              </section>
            </main>

            {!settings.focusMode && (
              <div className="content-stack">
                {(showPinnedApps || showTaskPlanner) && (
                  <div className="content-grid">
                    {showTaskPlanner && <TaskPlanner focusRequest={taskFocusRequest} />}
                    {showPinnedApps && <PinnedApps />}
                  </div>
                )}
                {showRecentActivity && <RecentActivity />}
                {showDevShortcuts && <DevShortcuts />}
                {showSnippetShelf && <SnippetShelf />}
                {showBookmarks && <Bookmarks />}
              </div>
            )}
          </div>

          <div className="xl:hidden">
            {terminalNotesOpen && <TerminalNotes />}
          </div>

          <UtilityDock />

          <Settings open={settingsOpen} onOpenChange={setSettingsOpen} initialTab={settingsTab} />
          <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} onOpenSettings={() => openSettings('layout')} />
          <ShortcutsHelpModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        </div>
      </div>
    </div>
  )
}

export default App
