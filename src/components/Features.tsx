const features = [
  {
    title: 'Clock And Weather',
    description:
      'Start with a customizable 12/24-hour clock, optional seconds, timezone support, and local weather with Celsius or Fahrenheit.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Smart Bookmarks',
    description:
      'Sync Chrome bookmarks, organize by category or folders, filter fast, and surface most-visited sites with favicons.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: 'Search And Commands',
    description:
      'Search with Chrome, jump through suggestions, open a command palette, and trigger quick actions from one place.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    title: 'Dev Panel',
    description:
      'Track GitHub activity, monitor API status, open quick docs, and run a Pomodoro timer without leaving the new tab.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </svg>
    ),
  },
  {
    title: 'Planner And Notes',
    description:
      'Keep daily tasks, terminal-style notes, snippets, and clipboard-ready commands close to the work you are doing.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'Pinned Apps And Dev Shortcuts',
    description:
      'Pin apps and organize local, staging, production, and tool URLs so common environments are one click away.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 7h3a5 5 0 0 1 0 10h-3" />
        <path d="M9 17H6A5 5 0 0 1 6 7h3" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    title: 'Focus Mode',
    description:
      'Collapse the noise when you need a clean screen, while keeping command, task, shortcut, and settings access nearby.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Deep Customization',
    description:
      'Toggle modules, choose dark or light mode, upload backgrounds, tune blur and intensity, and collapse sections.',
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
    <section id="features" className="py-14 sm:py-18">
      <div className="border-t border-border pt-16 sm:pt-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Features</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
              The full developer workflow, arranged for the first minute of every tab.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Pulled from the actual extension: Chrome APIs, workspace modules, quick actions, local preferences, and developer utilities.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-sm border border-border bg-surface/80 p-5 shadow-sm transition hover:border-accent/40 sm:p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-accent/10 text-accent transition group-hover:border-accent/40">
                {f.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
