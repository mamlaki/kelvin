import { formatTime, isDayTime } from '@/utils/timeUtils'
import { convertTemp } from '@/utils/tempConverter'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import WbSunnyIcon from '@mui/icons-material/WbSunny'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export default function ForecastItem({ data, tempUnit }) {
  return (
    <Box sx={{ mx: 2, textAlign: 'center '}}>
     <Typography 
        variant='body1' 
        fontWeight='bold' 
        marginBottom={2}
      >
      { formatTime(new Date(data.dt * 1000)) }
      </Typography>
      <Typography variant='body1' marginBottom={2}>
        { isDayTime(new Date(data.dt * 1000)) ? <WbSunnyIcon /> : <DarkModeIcon /> }
      </Typography>
      <Typography variant='body1'>
        { convertTemp(data.main.temp, tempUnit) }º
      </Typography>
    </Box>
  )
}