import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'


import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import CloudIcon from '@mui/icons-material/Cloud'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import AcUnitIcon from '@mui/icons-material/AcUnit'

export default function WeatherCard({ data, onDelete }) {
  const [tempUnit, setTempUnit] = useState('C')

  const toggleTempUnit = () => {
    if (tempUnit === 'C') {
      setTempUnit('F')
    } else if (tempUnit === 'F') {
      setTempUnit('K')
    } else {
      setTempUnit('C')
    }
  }

  const convertTemp = (kelvinTemp) => {
    if (tempUnit === 'C') {
      return Math.round(kelvinTemp - 273.15)
    } else if (tempUnit === 'F') {
      return Math.round((kelvinTemp - 273.15) * 9 / 5 + 32)
    } else {
      return Math.round(kelvinTemp)
    }
  }

  const countryCodeToFlag = (countryCode) => {
    return countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
  }

  const getWeathericon = (weatherId) => {
    if (weatherId >= 200 && weatherId <= 232) {
      return <FlashOnIcon style={{ color: 'yellow' }} />
    } else if (weatherId >= 300 && weatherId <= 321) {
      return <AcUnitIcon style={{ color: 'blue' }} />
    } else if (weatherId >= 500 && weatherId <= 531) {
      return <CloudIcon style={{ color: 'gray' }} />
    } else if (weatherId >= 800 && weatherId <= 801) {
      return <WbSunnyIcon style={{ color: 'orange' }} />
    } else {
      return <CloudIcon style={{ color: 'gray' }} />
    }
  }

  return (
    <Card style={{ maxWidth: '300px', width: '100%' }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          { data.name } { countryCodeToFlag(data.sys.country) }
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          { getWeathericon(data.weather[0].id) }
          <Typography variant='subtitle1' color='textSecondary'>
            { data.weather[0].description }
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant='h6'
            component='span'
            onClick={ toggleTempUnit }
            style={{ cursor: 'pointer' }}
          >
            {convertTemp(data.main.temp)}º{tempUnit}
          </Typography>
          <IconButton size='small' onClick={toggleTempUnit}>
            <DeviceThermostatIcon />
          </IconButton>
        </div>
      </CardContent>
      <CardActions>
        <Button size='small' onClick={onDelete} color='error'>Unpin</Button>
      </CardActions>
    </Card>
  )
}