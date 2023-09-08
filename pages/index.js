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
import DeleteIcon from '@mui/icons-material/Delete'

import WeatherCard from '@/components/WeatherCard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { weatherData, setWeatherData } = useWeather()

  const handleDelete = (cityName, index) => {
    setWeatherData(prevWeatherData => {
      return prevWeatherData.filter((data, i) => i !== index)
    })
    // const updatedWeatherData = weatherData.filter(data => data.name !== cityName)
    // setWeatherData(updatedWeatherData)
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
        {weatherData && weatherData.length > 0 ? (
            weatherData.map((data, index)=> {
              return (
                <WeatherCard 
                  key={index}
                  data={data}
                  onDelete={() => handleDelete(data.name, index)}
                />
              )
            })
          ) : (
            <Typography variant='h6'>No cities planned yet.</Typography>
          )
        }
      </main>
      <footer>

      </footer>
    </>
  )
}
