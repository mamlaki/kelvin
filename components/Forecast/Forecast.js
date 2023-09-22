// React & Next.js Imports
import { useState, useEffect } from 'react'

// Contexts, Utils & APIs
import { getForecastData } from '@/utils/api/weatherapi'

// MUI Components
import Card from '@mui/material/Card'

// Local Components / Other
import ForecastItem from './ForecastItem'
import {
  ForecastArrowLeft,
  ForecastArrowRight,
  ForecastBox,
  ForecastCardContent,
  ForecastContainer
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