import ChromeIcon from './icons/ChromeIcon'

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 text-center sm:px-8 sm:pt-20 lg:pt-24">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Chrome Extension for Developers
      </span>

      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        A calmer new tab for your development workflow.
      </h1>

      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        Developer Workspace keeps bookmarks, GitHub context, notes, weather, and focus tools in one clean start screen.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href="https://ggl.link/dev-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-page transition hover:opacity-90 hover:-translate-y-0.5"
        >
          <ChromeIcon />
          Add to Chrome
        </a>
        <a
          href="https://git.new/dev-workspace-gh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent hover:-translate-y-0.5"
        >
          <GitHubIcon />
          Source Code
        </a>
      </div>

      <p className="mt-4 text-sm text-muted">Free to install. Private by default. Built for daily use.</p>
    </section>
  )
}
