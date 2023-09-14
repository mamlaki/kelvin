import { BASE_URL } from "./base";
import { MAP_URL } from "./base";

const API_KEY = '7cc6e0a83f9a403f080358c184ad3562'

const getWeatherData = (cityName) => {
  return fetch(`${BASE_URL}?q=${cityName}&appid=${API_KEY}`)
    .then(response => {
      if(!response.ok) {
        throw new Error('Failed to fetch weather data')
      }
      return response.json()
    }).then(data => data)
    .catch(error => {
      console.error('Error fetching weather data: ', error)
      throw error
    })
}

const getMapUrl = (lat, lon, zoom) => {
  return `${MAP_URL}/temp_new/${zoom}/${lat}/${lon}.png?appid=${API_KEY}`
}

export { getWeatherData, getMapUrl }