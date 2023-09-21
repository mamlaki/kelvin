import { useState, useEffect } from 'react'

import { getForecastData } from '@/utils/api/weatherapi'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import ForecastItem from './ForecastItem'

export default function Forecast({ cityName, tempUnit }) {
  const [forecastData, setForecastData] = useState([])
  const [isHovered, setIsHovered] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    if (cityName) {
      getForecastData(cityName)
        .then(data => setForecastData(data.list))
        .catch(error => console.error('Error fetching forecast data: ', error))
    }
  }, [cityName])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        mt: 4,
        overflowX: 'hidden',
        maxWidth: isMobile ? '100%' : 700,
        padding: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <ArrowBackIosIcon 
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.2,
            zIndex: 2
          }}
        />
      )}
      <Card>
        <CardContent
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            'MsOverflowStyle': 'none',
            'scrollbarWidth': 'none'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              whiteSpace: 'nowrap',
            }}
          >
            {forecastData.map((day, index) =>             
              <ForecastItem key={index} data={day} tempUnit={tempUnit} />
          )}
          </Box>
        </CardContent>
      </Card>
      {isHovered && (
        <ArrowForwardIosIcon 
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: 0.2,
            zIndex: 2,
          }}
        />
      )}
    </Box>
  )
}