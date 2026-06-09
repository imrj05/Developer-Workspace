export function getGreeting(hour: number): string {
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatTimezoneLabel(timeZone: string): string {
  if (timeZone === 'local') {
    const resolved = Intl.DateTimeFormat().resolvedOptions().timeZone
    const segment = resolved.split('/').pop() ?? resolved
    return segment.replace(/_/g, ' ')
  }

  return timeZone.replace(/_/g, ' ')
}
