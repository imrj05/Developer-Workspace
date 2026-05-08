import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Hero from './components/Hero'
import Features from './components/Features'
import Cta from './components/Cta'
import Footer from './components/Footer'
import LegalPage from './components/LegalPage'
import { privacySections, termsSections } from './legalContent'

function ThemeToggle({ dark, onToggle }: { dark: boolean, onToggle: () => void }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-page text-foreground">
      <Hero />
      <Features />
      <Cta />
      <Footer />
    </main>
  )
}

function AppRoutes() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)

    if (location.pathname === '/privacy-policy') {
      document.title = 'Privacy Policy | Developer Workspace'
      return
    }

    if (location.pathname === '/terms-and-conditions') {
      document.title = 'Terms & Conditions | Developer Workspace'
      return
    }

    document.title = 'Developer Workspace — Enhance Your Development Workflow'
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/privacy-policy"
        element={
          <LegalPage
            eyebrow="Privacy Policy"
            title="Privacy Policy"
            effectiveDate="March 2025"
            intro="This page explains what information Developer Workspace uses, why it uses those permissions, and how your data stays under your control."
            sections={privacySections}
            contactEmail="rajeshwarkashyap5@gmail.com"
            lastUpdated="March 2025"
          />
        }
      />
      <Route
        path="/terms-and-conditions"
        element={
          <LegalPage
            eyebrow="Terms & Conditions"
            title="Terms & Conditions"
            effectiveDate="March 2025"
            intro="These terms govern your use of the Developer Workspace Chrome extension and describe the responsibilities, limitations, and conditions associated with using it."
            sections={termsSections}
            contactEmail="rajeshwarkashyap5@gmail.com"
            lastUpdated="March 2025"
          />
        }
      />
    </Routes>
  )
}

function App() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      setDark(stored === 'dark')
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <>
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <AppRoutes />
    </>
  )
}

export default App
