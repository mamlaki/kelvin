import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';

import { blue } from '@mui/material/colors'
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import { useState } from 'react';
import { useEffect } from 'react';

import { useWeather } from '@/utils/weathercontext';
import { getWeatherData } from '@/utils/api/weatherapi';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const navBlue = blue[500]

export default function Navbar() {
  // Session & Router 
  const { data: session } = useSession()
  const { setWeatherData } = useWeather()
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
  const [city, setCity] = useState('')
  // const [weatherData, setWeatherData] = useState(null)

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
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fetch weather data
  // const fetchWeather = () => {
  //   getWeatherData(city)
  //     .then((data) => {
  //       setWeatherData(data)
  //       console.log('Weather Data: ', data)
  //     }).catch((error) => {
  //       console.error('Failed to fetch weather: ', error)
  //     })
  // }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const cityName = event.target.value
      getWeatherData(cityName)
        .then(data => setWeatherData(data))
        .catch(error => console.error('Failed to fetch weather: ', error))
    }
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
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Enter city"
              inputProps={{ 'aria-label': 'search' }}
              // value={ city }
              // onChange={ (event) => setCity(event.target.value) }
              onKeyDown={ handleKeyPress }
            />
          </Search>
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
        autoHideDuration={2000} 
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