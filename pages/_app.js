// Required MaterialUI fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Other
import { SessionProvider } from "next-auth/react"
import { WeatherProvider } from '@/utils/contexts/WeatherContext';
import { TempUnitProvider } from '@/utils/contexts/TempUnitContext';

import Box from '@mui/material/Box'

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


export default function App({ Component, pageProps }) {
    return (
      <SessionProvider session={pageProps.session}>
        <WeatherProvider>
          <TempUnitProvider>
            <Navbar />
            <Box
              display='flex'
              flexDirection='column'
              minHeight='100vh'
            >
              <Box flexGrow={1}>
                <Component {...pageProps}/>
              </Box>
              <Footer />
            </Box>
          </TempUnitProvider>
        </WeatherProvider>
      </SessionProvider>
    )
}
