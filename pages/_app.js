import { ThemeProvider } from "@emotion/react"
import theme from "./theme"
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
      theme={ theme }
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
    
  )
}
