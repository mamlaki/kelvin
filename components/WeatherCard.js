import { useState, useEffect } from 'react'
import Link from 'next/link'

import { convertTemp } from '@/utils/tempConverter'
import { countryCodeToFlag } from '@/utils/countryCodeToFlag'
import { getWeathericon } from '@/utils/getWeatherIcon'
import { useTempUnit } from '@/utils/contexts/TempUnitContext'
import { toggleTempUnit } from '@/utils/toggleTempUnit'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'

export default function WeatherCard({ data, onDelete }) {
  const { defaultTempUnit: globalTempUnit } = useTempUnit()
  const [localTempUnit, setLocalTempUnit] = useState(globalTempUnit)

  useEffect(() => {
    setLocalTempUnit(globalTempUnit)
  }, [globalTempUnit])

  const handleTempToggle = () => {
    const nextTempUnit = toggleTempUnit(localTempUnit)
    setLocalTempUnit(nextTempUnit)
  }

  return (
    <Card style={{ maxWidth: '300px', width: '100%' }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          { data.name } { countryCodeToFlag(data.sys.country) }
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          { getWeathericon(data.weather[0].id, '1.6rem') }
          <Typography variant='subtitle1' color='textSecondary'>
            { data.weather[0].description }
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant='h6'
            component='span'
            onClick={ handleTempToggle }
            style={{ cursor: 'pointer' }}
          >
            {convertTemp(data.main.temp, localTempUnit)}º{localTempUnit}
          </Typography>
          <IconButton size='small' onClick={handleTempToggle}>
            <DeviceThermostatIcon />
          </IconButton>
        </div>
      </CardContent>
      <CardActions>
        <Button size='small' onClick={onDelete} color='error'>Unpin</Button>
        <Link href={`/cities/${data.name}`}>
          
            <Button size='small' color='primary'>
              Details
            </Button>
          
        </Link>
      </CardActions>
    </Card>
  )
}