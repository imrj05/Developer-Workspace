import { getStorage, removeStorage, setStorage } from './chrome'

export const CUSTOM_WALLPAPER_KEY = 'customWallpaper'
export const LOCAL_WALLPAPER_MARKER = '__local__'

const MAX_DIMENSION = 2560
const JPEG_QUALITY = 0.82
const MAX_FILE_BYTES = 8 * 1024 * 1024

export function isWallpaperDataUrl(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.startsWith('data:image/')
}

export function isLocalWallpaperMarker(value: string | null | undefined): boolean {
  return value === LOCAL_WALLPAPER_MARKER
}

export async function processWallpaperFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }

  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Image must be under 8 MB.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('Could not process the image.')
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}

export async function loadCustomWallpaper(): Promise<string | null> {
  const data = await getStorage<Record<string, string>>([CUSTOM_WALLPAPER_KEY], 'local')
  const wallpaper = data?.[CUSTOM_WALLPAPER_KEY]
  return isWallpaperDataUrl(wallpaper) ? wallpaper : null
}

export async function saveCustomWallpaper(dataUrl: string): Promise<void> {
  await setStorage({ [CUSTOM_WALLPAPER_KEY]: dataUrl }, 'local')
}

export async function removeCustomWallpaper(): Promise<void> {
  await removeStorage([CUSTOM_WALLPAPER_KEY], 'local')
}
