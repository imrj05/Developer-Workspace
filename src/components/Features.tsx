const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Smart Bookmarks',
    description: 'Organize dev resources into folders, categories, and fast-launch shortcuts without the usual bookmark sprawl.',
    eyebrow: 'Find anything faster',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Productivity Tools',
    description: 'Use the built-in Pomodoro timer, terminal notes, and quick tasks to keep execution moving.',
    eyebrow: 'Protect focus',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
    ),
    title: 'Smart Features',
    description: 'See GitHub activity, weather, and time data right when you open a tab instead of chasing separate tools.',
    eyebrow: 'Live context',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
    ),
    title: 'Customization',
    description: 'Tune the layout with themes, backgrounds, and visibility controls so the dashboard matches how you work.',
    eyebrow: 'Make it yours',
  },
]

const proofPoints = [
  { label: 'New tab utility', value: 'All-in-one', detail: 'Bookmarks, notes, timers, weather, and developer signals in one surface.' },
  { label: 'Setup time', value: '< 2 min', detail: 'Install, pin your tools, and turn the default new tab into a real workspace.' },
  { label: 'Built for', value: 'Builders', detail: 'Designed for developers who open dozens of tabs and need signal fast.' },
]

export default function Features() {
  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-24 lg:px-12" id="features">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_78%,transparent)] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Why it hits harder</div>
            <h2 className="max-w-lg text-3xl font-black leading-[1.02] tracking-[-0.055em] text-[var(--text)] sm:text-5xl">
              Built like a startup product, not a utility page.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              Every panel is tuned to reduce friction in the first 30 seconds of your browsing session.
              Less hunting, less tab drift, more shipping.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {proofPoints.map((point) => (
                <div key={point.label} className="rounded-[1.5rem] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_90%,transparent)] p-5 shadow-[var(--shadow-sm)] backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{point.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.05em] text-[var(--text)] sm:text-3xl">{point.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{point.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                className="group rounded-[1.5rem] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] p-6 shadow-[var(--shadow-sm)] backdrop-blur transition hover:-translate-y-1 hover:border-[var(--accent)]/45 hover:shadow-[var(--shadow-lg)] sm:rounded-[1.75rem]"
                key={feature.title}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-fuchsia-500/15 text-[var(--accent)] transition group-hover:scale-105">
                  {feature.icon}
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{feature.eyebrow}</p>
                <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-[var(--text)]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
