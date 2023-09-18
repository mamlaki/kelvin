import * as React from 'react';
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react'
import { useWeather } from '@/utils/contexts/WeatherContext';
import { useColorTheme } from '@/utils/contexts/ColorThemeContext';
import { useDebounce } from '@/utils/useDebounce';
import { ensureRGBA } from '@/utils/colorfuncs/ensureRGBA';
import { rgbToHex } from '@/utils/colorfuncs/rgbToHex';
import { blendWithWhite } from '@/utils/colorfuncs/blendWithWhite';
import { getWeatherData } from '@/utils/api/weatherapi';

import { getLuminance } from '@mui/material';
import cities from '../utils/jsondata/cities'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import SettingsMenu from './SettingsMenu';

import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Navbar() {
  // Session & Router 
  const router = useRouter()

  const { data: session } = useSession()
  const { weatherData, setWeatherData } = useWeather()
  const { colorTheme, setColorTheme } = useColorTheme()
  const [lastSessionState, setLastSessionState] = useState(null)
  
  // Snackbar stateful variables
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [initialLoad, setInitialLoad] = useState(true)

  // Menu stateful variables 
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Settings stateful variables
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Weather and city search stateful variables
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [enterKeyPressed, setEnterKeyPressed] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false)
  const [isSelectionMade, setIsSelectionMade] = useState(false)
  
  const debouncedSearchTerm = useDebounce(searchTerm, 100)

  useEffect(() => {
    console.log('Updated weatherData: ', weatherData)
  }, [weatherData])

  // Snackbar functions
  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackBarOpen(false)
  }

  const handleSignInClick = () => {
    router.push('/signin')
  }

  const handleSignOutClick = async () => {
    setSnackBarMessage('Signing out...')
    setSnackBarOpen(true)
    await signOut({ redirect: false })
    setSnackBarMessage('Signed out successfully')
    setTimeout(() => {
      setSnackBarOpen(false)
      router.push('/')
    }, 1000)
  }

  useEffect(() => {
    let timer
    if (snackBarOpen) {
      timer = setTimeout(() => {
        setSnackBarOpen(false)
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
          setSnackBarMessage('Signed in successfully')
        } else {
          setSnackBarMessage('Signed out successfully')
        }

        setSnackBarOpen(true)
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


  const fetchWeatherData = async (cityName) => {
    if (!cityName) {
      console.log('Empty city name provided. Exiting fetchWeatherData')
      return
    }

    console.log('Fetching weather data for: ', cityName)

    if (router.pathname.startsWith('/cities/')) {
      router.push(`/cities/${cityName}`)
      return
    }

    if (weatherData.some(data => data.name === cityName)) {
      console.log('City already added.')
      return
    }
    setIsProcessing(true)

    try {
      const data = await getWeatherData(cityName)
      console.log('Received data: ', data)
      setWeatherData(prevWeatherData => [...prevWeatherData, data])
      setSearchTerm('')
    } catch (error) {
      console.error('Failed to fetch weather: ', error)
    } finally {
      setIsProcessing(false)
    }
  }

  let timeoutId

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (!isSuggestionSelected) {
        timeoutId = setTimeout(() => {
          fetchWeatherData(inputValue)
        }, 100)
      } else {
        clearTimeout(timeoutId)
      }

      setIsSuggestionSelected(false)
      setIsSelectionMade(false)
    }
  }

  useEffect(() => {
    if (enterKeyPressed && !isProcessing) {
      console.log('Enter key Pressed: ', debouncedSearchTerm)
      fetchWeatherData(debouncedSearchTerm)
      setEnterKeyPressed(false)
    }
  }, [debouncedSearchTerm, enterKeyPressed, isProcessing])

  // Search suggestions functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filteredCities = Array.from(new Set(cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)));
        setSuggestions(filteredCities);
      } else {
        setSuggestions([]);
      }
    }, 100);
  
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchInputChange = (event) => {
    const newInputValue = event.target.value
    console.log('handleSearchInputChange: ', newInputValue)
    setInputValue(event.target.value)
    setSearchTerm(event.target.value)
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Dashboard</MenuItem>
      <MenuItem onClick={handleMenuClose}>
        { !session ?
            <button onClick={handleSignInClick}>Sign In</button>
            :
            <button onClick={handleSignOutClick}>Sign Out</button>
        }
      </MenuItem>
    </Menu>
  );

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen)
  }

  const colorThemeRGBA = ensureRGBA(colorTheme)
  const effectiveRGB = colorThemeRGBA.a < 1 ? blendWithWhite(colorThemeRGBA) : colorThemeRGBA  
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
            <Autocomplete 
              id='auto-complete'
              autoComplete
              options={suggestions.map((option) => option)}
              renderInput={(params) => (
                <TextField {...params}
                  placeholder='Enter City'
                  sx={{
                    width: { xs: 300, md: 400 },
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px',
                      bordercolor: 'rgba(0, 0, 0, 0.23'
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon />
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleKeyPress}
                />
              )}
              onInputChange={(event, newInputValue, reason) => {
                console.log('onInputChange - newInputValue: ', newInputValue)
                console.log('onInputChange - reason: ', reason)
                if (reason === 'select-option' || reason === 'reset') {
                  clearTimeout(timeoutId)
                  fetchWeatherData(newInputValue)
                  setIsSuggestionSelected(true)
                  setIsSelectionMade(true)
                } else {
                  setIsSelectionMade(false)
                }
                setInputValue(newInputValue)
                setSearchTerm(newInputValue)
              }}
              onKeyDown={(event) => {
                if (isSuggestionSelected) {
                  console.log('Selected value being fetched: ', inputValue)
                  setIsSuggestionSelected(false)
                  fetchWeatherData(inputValue)
                }
              }}
            />
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
      {renderMenu}
      <Snackbar 
        open={snackBarOpen} 
        autoHideDuration={5000} 
        onClose={handleSnackBarClose}
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