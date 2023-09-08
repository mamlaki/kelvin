import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'

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

  return (
    <Grid container spacing={2} justifyContent={'center'}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h5' component='div'>
              { data.name }
            </Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              { data.weather[0].description }
            </Typography>
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
            <Button size='small' onClick={onDelete}>Delete</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}