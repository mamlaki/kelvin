import { BASE_URL } from "./base";

const API_KEY = '7cc6e0a83f9a403f080358c184ad3562'

export const getWeatherData = async (cityName) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${cityName}&appid=${API_KEY}`)
    if (!response.ok) {
      throw new Error('failed to fetch weather data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching weather data: ', error)
    throw error
  }
}