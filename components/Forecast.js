import { useState, useEffect } from 'react'

import { getForecastData } from '@/utils/api/weatherapi'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function Forecast({ cityName }) {
  const [forecastData, setForecastData] = useState([])

  useEffect(() => {
    if (cityName) {
      getForecastData(cityName)
        .then(data => setForecastData(data.list.slice(0, 3)))
        .catch(error => console.error('Error fetching forecast data: ', error))
    }
  }, [cityName])

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        mt: 4
      }}
    >
      {forecastData.map((day, index) => (
        <Card key={index} sx={{ m: 2, minWidth: 150 }}>
          <CardContent>
            <Typography variant='h6'>{ new Date(day.dt * 1000).toDateString() }</Typography>
            {console.log(day)}
            <Typography variant='body1'>{ `Temp: ${day.main.temp}º` }</Typography>
          </CardContent>
        </Card>
      ))}      
    </Box>
  )
}