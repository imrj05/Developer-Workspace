import ChromeIcon from './icons/ChromeIcon'

const stats = [
  { value: '12/24h', label: 'Clock formats' },
  { value: 'Chrome APIs', label: 'Bookmarks, history, search' },
  { value: 'Focus mode', label: 'Distraction-free layout' },
]

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          New tab workspace for developers
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
          Turn every new tab into a focused developer command center.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          Developer Workspace brings search, smart bookmarks, pinned apps, GitHub context, tasks, snippets, dev shortcuts, weather, and focus tools into one calm Chrome start screen.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="https://ggl.link/dev-workspace"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-sm bg-foreground px-5 text-sm font-semibold text-page transition hover:opacity-90 hover:-translate-y-0.5"
          >
            <ChromeIcon />
            Add to Chrome
          </a>
          <a
            href="https://github.com/imrj05/Developer-Workspace"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent hover:-translate-y-0.5"
          >
            <GitHubIcon />
            Source Code
          </a>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-sm border border-border bg-surface/80 p-4 shadow-sm">
              <div className="font-mono text-xl font-semibold tracking-[-0.04em] text-foreground">{item.value}</div>
              <div className="mt-1 text-xs text-muted">{item.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">Free to install. Private by default. Built for daily developer routines.</p>
      </div>

      <div className="rounded-sm border border-border bg-surface p-4 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="rounded-sm border border-border bg-page/60 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">Workspace Stack</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">Everything on the first tab</h2>
            </div>
            <span className="rounded-sm bg-accent/10 px-2 py-1 font-mono text-xs font-semibold text-accent">/</span>
          </div>
          <div className="grid gap-3">
            {[
              ['Search + Suggestions', 'Chrome search with bookmark and pinned app suggestions.'],
              ['Planner + Focus', 'Quick actions, focus mode, task planner, and shortcuts help.'],
              ['Dev Utilities', 'GitHub activity, API status, quick docs, Pomodoro, and terminal notes.'],
              ['Personal Toolkit', 'Pinned apps, snippets, dev shortcuts, recent activity, and custom backgrounds.'],
            ].map(([title, description]) => (
              <article key={title} className="rounded-sm border border-border bg-surface/70 p-4 transition hover:border-accent/35">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
