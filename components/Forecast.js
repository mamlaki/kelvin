import { useState, useEffect } from 'react'

import { getForecastData } from '@/utils/api/weatherapi'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import WbSunnyIcon from '@mui/icons-material/WbSunny'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import { convertTemp } from '@/utils/tempConverter'
import { formatTime } from '@/utils/timeUtils'
import { isDayTime } from '@/utils/timeUtils'

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
            {forecastData.map((day, index) => (
            <Box key={index} sx={{ mx: 2, textAlign: 'center' }}>
              <Typography variant='body1' fontWeight='bold' marginBottom={2}>{ formatTime(new Date(day.dt * 1000)) }</Typography>
              <Typography variant='body1' marginBottom={2}>{ isDayTime(new Date(day.dt * 1000)) ? <WbSunnyIcon /> : <DarkModeIcon /> }</Typography>
              <Typography variant='body1'>{ convertTemp(day.main.temp, tempUnit) }º</Typography>
            </Box>
          ))}
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