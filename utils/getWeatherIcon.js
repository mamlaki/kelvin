import CloudIcon from '@mui/icons-material/Cloud'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import WbSunnyIcon from '@mui/icons-material/WbSunny'

/**
 * Determines and returns the appropraite weather icon component based on the passed through weather ID and optional size.
 * 
 * Weather IDs are categorized as:
 * - 200 to 232: Thunderstorm (FlashOnIcon)
 * - 300 to 321: Drizzle (AcUnitIcon)
 * - 500 to 531: Rain (CloudIcon)
 * - 800 to 801: Clear Sky (SunnyIcon)
 * - Anything Else: (CloudIcon)
 * 
 * @param {number} weatherId - The weather condition ID.
 * @param {string} [size='inherit'] - The desired size for the icon (CSS font-size). Defaults to 'inherit'
 * @returns {JSX.Element} The relevant weather icon as a JSX component.
 */

export const getWeathericon = (weatherId, size = 'inherit') => {
  if (weatherId >= 200 && weatherId <= 232) {
    return <FlashOnIcon style={{ color: 'yellow', fontSize: size }}/>
  } else if (weatherId >= 300 && weatherId <= 321) {
    return <AcUnitIcon style={{ color: 'blue', fontSize: size }} />
  } else if (weatherId >= 500 && weatherId <= 531) {
    return <CloudIcon style={{ color: 'gray', fontSize: size }} />
  } else if (weatherId >= 800 && weatherId <= 801) {
    return <WbSunnyIcon style={{ color: 'orange', fontSize: size }} />
  } else {
    return <CloudIcon style={{ color: 'gray', fontSize: size }} />
  }
}