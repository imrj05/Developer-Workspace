import React, { useState } from 'react'
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Chrome,
  Clock3,
  CloudSun,
  Code2,
  Github,
  Menu,
  Moon,
  Palette,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  TimerReset,
  X
} from 'lucide-react'
import appLogo from '../icons/logo.png'
import workspaceHome from './assets/screenshots/workspace-home.png'
import workspaceHomeLight from './assets/screenshots/workspace-home-light.png'
import workspaceSettings from './assets/screenshots/workspace-settings.png'
import workspaceSettingsLight from './assets/screenshots/workspace-settings-light.png'
import workspaceTools from './assets/screenshots/workspace-tools.png'
import workspaceToolsLight from './assets/screenshots/workspace-tools-light.png'

const chromeStoreUrl = 'https://chromewebstore.google.com/detail/developer-workspace/cpanceigffhbacpiiamibppnbbaiaghg'

const product = {
  name: 'Developer Workspace',
  description: 'A customizable Chrome new-tab workspace for bookmarks, weather, GitHub activity, notes, and focus tools.'
}

const featureGroups = [
  {
    icon: Bookmark,
    title: 'Smart bookmarks',
    description: 'Organize every useful link into colorful categories, sync Chrome bookmarks, and find anything instantly.',
    color: 'blue'
  },
  {
    icon: CloudSun,
    title: 'Weather and time',
    description: 'Start every tab with local weather, a flexible clock, and multiple timezone support.',
    color: 'amber'
  },
  {
    icon: Github,
    title: 'Developer activity',
    description: 'Keep GitHub activity, API status, documentation, and daily developer resources close.',
    color: 'violet'
  },
  {
    icon: TimerReset,
    title: 'Built-in focus',
    description: 'Use the Pomodoro timer, quick notes, and desktop reminders without leaving your workflow.',
    color: 'rose'
  },
  {
    icon: Search,
    title: 'One fast search',
    description: 'Search the web, filter your bookmarks, and jump to frequently used tools from one place.',
    color: 'cyan'
  },
  {
    icon: Palette,
    title: 'Make it yours',
    description: 'Choose themes, backgrounds, visible modules, time formats, and layouts that fit your day.',
    color: 'green'
  }
]

const setupSteps = [
  {
    number: '01',
    title: 'Add it to Chrome',
    description: 'Install Developer Workspace from the Chrome Web Store in one click.'
  },
  {
    number: '02',
    title: 'Open a new tab',
    description: 'Your new developer dashboard is ready the moment you open your next tab.'
  },
  {
    number: '03',
    title: 'Shape your workspace',
    description: 'Choose your modules, import bookmarks, and tune the look to match your workflow.'
  }
]

const productScreenshots = [
  {
    darkSrc: workspaceTools,
    lightSrc: workspaceToolsLight,
    title: 'Everything organized',
    description: 'Recent activity, developer shortcuts, and saved bookmarks stay easy to reach.',
    alt: 'Developer Workspace dashboard showing recent sites, developer shortcuts, and bookmarks'
  },
  {
    darkSrc: workspaceSettings,
    lightSrc: workspaceSettingsLight,
    title: 'Personalize every detail',
    description: 'Switch themes, choose backgrounds, and tune the workspace to your preferences.',
    alt: 'Developer Workspace settings panel with appearance and wallpaper controls'
  }
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

const ChromeButton = ({ compact = false }) => (
  <a
    href={chromeStoreUrl}
    target="_blank"
    rel="noopener noreferrer"
    className={`chrome-button ${compact ? 'chrome-button-compact' : ''}`}
  >
    <Chrome size={compact ? 18 : 20} />
    Add to Chrome
    {compact ? null : <ArrowRight size={18} />}
  </a>
)

const Logo = () => (
  <a href="/" className="flex items-center gap-3" aria-label="Developer Workspace home">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/10">
      <img src={appLogo} alt="" className="h-7 w-7 object-contain" />
    </span>
    <span className="text-sm font-semibold tracking-[-0.02em] sm:text-base">{product.name}</span>
  </a>
)

const LegalPage = ({ document }) => (
  <main className="min-h-screen bg-background text-foreground">
    <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <header className="flex items-center justify-between gap-4 border-b border-border/80 pb-6">
        <Logo />
        <a href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Back to home</a>
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
            <article key={section.title} className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </section>
  </main>
)

const ProductPreview = ({ isDarkMode }) => (
  <div className="product-preview-shell">
    <div className="browser-bar">
      <div className="flex gap-1.5">
        <span className="browser-dot bg-[#ff5f57]" />
        <span className="browser-dot bg-[#febc2e]" />
        <span className="browser-dot bg-[#28c840]" />
      </div>
      <div className="browser-address">
        <ShieldCheck size={12} />
        New tab
      </div>
      <Menu size={15} className="text-slate-400" />
    </div>
    <img
      src={isDarkMode ? workspaceHome : workspaceHomeLight}
      alt="Developer Workspace new tab showing a large clock, search, focus controls, and custom color palette"
      className="product-preview-image"
      width="800"
      height="500"
      fetchPriority="high"
    />
  </div>
)

const ThemeButton = ({ isDarkMode, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-[#b9e4ce] hover:text-[#58ad81] dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
    aria-label="Toggle color theme"
  >
    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
  </button>
)

const Footer = () => (
  <footer className="flex flex-col gap-5 border-t border-border/80 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <img src={appLogo} alt="" className="h-7 w-7 object-contain" />
      <span>© 2026 Developer Workspace</span>
    </div>
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <a href="/privacy" className="transition-colors hover:text-foreground">Privacy</a>
      <a href="/terms" className="transition-colors hover:text-foreground">Terms</a>
      <a
        href="https://github.com/imrj05/Developer-Workspace"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <Github size={15} />
        GitHub
      </a>
    </div>
  </footer>
)

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'))
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const path = window.location.pathname
  const legalDocument = path === '/privacy' || path.endsWith('/privacy')
    ? legalDocuments.privacy
    : path === '/terms' || path.endsWith('/terms')
      ? legalDocuments.terms
      : null

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
    <main className="landing-page min-h-screen overflow-hidden bg-background text-foreground">
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#features" className="transition-colors hover:text-[#58ad81]">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-[#58ad81]">How it works</a>
          <a href="#privacy" className="transition-colors hover:text-[#58ad81]">Privacy</a>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <ThemeButton isDarkMode={isDarkMode} onClick={toggleTheme} />
          <ChromeButton compact />
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm sm:hidden dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {isMenuOpen ? (
          <div className="absolute left-5 right-5 top-[72px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:hidden dark:border-white/10 dark:bg-slate-900">
            <nav className="grid gap-1 text-sm font-medium">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Features</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">How it works</a>
              <a href="#privacy" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5">Privacy</a>
            </nav>
            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-white/10">
              <ThemeButton isDarkMode={isDarkMode} onClick={toggleTheme} />
              <ChromeButton compact />
            </div>
          </div>
        ) : null}
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="hero-badge">
            <Sparkles size={14} />
            Your new tab, upgraded
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            Your browser,
            <span className="block text-[#58ad81] dark:text-[#8ed8b2]">built for focus.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg lg:mx-0">
            Turn every new tab into a calm developer workspace with bookmarks, weather, GitHub activity, quick notes, and focus tools.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <ChromeButton />
            <a href="#features" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:text-[#58ad81] dark:text-slate-200">
              Explore features
              <ChevronRight size={17} />
            </a>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 lg:justify-start dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Free to install</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> No data collection</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> 5.0 Chrome rating</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="preview-aura" />
          <ProductPreview isDarkMode={isDarkMode} />
          <div className="floating-chip floating-chip-left">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><ShieldCheck size={16} /></span>
            <span><b>Private by design</b><small>Your data stays yours</small></span>
          </div>
          <div className="floating-chip floating-chip-right">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e4f5ec] text-[#58ad81]"><Clock3 size={16} /></span>
            <span><b>Ready in seconds</b><small>Just open a new tab</small></span>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-y border-slate-200/80 bg-white/60 py-7 backdrop-blur dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 text-sm font-medium text-slate-500 sm:px-8 lg:px-10 dark:text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Everything in one tab</span>
          <span className="inline-flex items-center gap-2"><Bookmark size={16} /> Bookmarks</span>
          <span className="inline-flex items-center gap-2"><Github size={16} /> GitHub</span>
          <span className="inline-flex items-center gap-2"><CloudSun size={16} /> Weather</span>
          <span className="inline-flex items-center gap-2"><TimerReset size={16} /> Focus</span>
          <span className="inline-flex items-center gap-2"><Code2 size={16} /> Dev tools</span>
        </div>
      </section>

      <section id="features" className="section-shell">
        <div className="section-heading">
          <p className="section-eyebrow">Feature snapshot</p>
          <h2>Everything you need to start building.</h2>
          <p>A clean home for the small tools and important links that keep your day moving.</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map(({ icon: Icon, title, description, color }) => (
            <article key={title} className="feature-card">
              <span className={`feature-icon feature-icon-${color}`}><Icon size={21} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
              <a href={chromeStoreUrl} target="_blank" rel="noopener noreferrer" aria-label={`Try ${title}`} className="feature-link">
                Try it in Chrome <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="product-gallery-section">
        <div className="section-shell">
          <div className="section-heading">
            <p className="section-eyebrow">Inside the workspace</p>
            <h2>Designed around the way developers work.</h2>
            <p>Move from a calm starting point to the tools, links, and customization you need without breaking focus.</p>
          </div>

          <div className="product-gallery">
            {productScreenshots.map((screenshot) => (
              <article key={screenshot.title} className="screenshot-card">
                <div className="screenshot-frame">
                  <div className="screenshot-frame-bar">
                    <span />
                    <span />
                    <span />
                  </div>
                  <img
                    src={isDarkMode ? screenshot.darkSrc : screenshot.lightSrc}
                    alt={screenshot.alt}
                    width="800"
                    height="500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="screenshot-copy">
                  <h3>{screenshot.title}</h3>
                  <p>{screenshot.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200/80 bg-slate-50/80 dark:border-white/10 dark:bg-white/[0.025]">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div className="section-heading text-left">
              <p className="section-eyebrow">Start in seconds</p>
              <h2>From install to focused in three steps.</h2>
              <p className="mx-0">No account, complicated setup, or onboarding maze. Add the extension and make the next tab your own.</p>
              <div className="mt-7"><ChromeButton compact /></div>
            </div>

            <div className="grid gap-4">
              {setupSteps.map((step) => (
                <article key={step.number} className="step-card">
                  <span>{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <ChevronRight className="ml-auto hidden text-slate-300 sm:block" size={21} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="privacy" className="section-shell">
        <div className="privacy-card">
          <div className="privacy-icon"><ShieldCheck size={32} /></div>
          <div className="max-w-2xl">
            <p className="section-eyebrow">Privacy comes standard</p>
            <h2>Your workspace stays your workspace.</h2>
            <p>Developer Workspace does not collect or sell your data. Preferences are stored locally or through Chrome sync, and you stay in control of every module.</p>
          </div>
          <div className="privacy-points">
            <span><Check size={16} /> No analytics trackers</span>
            <span><Check size={16} /> No advertising profile</span>
            <span><Check size={16} /> Clear your data anytime</span>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <div className="cta-card mx-auto max-w-7xl">
          <div>
            <p className="text-sm font-semibold text-[#dff4e9]">A better new tab is one click away.</p>
            <h2>Make room for your best work.</h2>
            <p>Join developers using a calmer, more useful start to every browser session.</p>
          </div>
          <ChromeButton />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <Footer />
      </div>
    </main>
  )
}

export default App
