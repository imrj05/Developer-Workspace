export default function Navbar() {
  return (
    <nav aria-label="Primary">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-sm border border-border bg-surface shadow-sm">
            <img src="/assets/logo.png" alt="Developer Workspace" className="h-7 w-7 object-contain" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">Developer Workspace</span>
            <span className="block text-xs text-muted">Chrome new tab command center</span>
          </span>
        </a>
        <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <a href="#features" className="transition hover:text-foreground">
            Features
          </a>
          <a href="#install" className="transition hover:text-foreground">
            Install
          </a>
          <a href="https://github.com/imrj05/Developer-Workspace" target="_blank" rel="noopener noreferrer" className="transition hover:text-foreground">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  )
}
