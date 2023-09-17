// Required MaterialUI fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Other
import { SessionProvider } from "next-auth/react"
import { WeatherProvider } from '@/utils/contexts/WeatherContext';
import { TempUnitProvider } from '@/utils/contexts/TempUnitContext';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { ThemeProvider, useThemeMode } from '@/utils/contexts/ThemeContext'
import lightTheme from '@/themes/lightTheme';
import darkTheme from '@/themes/darkTheme';

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


function MainContext({ Component, pageProps }) {
  const { darkMode } = useThemeMode()

  return (
    <MUIThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <WeatherProvider>
        <TempUnitProvider>
          <Navbar />
          <Box
            display='flex'
            flexDirection='column'
            minHeight='100vh'
          >
            <Box flexGrow={1}>
              <Component {...pageProps} />
            </Box>
            <Footer />
          </Box>
        </TempUnitProvider>
      </WeatherProvider>
    </MUIThemeProvider>
  )
}

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider>
        <MainContext Component={Component} pageProps={pageProps} />
      </ThemeProvider>
    </SessionProvider>
  )
}
