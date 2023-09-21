import { useState, useEffect } from 'react'

import { getForecastData } from '@/utils/api/weatherapi'

import Card from '@mui/material/Card'

import ForecastItem from './ForecastItem'

import {
  ForecastContainer,
  ForecastArrowLeft,
  ForecastArrowRight,
  ForecastCardContent,
  ForecastBox
} from './Forecast.styles'

export default function Forecast({ cityName, tempUnit }) {
  const [forecastData, setForecastData] = useState([])
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (cityName) {
      getForecastData(cityName)
        .then(data => setForecastData(data.list))
        .catch(error => console.error('Error fetching forecast data: ', error))
    }
  }, [cityName])

  return (
    <ForecastContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      { isHovered && <ForecastArrowLeft /> }
      <Card>
        <ForecastCardContent>
          <ForecastBox>
            {forecastData.map((day, index) =>             
              <ForecastItem key={index} data={day} tempUnit={tempUnit} />
            )}
          </ForecastBox>
        </ForecastCardContent>
      </Card>
      { isHovered && <ForecastArrowRight /> }
    </ForecastContainer>
  )
}