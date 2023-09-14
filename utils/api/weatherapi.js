const LOCAL_API_URL = '/api/getWeatherData'
const LOCAL_MAP_API_URL = '/api/getMapUrl'

const getWeatherData = (cityName) => {
  console.log('API Key:', process.env.OPEN_WEATHER_MAP_API_KEY)
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

export { getWeatherData, getMapUrl }