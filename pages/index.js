import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useWeather } from '@/utils/WeatherContext'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'

import WeatherCard from '@/components/WeatherCard'

const inter = Inter({ subsets: ['latin'] })

import { blue } from '@mui/material/colors'
const navBlue = blue[500]

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
        <footer>
          <Box sx={{ backgroundColor: navBlue, color: '#FFFFFF', py: 6, textAlign: 'center', margin: -1}}>
            <Container maxWidth='lg'>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='h6'>Kelvin</Typography>
                  <Typography variant='body2'>Your cliamte, simplified.</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h6'>Quick Links</Typography>
                  <Link href='#' color='inherit' underline='none'>
                    Home
                  </Link>
                  <Link href='#' color='inherit' underline='none'>
                    About
                  </Link>
                  <Link href='#' color='inherit' underline='none'>
                    Contact
                  </Link>
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography variant='body2' align='center'>
                  © 2023 Melek Redwan. All rights reserved.
                </Typography>
              </Box>
            </Container>
          </Box>
        </footer>
      </Box>
    </>
  )
}
