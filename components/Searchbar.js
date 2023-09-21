import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { useWeather } from '@/utils/contexts/WeatherContext'
import { getWeatherData } from '@/utils/api/weatherapi'
import { useDebounce } from '@/utils/useDebounce'

import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import SearchIcon from '@mui/icons-material/Search'

import cities from '../utils/jsondata/cities'

export default function Search() {
  const router = useRouter()

  const { weatherData, setWeatherData } = useWeather()

  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [enterKeyPressed, setEnterKeyPressed] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false)
  const [isSelectionMade, setIsSelectionMade] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 100)

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        const filteredCities = Array.from(new Set(cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 10)))
        setSuggestions(filteredCities)
      } else {
        setSuggestions([])
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [searchTerm])

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
  
  const handleSearchInputChange = (event) => {
        const newInputValue = event.target.value
      console.log('handleSearchInputChange: ', newInputValue)
      setInputValue(event.target.value)
      setSearchTerm(event.target.value)
  }

  return (
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
  )
}


