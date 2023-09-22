import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getWeatherData } from '@/utils/api/weatherapi'
import { useTempUnit } from '@/utils/contexts/TempUnitContext'
import { toTitleCase } from '@/utils/toTitleCase'
import { getWeathericon } from '@/utils/getWeatherIcon'
import { countryCodeToFlag } from '@/utils/countryCodeToFlag'
import TemperatureMap from '@/components/TemperatureMap'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Forecast from '@/components/Forecast/Forecast'
import { convertTemp } from '@/utils/tempConverter'
import TemperatureBox from './_subcomponents/TemperatureBox'
import DetailCards from './_subcomponents/DetailCards'
import TemperatureDetails from './_subcomponents/TemperatureDetails'
import SunCard from './_subcomponents/SunCards'

export default function WeatherDetail() {
  const router = useRouter()
  const { name } = router.query
  
  const { defaultTempUnit } = useTempUnit()
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    if (name) {
      getWeatherData(name)
        .then(data => setWeatherData(data))
        .catch(error => console.error('Could not fetch weather data: ', error))
    }
  }, [name])

  if (!weatherData) {
    return (
      <Container>
        <Typography variant='h2' component='h1' sx={{
          textAlign: 'center',
          mt: 5
        }}>
          Loading...
        </Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant='h4' component='h1' sx={{
        textAlign: 'center',
        mt: 5
      }}>
        { weatherData.name } { countryCodeToFlag(weatherData.sys.country) }
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <TemperatureBox
          icon={getWeathericon(weatherData.weather[0].id, '3rem')}
          temperature={`${convertTemp(weatherData.main.temp, defaultTempUnit)}º${defaultTempUnit}`}
          description={toTitleCase(weatherData.weather[0].description)}
          rawTemperature={convertTemp(weatherData.main.temp, defaultTempUnit)}
          unit={defaultTempUnit}
        />
        <TemperatureDetails 
          maxTemp={weatherData.main.temp_max}
          minTemp={weatherData.main.temp_min}
          tempUnit={defaultTempUnit}
        />
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        m: 4
      }}>
        <Forecast cityName={weatherData.name} tempUnit={defaultTempUnit} />
      </Box>
      <DetailCards 
        feelsLike={convertTemp(weatherData.main.feels_like, defaultTempUnit)}
        humidity={weatherData.main.humidity}
        windSpeed={weatherData.wind.speed}
      />
      <SunCard 
        sunrise={weatherData.sys.sunrise}
        sunset={weatherData.sys.sunset}
      />
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        m: 4
      }}>
        <TemperatureMap weatherData={weatherData.coord} />
      </Box>
    </Container>
  )
}

