import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getWeatherData } from '@/utils/api/weatherapi'

import { useTempUnit } from '@/utils/contexts/TempUnitContext'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

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
      <Typography variant='h2' component='h1' sx={{
        textAlign: 'center',
        mt: 5
      }}>
        { weatherData.name }
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mt: 4
      }}>
        <Card sx={{ m: 2, minWidth: 200 }}>
          <CardContent>
            <Typography variant='h6'>Current Temperature:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center '}}>
              <Typography variant='h4'>
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
    </Container>
  )
}

