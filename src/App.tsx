import { useEffect, useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { Logo } from './components/ui/Logo'
import { useSettingsStore } from './stores/settingsStore'
import { useBookmarksStore } from './stores/bookmarksStore'
import { useSnippetsStore } from './stores/snippetsStore'
import { useDevShortcutsStore } from './stores/devShortcutsStore'
import { Clock } from './components/Clock/Clock'
import { Weather } from './components/Weather/Weather'
import { SearchBar } from './components/Search/SearchBar'
import { Bookmarks } from './components/Bookmarks/Bookmarks'
import { DevPanel } from './components/DevPanel/DevPanel'
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

function App() {
  const { settings, loadSettings, updateSettings } = useSettingsStore()
  const { loadAll: loadBookmarks } = useBookmarksStore()
  const { loadWorkspace } = useWorkspaceStore()
  const { loadSnippets } = useSnippetsStore()
  const { loadDevShortcuts } = useDevShortcutsStore()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [taskFocusRequest, setTaskFocusRequest] = useState(0)
  const [mounted, setMounted] = useState(false)

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

  const showWeather = settings.showWeatherWidget && !settings.focusMode
  const showBookmarks = settings.showBookmarks && !settings.focusMode
  const showDevPanel = settings.showDevPanel && settings.devPanelOpen && !settings.focusMode
  const showTerminalNotes = settings.showTerminalNotes && settings.terminalNotesOpen && !settings.focusMode
  const showQuickActions = settings.showQuickActions
  const showPinnedApps = settings.showPinnedApps && !settings.focusMode
  const showTaskPlanner = settings.showTaskPlanner && !settings.focusMode
  const showRecentActivity = settings.showRecentActivity && !settings.focusMode
  const showSnippetShelf = settings.showSnippetShelf && !settings.focusMode
  const showDevShortcuts = settings.showDevShortcuts && !settings.focusMode
  const hasSecondaryContent = showBookmarks || showDevPanel || showTerminalNotes || showPinnedApps || showTaskPlanner || showRecentActivity || showSnippetShelf || showDevShortcuts
  const centerHero = !hasSecondaryContent
  const contentLayoutClass = showTerminalNotes ? 'xl:pb-[22rem]' : ''

  const backgroundStyle = settings.background || settings.customBackground
    ? {
        backgroundImage: `url(${settings.customBackground || settings.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: settings.backgroundIntensity / 100,
        filter: settings.darkMode
          ? `blur(${settings.backgroundBlur}px) saturate(0.9)`
          : `blur(${Math.max(settings.backgroundBlur - 1, 0)}px) saturate(0.95)`,
        transform: 'scale(1.02)',
        pointerEvents: 'none',
      }
    : {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
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

      <div className="relative min-h-screen px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-6 sm:min-h-[calc(100vh-3rem)] lg:gap-8">
          <header className={`${centerHero ? 'pointer-events-none absolute inset-x-0 top-0 z-[100]' : ''} flex items-start justify-between gap-4`}>
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="card-glass inline-flex items-center gap-2 self-start px-3 py-2 text-xs font-medium text-[var(--text-secondary)]">
                <Logo className="h-4 w-4" />
              </div>
              {showWeather && <Weather />}
            </div>

            <div className={`z-[110] shrink-0 ${centerHero ? 'pointer-events-auto' : ''}`}>
              <Tooltip content="Settings" side="left">
                <button
                  onClick={() => setSettingsOpen(true)}
                  aria-label="Open settings"
                  className="icon-button card-glass h-12 w-12"
                >
                  <SettingsIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </Tooltip>
            </div>
          </header>

          <div className={`flex flex-1 flex-col ${centerHero ? 'justify-center' : `gap-6 lg:gap-8 ${contentLayoutClass}`}`}>
            <main className={`mx-auto flex w-full max-w-4xl flex-col items-center text-center ${centerHero ? 'flex-1 justify-center' : ''}`}>
              <Clock />
              <SearchBar />
              {showQuickActions && (
                <QuickActions
                  focusMode={settings.focusMode}
                  onOpenPalette={() => setCommandPaletteOpen(true)}
                  onOpenSettings={() => setSettingsOpen(true)}
                  onToggleFocusMode={() => void updateSettings({ focusMode: !settings.focusMode })}
                  onCreateTask={() => setTaskFocusRequest((value) => value + 1)}
                  onOpenHelp={() => setShortcutsOpen(true)}
                />
              )}
            </main>

            {showPinnedApps && <PinnedApps />}
            {showTaskPlanner && <TaskPlanner focusRequest={taskFocusRequest} />}
            {showRecentActivity && <RecentActivity />}
            {showDevShortcuts && <DevShortcuts />}
            {showSnippetShelf && <SnippetShelf />}

            {showBookmarks && (
              <div className="mx-auto grid w-full max-w-7xl gap-5">
                <Bookmarks />
              </div>
            )}
          </div>

          <div className="fixed bottom-4 right-4 z-40 hidden xl:block">
            {showDevPanel && <DevPanel />}
          </div>
          <div className="mx-auto hidden w-full max-w-4xl xl:hidden">
            {showDevPanel && <DevPanel />}
          </div>
          <div className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 xl:block">
            {showTerminalNotes && <TerminalNotes />}
          </div>
          <div className="mx-auto hidden w-full max-w-4xl xl:hidden">
            {showTerminalNotes && <TerminalNotes />}
          </div>

          <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
          <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} onOpenSettings={() => setSettingsOpen(true)} />
          <ShortcutsHelpModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        </div>
      </div>
    </div>
  )
}

export default App
