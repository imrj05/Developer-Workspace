import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon ? <div className="text-[var(--text-label)]">{icon}</div> : null}
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      {description ? <p className="text-sm text-[var(--text-secondary)]">{description}</p> : null}
    </div>
  )
}
