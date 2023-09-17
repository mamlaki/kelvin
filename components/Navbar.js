import * as React from 'react';
import { useState, useEffect } from 'react'
import { SketchPicker } from 'react-color';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef } from 'react';

import Link from 'next/link'
import { signOut } from 'next-auth/react'

import { useWeather } from '@/utils/contexts/WeatherContext';
import { useTempUnit } from '@/utils/contexts/TempUnitContext';
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
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import Switch from '@mui/material/Switch'

import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import ColorLensIcon from '@mui/icons-material/ColorLens'

import { blue } from '@mui/material/colors'
import { green } from '@mui/material/colors'
import { red } from '@mui/material/colors'
import { useThemeMode } from '@/utils/contexts/ThemeContext';
// const navBlue = blue[500]
import { useColorTheme } from '@/utils/contexts/ColorThemeContext';


export default function Navbar() {
  // Session & Router 
  const { data: session } = useSession()
  const { weatherData, setWeatherData } = useWeather()
  const router = useRouter()
  const [lastSessionState, setLastSessionState] = useState(null)
  const { darkMode, toggleDarkMode } = useThemeMode()
  
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
  const { defaultTempUnit, setDefaultTempUnit } = useTempUnit()

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

  const { colorTheme, setColorTheme } = useColorTheme()
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const colorPickerRef = useRef()
  const settingsRef = useRef(null)

  const handleColorChange = (color) => {
    setColorTheme(color.hex)
  }

  const handleClickOutside = (event) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        handleSettingsToggle()
      }
      setDisplayColorPicker(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="settings menu"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleSettingsToggle}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog
        ref={settingsRef}
        open={settingsOpen}
        onClose={handleSettingsToggle}
        aria-labelledby='settings-dialog-title'
        maxWidth='lg'
        fullWidth={true}
        PaperProps={{
          sx: { width: '80%'}
        }}
      >
        <DialogTitle id='settings-dialog-title'>Settings</DialogTitle>
        <DialogContent sx={{ minHeight: 400 }}>
          <FormControl fullWidth variant='outlined' sx={{ mt: 2 }}>
            <InputLabel id='default-temp-unit-label'>Default Temperature Unit</InputLabel>
            <Select
              labelId='default-temp-unit-label'
              id='default-temp-unit'
              value={defaultTempUnit}
              onChange={(event) => setDefaultTempUnit(event.target.value)}
              label='Default Temperature Unit'
            >
              <MenuItem value={'C'}>Celsius</MenuItem>
              <MenuItem value={'F'}>Fahrenheit</MenuItem>
              <MenuItem value={'K'}>Kelvin</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel 
            control={
              <Switch 
                checked={darkMode}
                onChange={toggleDarkMode}
                name='darkMode'
                color='primary' 
              />
            }
            label='Dark Mode'
          />
          <Typography varaint='subtitle1' sx={{ mt: 2 }}>Colour Theme</Typography>
          <Box sx={{ mt: 2, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setDisplayColorPicker(true)}>
            <ColorLensIcon />
            <Box width={36} height={36} style={{ backgroundColor: colorTheme}} />
          </Box>
          {displayColorPicker ?
            <Box ref={colorPickerRef} sx={{ display: 'inline-block' }}>
              <SketchPicker color={colorTheme} onChangeComplete={handleColorChange} />  
            </Box>
          : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsToggle} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
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