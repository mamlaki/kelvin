import { ThemeProvider, createTheme } from "@mui/material/styles"
import themeOptions from "./theme"
import { SessionProvider } from "next-auth/react"

const theme = createTheme(themeOptions)

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
