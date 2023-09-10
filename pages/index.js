import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useWeather } from '@/utils/WeatherContext'

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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Container component='main' sx={{ flex: '1 0 auto' }}>
          <main>  
            <Container maxWidth='md'>
              <Grid container spacing={3} sx={{ marginTop: '1rem' }}>
                {weatherData && weatherData.length > 0 ? (
                  weatherData.map((data, index)=> {
                    return (
                      <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
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
                      // style={{ minHeight: '100vh' }}
                    >
                      <Grid item xs={12}>
                        <Typography variant='h6'>No cities added yet</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='h6'>😔</Typography>
                      </Grid>
                    </Grid>
                  )
                }
              </Grid>
            </Container>
          </main>
        </Container>
      </Box>
    </>
  )
}
