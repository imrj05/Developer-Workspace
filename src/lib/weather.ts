import { DEFAULT_SETTINGS, type Settings } from './types'

export async function fetchWeather(
  lat: number,
  lon: number,
  apiKey: string,
  units: 'metric' | 'imperial' = 'metric'
) {
  if (!apiKey) {
    throw new Error('Weather API key not configured')
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather')
  }

  const data = await response.json()

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0]?.description || 'Unknown',
    icon: data.weather[0]?.icon || '01d',
    name: data.name,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed
  }
}

export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud-sun',
    '02n': 'cloud-moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'clouds',
    '04n': 'clouds',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'snowflake',
    '13n': 'snowflake',
    '50d': 'cloud-fog',
    '50n': 'cloud-fog'
  }
  return iconMap[iconCode] || 'cloud'
}
