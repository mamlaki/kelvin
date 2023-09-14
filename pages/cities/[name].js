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

import { blue } from '@mui/material/colors'
const navBlue = blue[500]

// const TemperatureMap = ({weatherData}) => {
//   const mapUrl = "https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=7cc6e0a83f9a403f080358c184ad3562"

//   return (
//     <DynamicMapContainer 
//     center={[51.505, -0.09]} 
//     zoom={13} 
//     style={{ height: '400px', width: '400px' }}
//     whenCreated={mapInstance => console.log('Map created:', mapInstance)}
//   >
//     <DynamicTileLayer url={mapUrl} /> 
//   </DynamicMapContainer>
  
//   )
// }

export default function WeatherDetail() {
  const router = useRouter()
  const { name } = router.query
  
  const { defaultTempUnit } = useTempUnit()
  const [weatherData, setWeatherData] = useState(null)

  const convertTemp = (kelvinTemp, unit) => {
    if (unit === 'C') {
      return Math.round(kelvinTemp - 273.15)
    } else if (unit === 'F') {
      return Math.round((kelvinTemp - 273.15) * 9 / 5 + 32)
    } else {
      return Math.round(kelvinTemp)
    }
  }

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

  const getBackgroundByTemp = (temperature, unit = 'C') => {
    let temp = temperature

    if (unit === 'F') {
      temp = (temp - 32) * 5 / 9
    }

    if (temp >= 25) {
      return 'linear-gradient(45deg, #FF4500, #FF8C00)'
    } else if (temp >= 15) {
      return 'linear-gradient(45deg, #3CB371, #20B2AA)'
    } else {
      return 'linear-gradient(45deg, #1E90FF, #00008B)'
    }

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
        <Card sx={{
          m: 2,
          maxWidth: 150,
          borderRadius: '3rem',
          p: 2, 
          background: getBackgroundByTemp(convertTemp(weatherData.main.temp, defaultTempUnit), defaultTempUnit)
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center ', justifyContent: 'center'}}>
              <Typography variant='h4' color='white'>
                { 
                  convertTemp(weatherData.main.temp, defaultTempUnit) 
                }
                º
                { 
                  defaultTempUnit 
                }
              </Typography>
            </Box>  
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.6rem', mt: '-2rem' }}>
          <Typography variant='h2' sx={{
            textAlign: 'center',
            mt: 2
          }}>
            { getWeathericon(weatherData.weather[0].id) }
          </Typography>
          <Typography variant='h5' sx={{
            textAlign: 'center',
            mt: 2
          }}>
            { toTitleCase(weatherData.weather[0].description) }        
          </Typography>
        </Box>
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
        mt: 4
      }}>
        <Card sx={{ m: 2, minWidth: 200 }}> 
          <CardContent>
            <Typography variant='h6'>Feels Like:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>
                {
                  convertTemp(weatherData.main.feels_like, defaultTempUnit)
                }
                º
                {
                  defaultTempUnit
                }  
              </Typography>      
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ m: 2, minWidth: 200 }}>
          <CardContent>
            <Typography variant='h6'>Humidity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>{ weatherData.main.humidity }%</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ m: 2, minWidth: 200}}>
          <CardContent>
            <Typography variant='h6'>Wind Speed:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>{ weatherData.wind.speed } m/s</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mt: 4
      }}>
        <Card sx={{
           m: 2, 
           minWidth: 200, 
           background: 'linear-gradient(90deg, #FF7E5F, #FEB47B)', 
           color: 'white'
          }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem'}}>Sunrise <WbSunnyIcon />:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4'>{ unixToTime(weatherData.sys.sunrise) }<ArrowDropUpIcon /></Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{
           m: 2, 
           minWidth: 200, 
           background: 'linear-gradient(90deg, #5A7D9A, #243447)', 
           color: 'white'
          }}>
          <CardContent>
            <Typography variant='h6' sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Sunset <DarkModeIcon />:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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

