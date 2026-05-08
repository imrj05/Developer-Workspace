import ChromeIcon from './icons/ChromeIcon'

export default function Cta() {
  return (
    <section id="install" className="py-14 sm:py-20">
      <div className="grid gap-8 rounded-sm border border-border bg-surface px-6 py-10 shadow-sm sm:px-10 sm:py-14 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Ready when you are</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
          Install the Chrome extension and make your new tab useful again.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Developer Workspace is built for the routines developers repeat all day: search, open project links, check status, capture notes, plan work, and stay focused.
        </p>
        <a
          href="https://ggl.link/dev-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-sm bg-foreground px-5 text-sm font-semibold text-page transition hover:opacity-90 hover:-translate-y-0.5"
        >
          <ChromeIcon />
          Add to Chrome
        </a>
        <p className="mt-3 text-sm text-muted">Free install. No account required for the core workspace.</p>
        </div>

        <div className="grid gap-2 text-sm text-muted">
          {['Chrome bookmarks sync', 'Most visited and history integration', 'Local settings with Chrome Storage', 'Dark/light mode and custom backgrounds'].map((point) => (
            <div key={point} className="rounded-sm border border-border bg-page/70 p-3">
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
