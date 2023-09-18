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

import { keyframes } from '@emotion/react'
import Forecast from '@/components/Forecast'
import { convertTemp } from '@/utils/tempConverter'

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

  const bubbleAnimation1 = keyframes`
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-30px);
    }
    100% {
      transform: translateY(0);
    }
  `

  const bubbleAnimation2 = keyframes`
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(20px);
    }
    100% {
      transform: translateY(0);
    }
  `

  const generateBubble = (top, left, width, height, animation, duration) => {
    return {
      content: '""',
      position: 'absolute',
      top,
      left,
      width,
      height,
      borderRadius: '50%',
      background: `radial-gradient(circle at center, rgba(255, 255, 255, ${0.2 + Math.random() * 0.3}) 0%, transparent 70%)`,
      animation: `${animation} ${duration} infinite alternate`
    }
  }

  const getBackgroundByTemp = (temperature, unit = 'C') => {
    let temp = temperature

    if (unit === 'F') {
      temp = (temp - 32) * 5 / 9
    }

    if (unit === 'K') {
      temp = temp - 273.15
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', m: 2, p: 2, gap: 1 }}>
          <Typography variant='h2' sx={{ textAlign: 'center', mt: 2 }}>
            { getWeathericon(weatherData.weather[0].id) }
          </Typography>
          <Typography variant='h2' fontWeight='bold' sx={{
            background: getBackgroundByTemp(convertTemp(weatherData.main.temp, defaultTempUnit), defaultTempUnit),
            backgroundClip: 'text',
            textFillColor: 'transparent'
          }}>
            { 
              convertTemp(weatherData.main.temp, defaultTempUnit) 
            }
            º
            { 
              defaultTempUnit 
            }
          </Typography>
        </Box>
        {/* <Card sx={{
          position: 'relative',
          overflow: 'hidden',
          m: 2,
          maxWidth: 150,
          borderRadius: '3rem',
          p: 2,
          background: getBackgroundByTemp(convertTemp(weatherData.main.temp, defaultTempUnit), defaultTempUnit),
          '::before': generateBubble('10%', '-10%', '50%', '50%', bubbleAnimation1, '10s'),
          '::after': generateBubble('40%', '60%', '40%', '40%', bubbleAnimation2, '15s'),
          ...Array(5).fill().map((_, index) => ({
            [`::nth-of-type(${index})`]: generateBubble(
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${20 + Math.random() * 30}%`,
              `${20 + Math.random() * 30}%`,
              Math.random() > 0.5 ? bubbleAnimation1 : bubbleAnimation2,
              `${10 + Math.random() * 10}s`
            )
          }))
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
        </Card> */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.6rem', mt: '-2rem' }}>
          
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
        m: 4
      }}>
        <Forecast cityName={weatherData.name} tempUnit={defaultTempUnit} />
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mt: 4
      }}>
        <Card sx={{ m: 2, width: { xs: 440, sm: 200 }, textAlign: { xs: 'center', sm: 'left' } }}> 
          <CardContent>
            <Typography variant='h6'>Feels Like:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4' sx={{ margin: { xs: '0 auto', sm: '0 0' } }}>
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
        <Card sx={{ m: 2, width: { xs: 440, sm: 200 }, textAlign: { xs: 'center', sm: 'left' } }}> 
          <CardContent>
            <Typography variant='h6'>Humidity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4' sx={{ margin: { xs: '0 auto', sm: '0 0' } }}>{ weatherData.main.humidity }%</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ m: 2, width: { xs: 440, sm: 200 }, textAlign: { xs: 'center', sm: 'left' } }}> 
          <CardContent>
            <Typography variant='h6'>Wind Speed:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='h4' sx={{ margin: { xs: '0 auto', sm: '0 0' } }}>{ weatherData.wind.speed } m/s</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
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

