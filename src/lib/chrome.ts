export function getStorage<T>(keys: string[]): Promise<T | null> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      resolve(null)
      return
    }
    chrome.storage.sync.get(keys, (data) => {
      resolve(data as T || null)
    })
  })
}

export function setStorage<T extends Record<string, unknown>>(data: T): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      resolve()
      return
    }
    chrome.storage.sync.set(data, () => {
      resolve()
    })
  })
}

export function getBookmarks(): Promise<chrome.bookmarks.BookmarkTreeNode[]> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.bookmarks) {
      resolve([])
      return
    }
    chrome.bookmarks.getTree((tree) => {
      resolve(tree)
    })
  })
}

export function getTopSites(): Promise<chrome.topSites.TopSite[]> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.topSites) {
      resolve([])
      return
    }
    chrome.topSites.get((sites) => {
      resolve(sites)
    })
  })
}

interface HistoryItem {
  url?: string
  visitCount?: number
  title?: string
  lastVisitTime?: number
}

export function getVisitCounts(urls: string[]): Promise<Map<string, number>> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.history) {
      resolve(new Map())
      return
    }
    const visitMap = new Map<string, number>()
    let pending = urls.length
    if (pending === 0) { resolve(visitMap); return }
    urls.forEach(url => {
      try {
        chrome.history.search({ text: url, maxResults: 1 }, (results: HistoryItem[]) => {
          if (results.length > 0 && results[0].visitCount) {
            visitMap.set(url, results[0].visitCount!)
          }
          pending--
          if (pending === 0) resolve(visitMap)
        })
      } catch {
        pending--
        if (pending === 0) resolve(visitMap)
      }
    })
  })
}

export function search(query: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.search) {
      resolve()
      return
    }
    try {
      chrome.search.query({ query, disposition: 'NEW_TAB' }, () => {
        resolve()
      })
    } catch {
      resolve()
    }
  })
}

export function getRecentHistory(maxResults = 8): Promise<HistoryItem[]> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.history) {
      resolve([])
      return
    }

    try {
      chrome.history.search({ text: '', maxResults, startTime: 0 }, (results: HistoryItem[]) => {
        resolve(results.filter((item) => item.url))
      })
    } catch {
      resolve([])
    }
  })
}

export function requestGeolocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not available'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => reject(error)
    )
  })
}

export function showNotification(title: string, body: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.notifications) {
      resolve()
      return
    }
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title,
      message: body
    }, () => {
      resolve()
    })
  })
}
