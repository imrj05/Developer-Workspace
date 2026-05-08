import ChromeIcon from './icons/ChromeIcon'

export default function Cta() {
  return (
    <section id="install" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:px-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Make your new tab worth opening.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
          Install Developer Workspace and start each browser session with the tools you already reach for.
        </p>
        <a
          href="https://ggl.link/dev-workspace"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-page transition hover:opacity-90 hover:-translate-y-0.5"
        >
          <ChromeIcon />
          Add to Chrome
        </a>
        <p className="mt-3 text-sm text-muted">Free install. No account required.</p>
      </div>
    </section>
  )
}
