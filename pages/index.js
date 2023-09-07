import Head from 'next/head'
import { Inter } from 'next/font/google'
import Login from '@/components/Login'
import Navbar from '@/components/Navbar'
import TestWeatherFetch from '@/components/TestWeatherFetch'
import { useWeather } from '@/utils/weathercontext'

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
        {/* <TestWeatherFetch /> */}
        {weatherData && (
          <div>
            <h1>{ weatherData.name }</h1>
            <h2>{ weatherData.weather[0].description }</h2>
            <h3>{ Math.round(weatherData.main.temp - 273.15) }ºC</h3>
          </div>
        )}
      </main>
      <footer>

      </footer>
    </>
  )
}
