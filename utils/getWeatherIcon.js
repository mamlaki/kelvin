import CloudIcon from '@mui/icons-material/Cloud'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import AcUnitIcon from '@mui/icons-material/AcUnit'

export const getWeathericon = (weatherId) => {
  if (weatherId >= 200 && weatherId <= 232) {
    return <FlashOnIcon style={{ color: 'yellow', fontSize: '3rem' }}/>
  } else if (weatherId >= 300 && weatherId <= 321) {
    return <AcUnitIcon style={{ color: 'blue', fontSize: '3rem' }} />
  } else if (weatherId >= 500 && weatherId <= 531) {
    return <CloudIcon style={{ color: 'gray', fontSize: '3rem' }} />
  } else if (weatherId >= 800 && weatherId <= 801) {
    return <WbSunnyIcon style={{ color: 'orange', fontSize: '3rem' }} />
  } else {
    return <CloudIcon style={{ color: 'gray', fontSize: '3rem' }} />
  }
}