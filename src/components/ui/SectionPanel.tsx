import type { ReactNode } from 'react'

interface SectionPanelProps {
  title: string
  badge?: string
  actions?: ReactNode
  scroll?: boolean
  children: ReactNode
}

export function SectionPanel({ title, badge, actions, scroll = false, children }: SectionPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="panel-title">{title}</h2>
          {badge ? <span className="panel-badge">{badge}</span> : null}
        </div>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      <div className={scroll ? 'panel-body panel-body--scroll' : 'panel-body'}>{children}</div>
    </section>
  )
}
