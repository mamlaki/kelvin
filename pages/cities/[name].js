import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getWeatherData } from '@/utils/api/weatherapi'

export default function WeatherDetail() {
  const router = useRouter()
  const { name } = router.query
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    if (name) {
      getWeatherData(name)
        .then(data => setWeatherData(data))
        .catch(error => console.error('Could not fetch weather data: ', error))
    }
  }, [name])

  return (
    <div>
      {weatherData ? (
        <>
          <h1>{ weatherData.name }</h1>
        </>
      ) : (
        <p>loading...</p>
      )}
    </div>
  )

}

