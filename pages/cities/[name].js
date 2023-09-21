import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getWeatherData } from '@/utils/api/weatherapi'
import { useTempUnit } from '@/utils/contexts/TempUnitContext'
import TemperatureMap from '@/components/TemperatureMap'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import WbSunnyIcon from '@mui/icons-material/WbSunny'
import CloudIcon from '@mui/icons-material/Cloud'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import Forecast from '@/components/Forecast'
import { convertTemp } from '@/utils/tempConverter'
import TemperatureBox from './_subcomponents/TemperatureBox'
import DetailCards from './_subcomponents/DetailCards'

export default function WeatherDetail() {
  const router = useRouter()
  const { name } = router.query
  
  const { defaultTempUnit } = useTempUnit()
  const [weatherData, setWeatherData] = useState(null)

  const getWeathericon = (weatherId) => {
    if (weatherId >= 200 && weatherId <= 232) {
      return <FlashOnIcon style={{ color: 'yellow', fontSize: '3rem' }}/>
    } else if (weatherId >= 300 && weatherId <= 321) {
      return <AcUnitIcon style={{ color: 'blue', fontSize: '3rem' }} />
    } else if (weatherId >= 500 && weatherId <= 531) {
      return <CloudIcon style={{ color: 'gray', fontSize: '3rem' }} />
    } else if (weatherId >= 800 && weatherId <= 801) {
      return <WbSunnyIcon style={{ color: 'orange', fontSize: '3rem' }} />
    } else {
      return <CloudIcon style={{ color: 'gray', fontSize: '3rem' }} />
    }
  }

  const toTitleCase = (str) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const countryCodeToFlag = (countryCode) => {
    return countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
  }

  const unixToTime = (unixTimeStamp) => {
    const dateObject = new Date(unixTimeStamp * 1000)
    return dateObject.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

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
          icon={getWeathericon(weatherData.weather[0].id)}
          temperature={`${convertTemp(weatherData.main.temp, defaultTempUnit)}º${defaultTempUnit}`}
          description={toTitleCase(weatherData.weather[0].description)}
          rawTemperature={convertTemp(weatherData.main.temp, defaultTempUnit)}
          unit={defaultTempUnit}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', mt: '-1rem'}}>
          <Typography variant='h5' sx={{
            textAlign: 'center',
            mt: 2
          }}>
            H: { convertTemp(weatherData.main.temp_max, defaultTempUnit) }º
          </Typography>
          <Typography variant='h5' sx={{
            textAlign: 'center',
            mt: 2
          }}>
            L: { convertTemp(weatherData.main.temp_min, defaultTempUnit) }º
          </Typography>
        </Box>
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
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mt: { xs: 0, sm: 4}
      }}>
        <Card sx={{
           m: 2, 
           width: { xs: 440, sm: 200 }, 
           background: 'linear-gradient(90deg, #FF7E5F, #FEB47B)', 
           color: 'white'
          }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: '0.3rem'}}>Sunrise <WbSunnyIcon />:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Typography variant='h4'>{ unixToTime(weatherData.sys.sunrise) }<ArrowDropUpIcon /></Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{
           m: 2, 
           width: { xs: 440, sm: 200 }, 
           background: 'linear-gradient(90deg, #5A7D9A, #243447)', 
           color: 'white'
          }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: '0.3rem'}}>Sunset <DarkModeIcon />:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Typography variant='h4'>{ unixToTime(weatherData.sys.sunset) }<ArrowDropDownIcon /></Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
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

