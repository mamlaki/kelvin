import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useWeather } from '@/utils/contexts/WeatherContext'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

import WeatherCard from '@/components/WeatherCard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { weatherData, setWeatherData } = useWeather()

  const handleDelete = (cityName, index) => {
    setWeatherData(prevWeatherData => {
      return prevWeatherData.filter((data, i) => i !== index)
    })
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
          <Container maxWidth='md'>
            <Grid container spacing={3} sx={{ marginTop: '1rem' }}>
              {weatherData && weatherData.length > 0 ? (
                weatherData.map((data, index)=> {
                  return (
                    <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
                      <WeatherCard 
                        data={data}
                        onDelete={() => handleDelete(data.name, index)}
                      />
                    </Grid>
                  )
                })
              ) : (
                  <Grid
                    container
                    spacing={0}
                    direction='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      '&::before': {
                          content: '"😔"',
                          position: 'absolute',
                          top: '400%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '6rem',
                          opacity: 0.3,
                          filter: 'grayscale(100%)',
                          zIndex: -1,
                      }
                    }}
                  >
                    <Grid item xs={12}>
                      <Typography variant='h6'>No cities added yet</Typography>
                      <Typography variant='h6'>Use the search bar above to start adding cities</Typography>
                    </Grid>
                  </Grid>
                )
              }
            </Grid>
          </Container>
        </main>
    </>
  )
}
