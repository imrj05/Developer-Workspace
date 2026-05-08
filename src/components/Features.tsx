const features = [
  {
    title: 'Smart Bookmarks',
    description:
      'Organize dev resources into folders, categories, and fast-launch shortcuts without the usual bookmark sprawl.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Productivity Tools',
    description:
      'Use the built-in Pomodoro timer, terminal notes, and quick tasks to keep execution moving.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Smart Features',
    description:
      'See GitHub activity, weather, and time data right when you open a tab instead of chasing separate tools.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  },
  {
    title: 'Customization',
    description:
      'Tune the layout with themes, backgrounds, and visibility controls so the dashboard matches how you work.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="border-t border-border pt-16 sm:pt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Features</p>
            <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Everything useful, nothing noisy.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            A focused workspace for the first minute of every browsing session: open, orient, and keep moving.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-surface p-6 transition hover:border-accent/40 sm:p-7"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-accent transition group-hover:border-accent/40">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
