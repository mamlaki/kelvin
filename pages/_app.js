import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { SessionProvider } from "next-auth/react"


export default function App({ Component, pageProps }) {
    return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps}/>
      </SessionProvider>
    )
}
