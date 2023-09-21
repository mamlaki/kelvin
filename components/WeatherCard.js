import { useState, useEffect } from 'react'
import Link from 'next/link'

import { convertTemp } from '@/utils/tempConverter'
import { countryCodeToFlag } from '@/utils/countryCodeToFlag'
import { getWeathericon } from '@/utils/getWeatherIcon'
import { useTempUnit } from '@/utils/contexts/TempUnitContext'
import { toggleTempUnit } from '@/utils/toggleTempUnit'

import { useTheme } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'

export default function WeatherCard({ data, onDelete }) {
  const { defaultTempUnit: globalTempUnit } = useTempUnit()
  const theme = useTheme()

  const [localTempUnit, setLocalTempUnit] = useState(globalTempUnit)

  const isDarkMode = theme.palette.mode === 'dark'

  useEffect(() => {
    setLocalTempUnit(globalTempUnit)
  }, [globalTempUnit])

  const handleTempToggle = () => {
    const nextTempUnit = toggleTempUnit(localTempUnit)
    setLocalTempUnit(nextTempUnit)
  }

  return (
    <Card style={{ maxWidth: '300px', width: '100%' }} role='article' aria-label='Weather Card'>
      <CardContent>
        <Typography variant='h5' component='div'>
          { data.name } <span role='img' aria-label={`Flag of ${data.sys.country}`}>{ countryCodeToFlag(data.sys.country) }</span>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span aria-hidden='true'>{ getWeathericon(data.weather[0].id, '1.6rem') }</span>
          <Typography variant='subtitle1' color='textSecondary'>
            { data.weather[0].description }
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleTempToggle}>
          <Typography 
            variant='h6'
            component='button'
            sx={{ 
              cursor: 'pointer',
              background: 'none', 
              border: 'none',
              color: isDarkMode ? '#E0E0E0' : undefined
            }}
            aria-label={`Current temperature in ${data.name} is ${convertTemp(data.main.temp, localTempUnit)} degrees ${localTempUnit}. Click to toggle temperature unit.`}
          >
            {convertTemp(data.main.temp, localTempUnit)}º{localTempUnit}
          </Typography>
          <IconButton size='small' aria-label='Toggle temperature unit'>
            <DeviceThermostatIcon />
          </IconButton>
        </div>
      </CardContent>
      <CardActions>
        <Button size='small' onClick={onDelete} color='error' aria-label='Unpin this weather card'>Unpin</Button>
        <Link href={`/cities/${data.name}`}>
            <Button size='small' color='primary' aria-label={`View detailed weather informationf or ${data.name}`}>
              Details
            </Button>
        </Link>
      </CardActions>
    </Card>
  )
}