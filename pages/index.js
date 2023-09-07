import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useWeather } from '@/utils/weathercontext'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { weatherData } = useWeather()

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
                  <Typography variant='h6'>
                    { Math.round(weatherData.main.temp - 273.15) }ºC
                  </Typography>
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
