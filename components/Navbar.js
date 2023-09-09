import * as React from 'react';
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';

import Link from 'next/link'
import { signOut } from 'next-auth/react'

import { useWeather } from '@/utils/WeatherContext';
import { getWeatherData } from '@/utils/api/weatherapi';
import { useDebounce } from '@/utils/useDebounce';
import cities from '../utils/jsondata/cities'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

import { blue } from '@mui/material/colors'
const navBlue = blue[500]

export default function Navbar() {
  // Session & Router 
  const { data: session } = useSession()
  const { weatherData, setWeatherData } = useWeather()
  const router = useRouter()
  const [lastSessionState, setLastSessionState] = useState(null)

  // Snackbar stateful variables
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [initialLoad, setInitialLoad] = useState(true)

  // Menu stateful variables 
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Weather and city search stateful variables
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [enterKeyPressed, setEnterKeyPressed] = useState(false)
  const [suggestionClicked, setSuggestionClicked] = useState(false)

  const debounceTimeout = useRef(null)
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

  const fetchWeatherData = (cityName) => {
    console.log('Attempting to fetch: ', cityName)

    if (weatherData.some(data => data.name === cityName)) {
      console.log('City already added.')
      return
    }

    setIsProcessing(true)
    getWeatherData(cityName)
      .then(data => {
        setWeatherData(prevWeatherData => [...prevWeatherData, data])
      })
      .catch(error => console.error('Failed to fetch weather: ', error))
      .finally(() => {
        setIsProcessing(false)
      })
  }

  const handleKeyPress = (event) => {
    if (isProcessing) return
    if (event.key === 'Enter') {
      setEnterKeyPressed(true)
    } else if (event.key === 'Escape') {
      event.target.blur()
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm && enterKeyPressed) {
      fetchWeatherData(debouncedSearchTerm)
      setEnterKeyPressed(false)
    }
  }, [debouncedSearchTerm, enterKeyPressed])

  // Search suggestions functionality
  useEffect(() => {
    if (searchTerm) {
      const filteredCities = Array.from(new Set(cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)))
      setSuggestions(filteredCities)
    } else {
      setSuggestions([])
    }
  }, [searchTerm])

  const handleSearchInputChange = (event) => {
    clearTimeout(debounceTimeout.current)

    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(event.target.value)
    }, 100)
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static"
        style={{ backgroundColor: navBlue }}
        >
        <Toolbar>
          <Link href='/'>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
            >
                Kelvin
            </Typography>
          </Link>
          <Autocomplete 
            id='auto-complete'
            autoComplete
            options={suggestions.map((option) => option)}
            renderInput={(params) => (
              <TextField {...params}
                label='Enter City'
                sx={{ width: 300, backgroundColor: 'white' }}
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
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !suggestionClicked) {
                event.preventDefault()
                console.log("Enter key was pressed but default prevented")
                setEnterKeyPressed(true)
              }
            }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
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