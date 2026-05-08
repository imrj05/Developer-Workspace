function Hero() {
  return (
    <header className="relative isolate overflow-hidden px-5 pb-18 pt-8 sm:px-8 sm:pb-24 lg:px-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_5%,rgba(79,70,229,0.24),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.2),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.03),transparent_58%)] dark:bg-[radial-gradient(circle_at_20%_5%,rgba(129,140,248,0.26),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(236,72,153,0.2),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.78),rgba(15,23,42,0)_62%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-px w-[min(76rem,92vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent)]/60 to-transparent" />
      <div className="mx-auto max-w-7xl">
        <nav className="mb-16 flex items-center justify-between gap-5 pr-12 sm:mb-20 sm:pr-14" aria-label="Primary">
          <a href="/" className="flex items-center gap-3 text-[var(--text)]">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--text)] text-sm font-black text-[var(--bg)] shadow-[var(--shadow-sm)]">DW</span>
            <span className="text-sm font-bold tracking-[-0.03em] sm:text-base">Developer Workspace</span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] sm:flex">
            <a href="#features" className="transition hover:text-[var(--text)]">Features</a>
            <a href="#cta" className="transition hover:text-[var(--text)]">Install</a>
          </div>
        </nav>

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent)] shadow-[var(--shadow-sm)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Chrome extension for focused builders
          </div>

          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.07em] text-[var(--text)] sm:text-6xl lg:text-7xl xl:text-8xl">
            Launch a
            <span className="block bg-gradient-to-r from-[var(--accent)] via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              developer command center
            </span>
            every time you open a tab.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-xl">
            Replace the blank new tab with a high-signal workspace for bookmarks,
            GitHub activity, weather, timers, notes, and the tools you actually use all day.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://ggl.link/dev-workspace"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white shadow-[0_22px_70px_rgba(99,102,241,0.38)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] sm:px-7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Add to Chrome</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://git.new/dev-workspace-gh"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-6 py-3 text-sm font-bold text-[var(--text)] shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] sm:px-7"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Source Code</span>
            </a>
            <a
              href="#features"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              See what is inside
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-[var(--muted)] sm:text-sm">
            <span className="rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_64%,transparent)] px-3 py-1.5">Smart bookmarks</span>
            <span className="rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_64%,transparent)] px-3 py-1.5">GitHub activity</span>
            <span className="rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_64%,transparent)] px-3 py-1.5">Pomodoro timer</span>
            <span className="rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_64%,transparent)] px-3 py-1.5">Notes + tasks</span>
          </div>
        </div>

        <div className="mt-14 grid gap-5 lg:mt-18 lg:grid-cols-[1.28fr_0.72fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] p-2 shadow-[var(--shadow-hero)] backdrop-blur sm:rounded-[2rem] sm:p-3">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[var(--accent)]/20 via-fuchsia-500/10 to-cyan-400/20" />
            <div className="relative mb-2 flex items-center gap-2 px-3 py-2 text-xs text-[var(--muted)]">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 hidden rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] px-3 py-1 sm:inline">new-tab://developer-workspace</span>
            </div>
            <img
              src="/assets/screenshot-dark.png"
              alt="Developer Workspace screenshot"
              className="relative w-full rounded-[1.25rem] border border-white/10 object-cover sm:rounded-[1.4rem]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] p-5 shadow-[var(--shadow-sm)] backdrop-blur sm:rounded-[1.75rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Workflow Pulse</p>
              <h3 className="mt-3 text-lg font-semibold text-[var(--text)]">One tab. Zero context switching.</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Surface docs, repos, notes, and timers before your first keystroke.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(34,211,238,0.13))] p-5 shadow-[var(--shadow-sm)] sm:rounded-[1.75rem]">
              <p className="text-3xl font-black tracking-[-0.04em] text-[var(--text)]">4 core zones</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Bookmarks, productivity, live signals, and deep customization built into a single layout.</p>
            </div>
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] p-5 shadow-[var(--shadow-sm)] backdrop-blur sm:rounded-[1.75rem]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Built for momentum</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-black tracking-[-0.05em] text-[var(--text)]">Daily</span>
                <span className="pb-1 text-sm text-[var(--muted)]">new tab productivity engine</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Designed to turn your browser start state into a launchpad, not a distraction.</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
