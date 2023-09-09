// Required MaterialUI fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Other
import { SessionProvider } from "next-auth/react"
import { WeatherProvider } from '@/utils/WeatherContext';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }) {
    return (
      <SessionProvider session={pageProps.session}>
        <WeatherProvider>
          <Navbar />
          <Component {...pageProps}/>
        </WeatherProvider>
      </SessionProvider>
    )
}
