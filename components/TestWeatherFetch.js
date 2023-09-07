import { useState } from "react";
import { getWeatherData } from "@/utils/api/weatherapi";

export default function TestWeatherFetch() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)

  const fetchWeather = async () => {
    try {
      const data = await getWeatherData(city)
      setWeatherData(data)
    } catch (error) {
      console.error('failed to fetch weather: ', error)
    }
  }

  return (
    <div>
      <input 
        type='text'
        placeholder='enter city'
        value={ city }
        onChange={ (event) => setCity(event.target.value) }
      />
      <button onClick={ fetchWeather }>Get Weather</button>
      
      {weatherData && (
        <div>
          <h1>{weatherData.name}</h1>
          <h2>{weatherData.weather[0].description}</h2>
          <h3>{Math.round(weatherData.main.temp - 273.15)}ºC</h3>
        </div>
      )}
    </div>
  )
}