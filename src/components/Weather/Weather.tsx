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

interface WeatherProps {
  onOpenSettings?: () => void
}

export function Weather({ onOpenSettings }: WeatherProps) {
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
  const needsSetup = !settings.weatherApiKey

  if (needsSetup) {
    return (
      <button
        type="button"
        onClick={onOpenSettings}
        className="chip-button self-start text-left"
      >
        <Cloud aria-hidden="true" className="h-4 w-4 text-[var(--muted)]" />
        <span className="text-sm font-medium text-[var(--text-primary)]">Set up weather</span>
      </button>
    )
  }

  return (
    <div className="chip-button pointer-events-none self-start text-left">
      {loading ? (
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-[var(--muted)]" />
      ) : error ? (
        <button type="button" onClick={onOpenSettings} className="pointer-events-auto inline-flex items-center gap-2 text-left">
          <Cloud aria-hidden="true" className="h-4 w-4 text-[var(--muted)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">Weather unavailable</span>
        </button>
      ) : (
        <>
          <IconComponent className="h-4 w-4 text-[var(--accent)]" />
          <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
            {weather?.temp}°{settings.useFahrenheit ? 'F' : 'C'}
          </span>
          <span className="text-xs capitalize text-[var(--text-label)]">{weather?.name}</span>
        </>
      )}
    </div>
  )
}
