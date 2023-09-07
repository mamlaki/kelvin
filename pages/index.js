import Head from 'next/head'
import { Inter } from 'next/font/google'
import Login from '@/components/Login'
import Navbar from '@/components/Navbar'
import TestWeatherFetch from '@/components/TestWeatherFetch'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
        <TestWeatherFetch />
      </main>
      <footer>

      </footer>
    </>
  )
}
