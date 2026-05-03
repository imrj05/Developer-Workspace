import { useState, useEffect } from 'react'
import { Cloud, CloudRain, CloudSnow, Sun, Moon, CloudLightning, CloudFog, Loader2 } from 'lucide-react'
import { useSettingsStore } from '../../stores/settingsStore'
import { fetchWeather, getWeatherIcon } from '../../lib/weather'
import { requestGeolocation } from '../../lib/chrome'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  cloudSun: Cloud,
  cloudMoon: Cloud,
  clouds: Cloud,
  cloudRain: CloudRain,
  cloudLightening: CloudLightning,
  snowflake: CloudSnow,
  cloudFog: CloudFog
}

export function Weather() {
  const { settings } = useSettingsStore()
  const [weather, setWeather] = useState<{
    temp: number
    description: string
    icon: string
    name: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!settings.showWeatherWidget || !settings.weatherApiKey) return

    const loadWeather = async () => {
      setLoading(true)
      setError(false)
      try {
        const coords = await requestGeolocation()
        const units = settings.useFahrenheit ? 'imperial' : 'metric'
        const data = await fetchWeather(coords.latitude, coords.longitude, settings.weatherApiKey, units)
        setWeather(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
    const interval = setInterval(loadWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [settings.showWeatherWidget, settings.weatherApiKey, settings.useFahrenheit])

  if (!settings.showWeatherWidget) return null

  const IconComponent = iconMap[getWeatherIcon(weather?.icon || '')] || Cloud

  return (
    <div className="card-glass inline-flex items-center gap-3 self-start rounded-full px-4 py-2.5 text-left">
      {loading ? (
        <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-[var(--muted)]" />
      ) : error || !settings.weatherApiKey ? (
        <Cloud aria-hidden="true" className="h-5 w-5 text-[var(--muted)]" />
      ) : (
        <IconComponent className="h-5 w-5 text-[var(--accent)]" />
      )}
      <div className="min-w-0">
        {loading ? (
          <span className="text-sm text-[var(--muted)]">Loading…</span>
        ) : error || !settings.weatherApiKey ? (
          <span className="text-sm text-[var(--muted)]">Weather unavailable</span>
        ) : (
          <>
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {weather?.temp}°{settings.useFahrenheit ? 'F' : 'C'}
            </div>
            <div className="text-xs text-[var(--muted)] capitalize">
              {weather?.name}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
