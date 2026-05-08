import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Cta from './components/Cta'
import Footer from './components/Footer'

const localFirstPoints = [
  'Chrome Storage keeps workspace preferences local to the browser profile',
  'Bookmarks, history, top sites, and search use Chrome extension APIs',
  'Every module can be toggled so focus mode stays clean when needed',
]

const legalDocuments = {
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'Privacy Policy',
    updated: 'Last updated: May 08, 2026',
    intro:
      'Developer Workspace is a Chrome new tab extension built to keep your workspace preferences and productivity data under your control. This policy explains what the extension handles and why.',
    sections: [
      {
        title: 'Information The Extension Handles',
        body:
          'Developer Workspace may access Chrome bookmarks, top sites, browsing history metadata, search, geolocation, notifications, and locally saved settings only to power features you use in the new tab workspace.',
      },
      {
        title: 'Local Storage And Sync',
        body:
          'Workspace settings, visibility toggles, pinned apps, tasks, snippets, notes, and shortcuts are stored with Chrome storage APIs. This keeps preferences available in your browser profile and, where Chrome sync is enabled, across signed-in Chrome devices.',
      },
      {
        title: 'Bookmarks, History, And Top Sites',
        body:
          'Bookmark, history, and top-site access is used to display smart bookmarks, recent activity, search suggestions, and most-visited shortcuts. The extension does not sell this information or use it for advertising.',
      },
      {
        title: 'Weather And GitHub Features',
        body:
          'If enabled, weather uses your location or configured weather settings to show local weather. GitHub activity uses the GitHub API and the username you configure. These features are optional and can be disabled from settings.',
      },
      {
        title: 'Network Activity',
        body:
          'The extension is designed without analytics, advertising trackers, or behavioral profiling. Network requests are limited to user-facing integrations such as GitHub activity, API status checks, weather, and links you open.',
      },
      {
        title: 'Your Control',
        body:
          'You can disable individual modules, clear extension data from Chrome settings, reset workspace settings, or uninstall the extension at any time. Optional features stay controlled by your settings.',
      },
      {
        title: 'Contact',
        body:
          'For privacy questions or security reports, contact the maintainer through the Developer Workspace GitHub repository.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms And Conditions',
    title: 'Terms and Conditions',
    updated: 'Last updated: May 08, 2026',
    intro:
      'These terms describe the conditions for using Developer Workspace. By using the extension or landing page, you agree to use it responsibly and understand its limitations.',
    sections: [
      {
        title: 'Use Of The Extension',
        body:
          'Developer Workspace is provided to help organize your Chrome new tab with productivity tools, bookmarks, search, tasks, notes, snippets, and developer shortcuts. You are responsible for how you configure and use it.',
      },
      {
        title: 'Chrome Permissions',
        body:
          'The extension requests browser permissions needed for its features, including storage, bookmarks, geolocation, notifications, search, history, and top sites. You should only enable and use features you are comfortable with.',
      },
      {
        title: 'Third-Party Services',
        body:
          'Features such as GitHub activity, API status checks, weather, external documentation links, and user-added shortcuts may connect to third-party services. Those services are governed by their own terms and privacy policies.',
      },
      {
        title: 'No Warranty',
        body:
          'Developer Workspace is provided as-is without warranties of any kind. We do not guarantee uninterrupted operation, compatibility with every Chromium browser, or complete accuracy of external service data.',
      },
      {
        title: 'User Responsibility',
        body:
          'You are responsible for keeping your browser profile, device, accounts, API keys, and saved links secure. Do not store sensitive secrets in notes, snippets, or shortcuts unless you understand the risks.',
      },
      {
        title: 'Acceptable Use',
        body:
          'Do not use Developer Workspace for unauthorized access, credential theft, abuse of third-party APIs, illegal activity, or activity that violates another service provider\'s terms.',
      },
      {
        title: 'Changes To These Terms',
        body:
          'These terms may be updated as the project changes. Continued use after updates means you accept the revised terms.',
      },
    ],
  },
}

type LegalDocument = typeof legalDocuments.privacy

function LegalPage({ document }: { document: LegalDocument }) {
  return (
    <>
      <header className="border-b border-border pb-6">
        <a href="/" className="inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-sm border border-border bg-surface shadow-sm">
            <img src="/assets/logo.png" alt="Developer Workspace" className="h-7 w-7 object-contain" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">Developer Workspace</span>
            <span className="block text-xs text-muted">Back to home</span>
          </span>
        </a>
      </header>

      <main className="flex-1 py-12">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{document.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">{document.title}</h1>
          <p className="mt-4 text-sm text-muted">{document.updated}</p>
          <p className="mt-6 text-base leading-7 text-muted sm:text-lg">{document.intro}</p>
        </div>

        <div className="space-y-4">
          {document.sections.map((section) => (
            <article key={section.title} className="rounded-sm border border-border bg-surface/80 p-5 shadow-sm">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{section.body}</p>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="fixed top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface/80 text-muted shadow-sm backdrop-blur-md transition hover:border-accent hover:text-accent hover:-translate-y-0.5"
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

function App() {
  const path = typeof window === 'undefined' ? '/' : window.location.pathname
  const legalDocument = path === '/privacy' || path.endsWith('/privacy')
    ? legalDocuments.privacy
    : path === '/terms' || path.endsWith('/terms')
      ? legalDocuments.terms
      : null

  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="min-h-screen bg-page text-foreground">
      <ThemeToggle dark={dark} onToggle={() => setDark((v) => !v)} />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        {legalDocument ? (
          <LegalPage document={legalDocument} />
        ) : (
          <>
            <Navbar />
            <main className="flex-1">
              <Hero />
              <Features />
              <section className="grid gap-4 border-t border-border py-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                    Local-First Workspace
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Simple sections, product-led feature cards, and a clear trust strip like the reference landing page.
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {localFirstPoints.map((point) => (
                    <div key={point} className="rounded-sm border border-border bg-surface/70 p-3 text-sm leading-5 text-muted">
                      {point}
                    </div>
                  ))}
                </div>
              </section>
              <Cta />
            </main>
            <Footer />
          </>
        )}
      </div>
    </div>
  )
}

export default App
