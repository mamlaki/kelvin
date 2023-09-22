// React & Next.js Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// Contexts & Utils
import { useColorTheme } from '@/utils/contexts/ColorThemeContext';
import { useSnackbar } from '@/utils/contexts/SnackbarContext';
import { useWeather } from '@/utils/contexts/WeatherContext';
import { blendWithBackground } from '@/utils/colorfuncs/blendWithBackground';
import { ensureRGBA } from '@/utils/colorfuncs/ensureRGBA';
import { rgbToHex } from '@/utils/colorfuncs/rgbToHex';

// MUI Utils
import { getLuminance } from '@mui/material';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuiAlert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Toolbar from '@mui/material/Toolbar';

// MUI Icons
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

// Local Components / Other
import SettingsMenu from './SettingsMenu';
import Searchbar from './Searchbar/Searchbar';
import UserMenu from './UserMenu';

export default function Navbar() {
  // Session, Router, Contexts 
  const router = useRouter()
  const { data: session } = useSession()
  const { weatherData, setWeatherData } = useWeather()
  const { colorTheme, setColorTheme } = useColorTheme()
  const { snackBarOpen, snackBarMessage, openSnackbar, closeSnackbar} = useSnackbar()

  const [lastSessionState, setLastSessionState] = useState(null)
  const [initialLoad, setInitialLoad] = useState(true)

  // Menu stateful variables 
  const [anchorEl, setAnchorEl] = useState(null);

  // Settings stateful variables
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    console.log('Updated weatherData: ', weatherData)
  }, [weatherData])

  useEffect(() => {
    let timer
    if (snackBarOpen) {
      timer = setTimeout(() => {
        closeSnackbar()
        if (snackBarMessage === 'Signed out successfully') {
          router.push('/')
        }
      }, 1000)
    }
    return () => clearTimeout(timer)
  }, [snackBarOpen, snackBarMessage, router])

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (initialLoad) {
        setInitialLoad(false)
        return
      }

      if (url === '/' && lastSessionState !== session) {
        setLastSessionState(session)

        if (session) {
          openSnackbar('Signed in successfully')
        } else {
          openSnackbar('Signed out successfully')
        }
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [session, router.events, lastSessionState])

  // Menu functions
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const menuId = 'primary-search-account-menu';

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen)
  }

  const colorThemeRGBA = ensureRGBA(colorTheme)

  const darkModeBackground = { r: 48, g: 48, b: 48 }
  const effectiveRGB = colorThemeRGBA.a < 1 ? blendWithBackground(colorThemeRGBA, darkModeBackground) : colorThemeRGBA  

  const effectiveHex = rgbToHex(effectiveRGB.r, effectiveRGB.g, effectiveRGB.b)

  const isBright = getLuminance(effectiveHex) > 0.7

  return (
    <Box sx={{ flexGrow: 1, margin: -1 }}>
      <AppBar 
        position="static"
        style={{ backgroundColor: colorTheme }}
        >
        <Toolbar>
          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'center' }
          }}>
            <Searchbar />
          </Box>
          <Box sx={{ display: { md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              sx={{ color: isBright ? 'black' : 'white' }}
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="settings menu"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleSettingsToggle}
              sx={{ color: isBright ? 'black' : 'white' }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <SettingsMenu 
        settingsOpen={settingsOpen}
        handleSettingsToggle={handleSettingsToggle}
        colorTheme={colorTheme}
        setColorTheme={setColorTheme}
      />
      <UserMenu 
        anchorEl={anchorEl}
        handleProfileMenuOpen={handleProfileMenuOpen}
        handleMenuClose={handleMenuClose}
      />
      <Snackbar 
        open={snackBarOpen} 
        autoHideDuration={5000} 
        onClose={closeSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          severity='success'
        >
          {snackBarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}