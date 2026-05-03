import type { GithubEvent } from './types'

export async function fetchGithubEvents(username: string): Promise<GithubEvent[]> {
  if (!username) {
    throw new Error('GitHub username not configured')
  }

  const response = await fetch(
    `https://api.github.com/users/${username}/events/public`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub events')
  }

  return response.json()
}

export function parseGithubEvent(event: GithubEvent): {
  type: string
  description: string
  time: string
  repo: string
} {
  const repo = event.repo?.name || 'Unknown'
  const time = new Date(event.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })

  let description = ''
  const payload = event.payload

  switch (event.type) {
    case 'PushEvent':
      description = payload.head
        ? `Pushed to ${payload.head.slice(0, 7)}`
        : 'Pushed commits'
      break
    case 'CreateEvent':
      description = payload.ref_type === 'repository'
        ? 'Created new repository'
        : `Created ${payload.ref_type}`
      break
    case 'DeleteEvent':
      description = `Deleted ${payload.ref_type}`
      break
    case 'IssuesEvent':
      description = `${payload.action?.charAt(0).toUpperCase()}${payload.action?.slice(1)} issue`
      break
    case 'PullRequestEvent':
      description = `${payload.action?.charAt(0).toUpperCase()}${payload.action?.slice(1)} pull request`
      break
    case 'IssueCommentEvent':
      description = payload.comment?.body?.slice(0, 50) || 'Commented on issue'
      break
    case 'CommitCommentEvent':
      description = payload.comment?.body?.slice(0, 50) || 'Commented on commit'
      break
    case 'WatchEvent':
      description = 'Starred repository'
      break
    case 'ForkEvent':
      description = 'Forked repository'
      break
    case 'MemberEvent':
      description = 'Added collaborator'
      break
    default:
      description = event.type.replace('Event', '')
  }

  return { type: event.type, description, time, repo }
}
