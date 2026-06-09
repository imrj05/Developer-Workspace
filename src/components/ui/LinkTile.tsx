import { Edit2, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface LinkTileProps {
  title: string
  url: string
  subtitle?: string
  icon?: ReactNode
  iconSrc?: string
  fallbackLetter?: string
  badge?: string | number
  onEdit?: () => void
  onDelete?: () => void
  leading?: ReactNode
}

function showBadge(badge: string | number | undefined) {
  if (badge === undefined || badge === '') return false
  if (typeof badge === 'number') return badge > 0
  return true
}

export function LinkTile({ title, url, subtitle, icon, iconSrc, fallbackLetter, badge, onEdit, onDelete, leading }: LinkTileProps) {
  const iconContent = icon ?? (iconSrc || fallbackLetter ? (
    <>
      {iconSrc ? (
        <img
          src={iconSrc}
          alt=""
          width="18"
          height="18"
          loading="lazy"
          className="h-4 w-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
            ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
          }}
        />
      ) : null}
      {fallbackLetter ? (
        <span className={iconSrc ? 'hidden' : ''}>{fallbackLetter}</span>
      ) : null}
    </>
  ) : null)

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="tile-row group">
      {leading}
      {iconContent ? <div className="tile-icon">{iconContent}</div> : null}
      <div className="min-w-0 flex-1">
        <div className="tile-title">{title}</div>
        {subtitle ? <div className="tile-subtitle">{subtitle}</div> : null}
      </div>
      {showBadge(badge) && (
        <span className="tile-badge">{typeof badge === 'number' && badge > 999 ? '999+' : badge}</span>
      )}
      {(onEdit || onDelete) && (
        <div className="tile-actions">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onEdit()
              }}
              aria-label={`Edit ${title}`}
              className="icon-button h-8 w-8"
            >
              <Edit2 aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                onDelete()
              }}
              aria-label={`Delete ${title}`}
              className="icon-button h-8 w-8 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </a>
  )
}
