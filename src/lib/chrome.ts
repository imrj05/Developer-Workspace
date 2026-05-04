type StorageAreaName = 'sync' | 'local'

function getStorageArea(area: StorageAreaName) {
  return chrome.storage[area]
}

export function getStorage<T>(keys: string[], area: StorageAreaName = 'sync'): Promise<T | null> {
  return new Promise((resolve, reject) => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      resolve(null)
      return
    }

    getStorageArea(area).get(keys, (data) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }

      resolve(data as T || null)
    })
  })
}

export async function getStorageWithFallback<T>(keys: string[], primary: StorageAreaName, fallback: StorageAreaName): Promise<T | null> {
  const primaryData = await getStorage<Record<string, unknown>>(keys, primary) || {}
  const missingKeys = keys.filter((key) => primaryData[key] === undefined)

  if (missingKeys.length === 0) {
    return primaryData as T
  }

  const fallbackData = await getStorage<Record<string, unknown>>(missingKeys, fallback) || {}
  const migratedKeys = Object.keys(fallbackData)

  if (migratedKeys.length > 0) {
    await setStorage(fallbackData, primary)
  }

  return {
    ...fallbackData,
    ...primaryData,
  } as T
}

export function setStorage<T extends Record<string, unknown>>(data: T, area: StorageAreaName = 'sync'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof chrome === 'undefined' || !chrome.storage) {
      resolve()
      return
    }

    getStorageArea(area).set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }

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
