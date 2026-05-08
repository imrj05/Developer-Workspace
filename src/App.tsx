import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Preview from './components/Preview'
import Features from './components/Features'
import Cta from './components/Cta'
import Footer from './components/Footer'

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="fixed top-5 right-5 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/80 text-muted backdrop-blur-md transition hover:border-accent hover:text-accent hover:-translate-y-0.5"
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

function App() {
  const [dark, setDark] = useState(() => {
    if (typeof document === 'undefined') return true
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="min-h-screen bg-page text-foreground">
      <ThemeToggle dark={dark} onToggle={() => setDark((v) => !v)} />
      <Navbar />
      <main>
        <Hero />
        <Preview />
        <Features />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

export default App
