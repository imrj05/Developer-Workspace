export default function Cta() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12" id="cta">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(99,102,241,0.18),rgba(236,72,153,0.14),rgba(34,211,238,0.12))] px-6 py-12 shadow-[var(--shadow-lg)] sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.24),_transparent_60%)] lg:block" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Ready to switch on</p>
              <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.055em] text-[var(--text)] sm:text-5xl">
                Turn every new tab into your team's sharpest launch screen.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Install Developer Workspace and start each session with high-value context instead of a blank page.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <a href="https://ggl.link/dev-workspace" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--text)] px-6 py-3 text-sm font-bold text-[var(--bg)] shadow-[0_20px_50px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                Add to Chrome
              </a>
              <span className="text-sm text-[var(--muted)]">Free to install. Built for daily use.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
