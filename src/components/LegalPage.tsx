import type { LegalSection } from '../legalContent'

type LegalPageProps = {
  eyebrow: string
  title: string
  effectiveDate: string
  intro?: string
  sections: LegalSection[]
  contactEmail: string
  lastUpdated: string
}

export default function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  intro,
  sections,
  contactEmail,
  lastUpdated,
}: LegalPageProps) {
  return (
    <main className="legal-page">
      <div className="legal-shell">
        <a href="#/" className="legal-back-link">
          <span aria-hidden="true">&larr;</span>
          <span>Back to home</span>
        </a>

        <header className="legal-header">
          <div className="hero-badge">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="legal-meta">Effective Date: {effectiveDate}</p>
          {intro ? <p className="legal-intro">{intro}</p> : null}
        </header>

        <article className="legal-card">
          {sections.map((section) => (
            <section key={section.title} className="legal-section">
              <h2>{section.title}</h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="legal-section">
            <h2>Contact Information</h2>
            <p>
              For any questions, contact us at{' '}
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
            </p>
          </section>

          <p className="legal-updated">Last updated: {lastUpdated}</p>
        </article>
      </div>
    </main>
  )
}
