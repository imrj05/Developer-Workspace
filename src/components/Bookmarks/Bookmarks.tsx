import { useEffect, useState } from 'react'
import { Edit2, FolderPlus, Plus, Search, Trash2 } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import { getBookmarks, getTopSites, getVisitCounts } from '../../lib/chrome'
import { Modal } from '../ui/Modal'
import type { Bookmark, Folder } from '../../lib/types'

const CATEGORIES = ['All', 'Dev', 'Prod', 'AI', 'Social', 'Shopping', 'Entertainment', 'Education', 'chrome', 'Other']

interface ChromeBookmark extends chrome.bookmarks.BookmarkTreeNode {
  isChromeBookmark?: boolean
}

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

function getHostnameLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function isImageIcon(icon?: string) {
  return Boolean(icon && /^(https?:)?\/\//.test(icon))
}

function getBookmarkIconSrc(icon: string | undefined, url: string) {
  if (isImageIcon(icon)) {
    return icon
  }

  try {
    const hostname = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return undefined
  }
}

async function getFaviconUrl(url: string): Promise<string | null> {
  try {
    const hostname = new URL(url).hostname
    const response = await fetch(`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`)
    if (response.ok) {
      return response.url
    }
  } catch {
    return null
  }
  return null
}

function processChromeBookmarkTree(node: ChromeBookmark): { bookmarks: Bookmark[]; folders: Folder[] } {
  const result = { bookmarks: [], folders: [] as Folder[] }
  if (!node || !node.children) return result

  node.children.forEach((child) => {
    if (child.url) {
      const hostname = new URL(child.url).hostname
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
      result.bookmarks.push({
        id: `chrome_${child.id}`,
        title: child.title || '',
        url: child.url,
        icon: faviconUrl,
        category: 'chrome',
        isChromeBookmark: true
      })
    } else if (child.children && child.title) {
      const folderBookmarks: Bookmark[] = []
      child.children.forEach((subChild) => {
        if (subChild.url) {
          const hostname = new URL(subChild.url).hostname
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
          folderBookmarks.push({
            id: `chrome_${subChild.id}`,
            title: subChild.title || '',
            url: subChild.url,
            icon: faviconUrl,
            category: 'chrome',
            isChromeBookmark: true
          })
        }
      })
      if (folderBookmarks.length > 0) {
        result.folders.push({
          id: `chrome_folder_${child.id}`,
          name: child.title,
          category: 'chrome'
        })
        result.bookmarks.push(...folderBookmarks)
      }
    }
  })

  return result
}

export function Bookmarks() {
  const { settings } = useSettingsStore()
  const { bookmarks, folders, addBookmark, updateBookmark, deleteBookmark, addFolder, loadAll } = useBookmarksStore()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMostVisited, setShowMostVisited] = useState(false)
  const [chromeBookmarks, setChromeBookmarks] = useState<Bookmark[]>([])
  const [topSites, setTopSites] = useState<chrome.topSites.TopSite[]>([])
  const [visitCounts, setVisitCounts] = useState<Map<string, number>>(new Map())
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [bookmarkForm, setBookmarkForm] = useState({ title: '', url: '', category: 'Dev', folderId: '' })
  const [folderForm, setFolderForm] = useState({ name: '' })

  useEffect(() => {
    loadAll()
    loadChromeBookmarks()
    getTopSites().then(async (sites) => {
      setTopSites(sites)
      const urls = sites.map((site) => site.url)
      const counts = await getVisitCounts(urls)
      setVisitCounts(counts)
    })
  }, [])

  const loadChromeBookmarks = async () => {
    try {
      const tree = await getBookmarks()
      if (tree && tree[0]) {
        const { bookmarks: chromeTreeBookmarks } = processChromeBookmarkTree(tree[0] as ChromeBookmark)
        setChromeBookmarks(chromeTreeBookmarks)
      }
    } catch (error) {
      console.error('Failed to load Chrome bookmarks', error)
    }
  }

  const allBookmarks = [...chromeBookmarks, ...bookmarks.filter((bookmark) => !bookmark.isChromeBookmark)]
  const filteredBookmarks = allBookmarks.filter((bookmark) => {
    const matchesCategory = activeTab === 'All' || (activeTab === 'chrome' ? bookmark.isChromeBookmark : bookmark.category === activeTab)
    const matchesSearch = bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAddBookmark = async () => {
    if (!bookmarkForm.title || !bookmarkForm.url) return
    const favicon = await getFaviconUrl(bookmarkForm.url)
    addBookmark({
      id: generateId(),
      title: bookmarkForm.title,
      url: bookmarkForm.url,
      icon: favicon || undefined,
      category: bookmarkForm.category,
      folderId: bookmarkForm.folderId || undefined
    })
    setBookmarkForm({ title: '', url: '', category: 'Dev', folderId: '' })
    setShowBookmarkModal(false)
  }

  const handleUpdateBookmark = async () => {
    if (!editingBookmark || !bookmarkForm.title || !bookmarkForm.url) return
    await updateBookmark(editingBookmark.id, {
      title: bookmarkForm.title,
      url: bookmarkForm.url,
      category: bookmarkForm.category,
      folderId: bookmarkForm.folderId || undefined
    })
    setEditingBookmark(null)
    setBookmarkForm({ title: '', url: '', category: 'Dev', folderId: '' })
    setShowBookmarkModal(false)
  }

  const handleAddFolder = () => {
    if (!folderForm.name) return
    addFolder({ id: generateId(), name: folderForm.name })
    setFolderForm({ name: '' })
    setShowFolderModal(false)
  }

  if (!settings.showBookmarks) return null

  const hasBookmarks = filteredBookmarks.length > 0

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="card-glass flex min-w-0 flex-1 flex-col overflow-hidden p-5 sm:p-6 lg:p-7">
        <div className="mb-6 flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="section-heading">Quick Access</div>
            <div className="min-w-0">
              <h2 className="text-[1.9rem] font-display font-semibold leading-tight text-[var(--text-primary)] text-balance">Bookmarks & frequently visited sites</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Keep your daily tools close with a cleaner, easier-to-scan layout.</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-[19rem] sm:items-end">
            <div className="relative w-full sm:w-72">
              <label htmlFor="bookmark-search" className="sr-only">Search bookmarks</label>
              <Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                id="bookmark-search"
                name="bookmark-search"
                autoComplete="off"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks…"
                className="input-field py-3 pl-10 pr-4 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
              <button
                onClick={() => setShowMostVisited(!showMostVisited)}
                data-active={showMostVisited}
                className="chip-button"
              >
                Most Visited
              </button>
              <button
                onClick={() => setShowFolderModal(true)}
                aria-label="Add folder"
                className="icon-button h-10 w-10"
              >
                <FolderPlus aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowBookmarkModal(true)}
                aria-label="Add bookmark"
                className="btn-primary h-10 px-4"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                Add Bookmark
              </button>
            </div>
          </div>
        </div>

        <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              data-active={activeTab === category}
              className="chip-button whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {showMostVisited ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium tracking-wide text-[var(--text-label)]">Most Visited</h3>
                <span className="text-xs text-[var(--muted)]">Top 16 sites</span>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {topSites.slice(0, 16).map((site) => {
                  const hostname = new URL(site.url).hostname
                  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
                  const visits = visitCounts.get(site.url) || 0

                  return (
                    <a
                      key={site.url}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-subtle group relative flex min-w-0 items-start gap-4 px-4 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/25 lg:px-5 lg:py-5"
                    >
                      {visits > 0 && (
                        <span className="absolute right-3 top-3 flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-mono font-medium text-white shadow-sm">
                          {visits > 999 ? '999+' : visits}
                        </span>
                      )}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 shadow-sm">
                        <img
                          src={faviconUrl}
                          alt=""
                          width="30"
                          height="30"
                          loading="lazy"
                          className="h-7.5 w-7.5"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <span className="hidden text-base font-semibold">{site.title.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1 pr-5">
                        <div className="line-clamp-1 text-[0.95rem] font-semibold text-[var(--text-primary)]">{site.title}</div>
                        <div className="mt-1 line-clamp-1 text-[0.8rem] text-[var(--text-secondary)]">{getHostnameLabel(site.url)}</div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-[var(--surface)]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-label)]">
                            Frequent
                          </span>
                          <span className="text-xs font-medium text-[var(--muted)] transition-colors group-hover:text-[var(--text-primary)]">Open Site</span>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium tracking-wide text-[var(--text-label)]">Bookmarks</h3>
                <span className="text-xs text-[var(--muted)]">{filteredBookmarks.length} items</span>
              </div>

              {hasBookmarks ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredBookmarks.map((bookmark) => (
                    <a
                      key={bookmark.id}
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-subtle group relative flex min-w-0 items-start gap-4 px-4 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/25 lg:px-5 lg:py-5"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 shadow-sm">
                          {getBookmarkIconSrc(bookmark.icon, bookmark.url) ? (
                            <img
                              src={getBookmarkIconSrc(bookmark.icon, bookmark.url)}
                              alt=""
                              width="30"
                              height="30"
                              loading="lazy"
                              className="h-7.5 w-7.5"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                              }}
                            />
                          ) : null}
                          <span className={`text-base font-semibold ${getBookmarkIconSrc(bookmark.icon, bookmark.url) ? 'hidden' : ''}`}>{bookmark.icon || bookmark.title.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1 pr-16">
                        <div className="line-clamp-1 text-[0.95rem] font-semibold text-[var(--text-primary)]">{bookmark.title}</div>
                        <div className="mt-1 line-clamp-1 text-[0.8rem] text-[var(--text-secondary)]">{getHostnameLabel(bookmark.url)}</div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <span className="rounded-full bg-[var(--surface)]/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-label)]">
                            {bookmark.category}
                          </span>

                          <div className="flex gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                setEditingBookmark(bookmark)
                                setBookmarkForm({
                                  title: bookmark.title,
                                  url: bookmark.url,
                                  category: bookmark.category,
                                  folderId: bookmark.folderId || ''
                                })
                                setShowBookmarkModal(true)
                              }}
                              aria-label={`Edit ${bookmark.title}`}
                              className="icon-button h-8 w-8"
                            >
                              <Edit2 aria-hidden="true" className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                deleteBookmark(bookmark.id)
                              }}
                              aria-label={`Delete ${bookmark.title}`}
                              className="icon-button h-8 w-8 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                            >
                              <Trash2 aria-hidden="true" className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <span className="absolute right-4 top-4 text-xs font-medium text-[var(--muted)] transition-colors group-hover:text-[var(--text-primary)]">
                        Open
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="card-subtle flex min-h-56 flex-col items-center justify-center gap-2 px-6 py-8 text-center">
                  <p className="text-base font-medium text-[var(--text-primary)]">No bookmarks match this view.</p>
                  <p className="max-w-md text-sm text-[var(--text-secondary)]">Try another category, clear the search, or add a new bookmark to build your workspace.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showBookmarkModal}
        onOpenChange={(open) => {
          setShowBookmarkModal(open)
          if (!open) {
            setEditingBookmark(null)
            setBookmarkForm({ title: '', url: '', category: 'Dev', folderId: '' })
          }
        }}
        title={editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            void (editingBookmark ? handleUpdateBookmark() : handleAddBookmark())
          }}
        >
          <p className="section-copy">
            {editingBookmark ? 'Update the bookmark details and save the changes.' : 'Paste a link and organize it with a category or folder.'}
          </p>
          <div>
            <label htmlFor="bookmark-title" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Title</label>
            <input
              id="bookmark-title"
              name="bookmark-title"
              autoComplete="off"
              type="text"
              value={bookmarkForm.title}
              onChange={(e) => setBookmarkForm({ ...bookmarkForm, title: e.target.value })}
              placeholder="Ex: GitHub"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="bookmark-url" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">URL</label>
            <input
              id="bookmark-url"
              name="bookmark-url"
              type="url"
              value={bookmarkForm.url}
              onChange={(e) => setBookmarkForm({ ...bookmarkForm, url: e.target.value })}
              placeholder="https://example.com"
              className="input-field"
            />
            <p className="mt-2 text-xs text-[var(--text-label)]">Use a full URL so the icon and domain are resolved correctly.</p>
          </div>

          <div>
            <label htmlFor="bookmark-category" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Category</label>
            <select
              id="bookmark-category"
              value={bookmarkForm.category}
              onChange={(e) => setBookmarkForm({ ...bookmarkForm, category: e.target.value })}
              className="input-field rounded-[var(--radius-lg)]"
            >
              {CATEGORIES.filter((category) => category !== 'All').map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bookmark-folder" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Folder</label>
            <select
              id="bookmark-folder"
              value={bookmarkForm.folderId}
              onChange={(e) => setBookmarkForm({ ...bookmarkForm, folderId: e.target.value })}
              className="input-field rounded-[var(--radius-lg)]"
            >
              <option value="">No folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>{folder.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowBookmarkModal(false)} className="btn-secondary w-full sm:w-auto">
              Cancel
            </button>
            <button type="submit" disabled={!bookmarkForm.title || !bookmarkForm.url} className="btn-primary w-full sm:w-auto">
              {editingBookmark ? 'Save Changes' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={showFolderModal}
        onOpenChange={(open) => {
          setShowFolderModal(open)
          if (!open) setFolderForm({ name: '' })
        }}
        title="Add Folder"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleAddFolder()
          }}
        >
          <p className="section-copy">Create a folder to keep related links grouped together inside Quick Access.</p>
          <div>
            <label htmlFor="folder-name" className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Folder Name</label>
            <input
              id="folder-name"
              name="folder-name"
              autoComplete="off"
              type="text"
              value={folderForm.name}
              onChange={(e) => setFolderForm({ name: e.target.value })}
              placeholder="Ex: Daily Tools"
              className="input-field"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => setShowFolderModal(false)} className="btn-secondary w-full sm:w-auto">
              Cancel
            </button>
            <button type="submit" disabled={!folderForm.name} className="btn-primary w-full sm:w-auto">
              Add Folder
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
