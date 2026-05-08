export default function Cta() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12" id="cta">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center sm:px-10 sm:py-14">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.055em] text-foreground sm:text-5xl">
            Make your new tab worth opening.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
            Install Developer Workspace and start each browser session with the tools you already reach for.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <a href="https://ggl.link/dev-workspace" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-page transition hover:-translate-y-0.5 hover:opacity-90" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="#fff" />
                <path fill="#ea4335" d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L4.2 3.5A9.96 9.96 0 0 1 12 2Z" />
                <path fill="#fbbc04" d="M4.2 3.5 7.67 9.5A5 5 0 0 0 12 17l-3.46 6A10 10 0 0 1 4.2 3.5Z" />
                <path fill="#34a853" d="M8.54 23 12 17a5 5 0 0 0 4.33-2.5h6.93A10 10 0 0 1 8.54 23Z" />
                <path fill="#4285f4" d="M23.26 14.5h-6.93A5 5 0 0 0 12 7h8.66A9.95 9.95 0 0 1 23.26 14.5Z" />
                <circle cx="12" cy="12" r="3" fill="#4285f4" />
              </svg>
              Add to Chrome
            </a>
            <span className="text-sm text-muted">Free install. No account required.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
