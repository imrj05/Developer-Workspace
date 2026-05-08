import React, { useEffect, useState } from 'react'
import {
  Bookmark,
  Chrome,
  Clock,
  CloudSun,
  Github,
  Moon,
  Palette,
  Search,
  Sparkles,
  Sun,
  Terminal
} from 'lucide-react'
import appIcon from '../icons/icon128.png'

const product = {
  name: 'Developer Workspace',
  description: 'Transform your Chrome new tab into a focused developer dashboard with bookmarks, tools, weather, and customization.'
}

const featureGroups = [
  {
    icon: Clock,
    title: 'Clock And Weather',
    description: 'Customizable digital clock with 12/24-hour formats, optional seconds, multiple timezones, and local weather with Celsius or Fahrenheit.'
  },
  {
    icon: Bookmark,
    title: 'Smart Bookmarks',
    description: 'Organize Chrome bookmarks by category, add custom folders, search quickly, and surface most-visited sites with favicons.'
  },
  {
    icon: Terminal,
    title: 'Developer Tools Panel',
    description: 'Track GitHub activity, monitor API status, jump to docs, take terminal-style notes, and keep focus with a Pomodoro timer.'
  },
  {
    icon: Palette,
    title: 'Deep Customization',
    description: 'Switch dark or light mode, choose backgrounds, upload your own image, collapse sections, and toggle components on or off.'
  },
  {
    icon: Chrome,
    title: 'Chrome Integration',
    description: 'Uses Chrome bookmarks, history, most-visited data, search, notifications, and storage sync for a native extension workflow.'
  },
  {
    icon: Search,
    title: 'Fast New-Tab Search',
    description: 'Filter bookmarks, switch between bookmarks and most-visited sites, and search through Chrome’s default search engine.'
  }
]

const stats = [
  { value: '5', label: 'Workspace modules' },
  { value: 'Sync', label: 'Chrome storage' },
  { value: 'New tab', label: 'Extension surface' }
]

const privacyPoints = [
  'Built as a Chrome new-tab replacement',
  'Uses Chrome APIs for bookmarks, history, search, and sync',
  'Vanilla JavaScript foundation for fast extension performance'
]

const legalDocuments = {
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Privacy Policy',
    updated: 'Last updated: May 07, 2026',
    intro: 'Developer Workspace is designed to personalize your Chrome new tab with developer-focused tools, bookmarks, weather, and settings. This policy explains what information the extension handles and how it is protected.',
    sections: [
      {
        title: 'Information We Handle',
        body: 'The extension may store workspace preferences, bookmark organization, notes, background choices, and enabled feature settings locally or through Chrome sync when those features are enabled.'
      },
      {
        title: 'Local Storage And Sync',
        body: 'Settings are intended to stay in your browser profile and may sync through Chrome storage depending on your browser configuration.'
      },
      {
        title: 'Network Activity',
        body: 'The extension is designed around browser APIs and does not require analytics or advertising trackers. Weather, GitHub, or API-status integrations may request data only when those features are configured or enabled.'
      },
      {
        title: 'Chrome Data Access',
        body: 'Bookmark, history, most-visited, search, notification, and storage features use Chrome extension APIs so the workspace can show and organize your browser data.'
      },
      {
        title: 'Your Control',
        body: 'You can disable workspace components, reset settings, remove custom data, or clear extension storage through Chrome at any time.'
      },
      {
        title: 'Contact',
        body: 'For privacy questions or security reports, contact the project maintainer through the GitHub repository linked on this site.'
      }
    ]
  },
  terms: {
    eyebrow: 'Terms And Conditions',
    title: 'Terms and Conditions',
    updated: 'Last updated: May 07, 2026',
    intro: 'These terms describe the conditions for using Developer Workspace. By using this extension, you agree to use it responsibly and understand its limitations.',
    sections: [
      {
        title: 'Use Of The Extension',
        body: 'Developer Workspace is provided to help organize your new tab, bookmarks, notes, and developer utilities. You are responsible for deciding which integrations and browser permissions to enable.'
      },
      {
        title: 'No Warranty',
        body: 'The extension is provided as-is without warranties of any kind. We do not guarantee uninterrupted operation, compatibility with every browser, or availability of third-party data sources.'
      },
      {
        title: 'User Responsibility',
        body: 'You are responsible for keeping your device, browser profile, operating system, and connected accounts secure.'
      },
      {
        title: 'Acceptable Use',
        body: 'Do not use the extension for illegal activity, unauthorized access, scraping, abuse of third-party services, or any activity that violates another service provider’s terms.'
      },
      {
        title: 'Changes To These Terms',
        body: 'We may update these terms as the project changes. Continued use after updates means you accept the revised terms.'
      },
      {
        title: 'Contact',
        body: 'For questions about these terms, contact the project maintainer through the GitHub repository linked on this site.'
      }
    ]
  }
}

const LegalPage = ({ document }) => (
  <main className="min-h-screen bg-background text-foreground">
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between gap-4 border-b border-border/80 pb-6">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-border/80 bg-card shadow-sm">
            <img src={appIcon} alt="Developer Workspace" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">{product.name}</p>
            <p className="text-xs text-muted-foreground">Back to home</p>
          </div>
        </a>
      </header>

      <div className="flex-1 py-12">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{document.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">{document.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{document.updated}</p>
          <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg">{document.intro}</p>
        </div>

        <div className="space-y-4">
          {document.sections.map((section) => (
            <article key={section.title} className="rounded-sm border border-border/80 bg-card/80 p-5 shadow-sm">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border/80 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{product.name}</span>
        <div className="flex gap-4">
          <a href="/privacy" className="text-foreground transition-colors hover:text-primary">Privacy Policy</a>
          <a href="/terms" className="text-foreground transition-colors hover:text-primary">Terms</a>
        </div>
      </footer>
    </section>
  </main>
)

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const path = window.location.pathname
  const legalDocument = path === '/privacy' || path.endsWith('/privacy')
    ? legalDocuments.privacy
    : path === '/terms' || path.endsWith('/terms')
      ? legalDocuments.terms
      : null

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const next = isDarkMode ? 'light' : 'dark'
    const root = document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(next)
    root.setAttribute('data-theme', next)
    localStorage.setItem('vite-ui-theme', next)
    setIsDarkMode(next === 'dark')
  }

  if (legalDocument) {
    return <LegalPage document={legalDocument} />
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-border/80 bg-card shadow-sm">
              <img src={appIcon} alt="Developer Workspace" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">{product.name}</p>
              <p className="text-xs text-muted-foreground">Developer new-tab workspace</p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border/80 bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <CloudSun size={14} />
              Productive new-tab dashboard
            </div>

            <div className="max-w-3xl space-y-5">
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
                Turn every new tab into a focused developer workspace.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Developer Workspace brings clocks, weather, bookmarks, GitHub activity, API status, notes, Pomodoro focus, and Chrome search into one customizable dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-sm border border-border/80 bg-card/80 p-4 shadow-sm">
                  <div className="font-mono text-2xl font-semibold tracking-[-0.05em] text-foreground">{item.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-border/80 bg-card p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
            <div className="rounded-sm border border-border/80 bg-background/60 p-4">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Feature Overview</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">Extension features</h2>
                </div>
                <Sparkles className="text-primary" size={22} />
              </div>

              <div className="grid gap-3">
                {featureGroups.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="group rounded-sm border border-border/70 bg-card/70 p-4 transition-colors hover:border-primary/35">
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 border-t border-border/80 py-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Chrome size={17} className="text-primary" />
              Chrome-Native Workspace
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The extension is built around Chrome APIs, sync-friendly settings, fast local UI, and a responsive new-tab experience.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {privacyPoints.map((point) => (
              <div key={point} className="rounded-sm border border-border/80 bg-card/70 p-3 text-sm leading-5 text-muted-foreground">
                {point}
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-border/80 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{product.description}</span>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/privacy" className="text-foreground transition-colors hover:text-primary">Privacy Policy</a>
            <a href="/terms" className="text-foreground transition-colors hover:text-primary">Terms</a>
            <a
              href="https://github.com/imrj05/Developer-Workspace"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-primary"
            >
              <Github size={16} />
              GitHub
            </a>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default App
