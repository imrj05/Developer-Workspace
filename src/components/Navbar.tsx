export default function Navbar() {
  return (
    <nav className="mx-auto max-w-6xl px-5 pt-5 sm:px-8 lg:px-12" aria-label="Primary">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-foreground text-xs font-bold text-page">
            DW
          </span>
          <span className="text-sm font-semibold tracking-tight">Developer Workspace</span>
        </a>
        <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <a href="#features" className="transition hover:text-foreground">
            Features
          </a>
          <a href="#install" className="transition hover:text-foreground">
            Install
          </a>
        </div>
      </div>
    </nav>
  )
}
