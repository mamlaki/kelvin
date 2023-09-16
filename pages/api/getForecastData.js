import { FORECAST_URL } from "@/utils/api/baseUrls";

const API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY

export default async function handler(req, res) {
  const { cityName } = req.query
  
  try {
    const response = await fetch(`${FORECAST_URL}?q=${cityName}&appid=${API_KEY}`)

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}