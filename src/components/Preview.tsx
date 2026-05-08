export default function Preview() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-8 sm:pb-20">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 hidden text-xs text-muted sm:inline">new-tab://developer-workspace</span>
        </div>
        <div className="p-2 sm:p-3">
          <img
            src="/assets/screenshot-light.png"
            alt="Developer Workspace screenshot"
            className="w-full rounded-xl border border-border object-cover dark:hidden"
          />
          <img
            src="/assets/screenshot-dark.png"
            alt="Developer Workspace screenshot"
            className="hidden w-full rounded-xl border border-white/10 object-cover dark:block"
          />
        </div>
      </div>
    </section>
  )
}
