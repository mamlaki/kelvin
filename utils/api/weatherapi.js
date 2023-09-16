const LOCAL_API_URL = '/api/getWeatherData'
const LOCAL_MAP_API_URL = '/api/getMapUrl'
const LOCAL_FORECAST_API_URL = '/api/getForecastData'

const getWeatherData = (cityName) => {
  return fetch(`${LOCAL_API_URL}?cityName=${cityName}`)
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

const getMapUrl = () => {
  return fetch(LOCAL_MAP_API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch map URL')
      }
      return response.json()
    })
    .then(data => data.mapUrl)
    .catch(error => {
      console.error('Error fetching map URL:', error)
      throw error
    })
} 

const getForecastData = (cityName) => {
  return fetch(`${LOCAL_FORECAST_API_URL}?cityName=${cityName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data')
      }
      return response.json()
    })
    .then(data => data)
    .catch(error => {
      console.error('Error fetching forecast data: ', error)
      throw error
    })
}

export { getWeatherData, getMapUrl, getForecastData }