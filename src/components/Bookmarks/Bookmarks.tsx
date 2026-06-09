import { useCallback, useEffect, useMemo, useState } from 'react'
import { FolderPlus, Plus, Search } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useBookmarksStore } from '../../stores/bookmarksStore'
import { getBookmarks, getMostVisitedSites, getTopSites, type VisitedSite } from '../../lib/chrome'
import { Modal } from '../ui/Modal'
import { SectionPanel } from '../ui/SectionPanel'
import { LinkTile } from '../ui/LinkTile'
import { EmptyState } from '../ui/EmptyState'
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
  if (isImageIcon(icon)) return icon
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
    if (response.ok) return response.url
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
  const { settings, updateSettings } = useSettingsStore()
  const { bookmarks, folders, addBookmark, updateBookmark, deleteBookmark, addFolder, loadAll } = useBookmarksStore()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [mostVisitedSites, setMostVisitedSites] = useState<VisitedSite[]>([])
  const [chromeBookmarks, setChromeBookmarks] = useState<Bookmark[]>([])
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [showBookmarkModal, setShowBookmarkModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [bookmarkForm, setBookmarkForm] = useState({ title: '', url: '', category: 'Dev', folderId: '' })
  const [folderForm, setFolderForm] = useState({ name: '' })

  const showMostVisited = settings.bookmarksShowMostVisited

  const loadMostVisited = useCallback(async () => {
    const historySites = await getMostVisitedSites(24)
    if (historySites.length > 0) {
      setMostVisitedSites(historySites)
      return
    }

    const topSites = await getTopSites()
    setMostVisitedSites(
      topSites.slice(0, 24).map((site) => ({
        url: site.url,
        title: site.title,
        visitCount: 0
      }))
    )
  }, [])

  useEffect(() => {
    loadAll()
    loadChromeBookmarks()
    void loadMostVisited()
  }, [loadMostVisited])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void loadMostVisited()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [loadMostVisited])

  useEffect(() => {
    if (showMostVisited) void loadMostVisited()
  }, [showMostVisited, loadMostVisited])

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

  const normalizedSearch = searchQuery.trim().toLowerCase()

  const allBookmarks = [...chromeBookmarks, ...bookmarks.filter((bookmark) => !bookmark.isChromeBookmark)]

  const filteredBookmarks = useMemo(() => {
    return allBookmarks.filter((bookmark) => {
      const matchesCategory = activeTab === 'All' || (activeTab === 'chrome' ? bookmark.isChromeBookmark : bookmark.category === activeTab)
      const matchesSearch = !normalizedSearch
        || bookmark.title.toLowerCase().includes(normalizedSearch)
        || getHostnameLabel(bookmark.url).toLowerCase().includes(normalizedSearch)
      return matchesCategory && matchesSearch
    })
  }, [activeTab, allBookmarks, normalizedSearch])

  const filteredMostVisited = useMemo(() => {
    if (!normalizedSearch) return mostVisitedSites
    return mostVisitedSites.filter((site) => {
      return site.title.toLowerCase().includes(normalizedSearch)
        || getHostnameLabel(site.url).toLowerCase().includes(normalizedSearch)
    })
  }, [mostVisitedSites, normalizedSearch])

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

  const itemCount = showMostVisited ? filteredMostVisited.length : filteredBookmarks.length

  return (
    <>
      <SectionPanel
        title="Bookmarks"
        badge={`${itemCount}`}
        actions={
          <>
            <button type="button" onClick={() => setShowFolderModal(true)} aria-label="Add folder" className="icon-button h-9 w-9">
              <FolderPlus aria-hidden="true" className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setShowBookmarkModal(true)} className="btn-primary h-9 px-3 text-sm">
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add
            </button>
          </>
        }
      >
        <div className="bookmarks-toolbar">
          <div className="bookmarks-toolbar-row">
            <div className="bookmarks-view-toggle">
              <button
                type="button"
                onClick={() => void updateSettings({ bookmarksShowMostVisited: true })}
                data-active={showMostVisited}
                className="chip-button px-3 py-1.5 text-xs"
              >
                Most Visited
              </button>
              <button
                type="button"
                onClick={() => void updateSettings({ bookmarksShowMostVisited: false })}
                data-active={!showMostVisited}
                className="chip-button px-3 py-1.5 text-xs"
              >
                Saved
              </button>
            </div>
            <div className="bookmarks-search relative min-w-0">
              <label htmlFor="bookmark-search" className="sr-only">Search bookmarks</label>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted)]" />
              <input
                id="bookmark-search"
                name="bookmark-search"
                autoComplete="off"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={showMostVisited ? 'Filter visited…' : 'Filter saved…'}
                className="input-field h-9 w-full py-1.5 pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          {!showMostVisited && (
            <div className="bookmarks-categories">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveTab(category)}
                  data-active={activeTab === category}
                  className="chip-button px-2.5 py-1 text-xs"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bookmarks-scroll">
          {showMostVisited ? (
            filteredMostVisited.length === 0 ? (
              <EmptyState title="No visited sites" description="Browse the web or clear your filter." />
            ) : (
              <div className="tile-grid">
                {filteredMostVisited.map((site) => (
                  <LinkTile
                    key={site.url}
                    title={site.title}
                    url={site.url}
                    iconSrc={`https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}&sz=32`}
                    fallbackLetter={site.title.charAt(0).toUpperCase()}
                    subtitle={getHostnameLabel(site.url)}
                    badge={site.visitCount}
                  />
                ))}
              </div>
            )
          ) : filteredBookmarks.length === 0 ? (
            <EmptyState title="No bookmarks match" description="Try another category or add a bookmark." />
          ) : (
            <div className="tile-grid">
              {filteredBookmarks.map((bookmark) => (
                <LinkTile
                  key={bookmark.id}
                  title={bookmark.title}
                  url={bookmark.url}
                  iconSrc={getBookmarkIconSrc(bookmark.icon, bookmark.url)}
                  fallbackLetter={bookmark.title.charAt(0).toUpperCase()}
                  subtitle={bookmark.category}
                  onEdit={bookmark.isChromeBookmark ? undefined : () => {
                    setEditingBookmark(bookmark)
                    setBookmarkForm({
                      title: bookmark.title,
                      url: bookmark.url,
                      category: bookmark.category,
                      folderId: bookmark.folderId || ''
                    })
                    setShowBookmarkModal(true)
                  }}
                  onDelete={bookmark.isChromeBookmark ? undefined : () => deleteBookmark(bookmark.id)}
                />
              ))}
            </div>
          )}
        </div>
      </SectionPanel>

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
          <p className="section-copy">Create a folder to keep related links grouped together.</p>
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
    </>
  )
}
