import { convertTemp } from '@/utils/tempConverter'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function TemperatureDetails({ maxTemp, minTemp, tempUnit }) {
  return (
    <Box sx={{
      display: 'flex',
      alighItems: 'center',
      gap: '1rem',
      mt: '-1rem'
    }}>
      <Typography variant='h5' sx={{ textAlign: 'center', mt: 2 }}>
        H: { convertTemp(maxTemp, tempUnit) }º
      </Typography>
      <Typography variant='h5' sx={{ textAlign: 'center', mt: 2 }}>
        L: { convertTemp(minTemp, tempUnit) }º
      </Typography>
    </Box>
  )
}