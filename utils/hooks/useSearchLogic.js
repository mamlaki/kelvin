import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWeather } from '../contexts/WeatherContext'
import { getWeatherData } from '../api/weatherapi'
import { useDebounce } from '../useDebounce'
import cities from '../jsondata/cities'

export const useSearchLogic = () => {
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

  return {
    timeoutId,
    setSearchTerm,
    suggestions,
    inputValue,
    setInputValue,
    isSuggestionSelected,
    setIsSuggestionSelected,
    setIsSelectionMade,
    fetchWeatherData,
    handleKeyPress,
    handleSearchInputChange
  }
}