import Head from 'next/head'
import { useState } from 'react'
import { Inter } from 'next/font/google'
import { useWeather } from '@/utils/weathercontext'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { weatherData } = useWeather()
  const [tempUnit, setTempUnit] = useState('C')

  const toggleTempUnit = () => {
    if (tempUnit === 'C') {
      setTempUnit('F')
    } else if (tempUnit === 'F') {
      setTempUnit('K')
    } else {
      setTempUnit('C')
    }
  }

  const convertTemp = (kelvinTemp) => {
    if (tempUnit === 'C') {
      return Math.round(kelvinTemp - 273.15)
    } else if (tempUnit === 'F') {
      return Math.round((kelvinTemp - 273.15) * 9 / 5 + 32)
    } else {
      return Math.round(kelvinTemp)
    }
  }

  return (
    <>
      <Head>
        <title>Kelvin | Home</title>
        <meta name="description" content="Kelvin. Your climate, simplified." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <header>
      </header>
      <main>
        {weatherData && (
          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant='h5' component='div'>
                    { weatherData.name }
                  </Typography>
                  <Typography variant='subtitle1' color='textSecondary'>
                    { weatherData.weather[0].description }
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant='h6'
                      component='span'
                      onClick={toggleTempUnit}
                      style={{cursor: 'pointer'}}

                    >
                      {convertTemp(weatherData.main.temp)}º{tempUnit}
                    </Typography>
                    <IconButton size='small' onClick={toggleTempUnit}>
                      <DeviceThermostatIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </main>
      <footer>

      </footer>
    </>
  )
}
