import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const getBackgroundByTemp = (temperature, unit) => {
  let temp = temperature

  if (unit === 'F') {
    temp = (temp - 32) * 5 / 9
  } else if (unit === 'K') {
    temp = temp - 273.15
  }

  if (temp >= 25) {
    return 'linear-gradient(45deg, #FF4500, #FF8C00)'
  } else if (temp >= 15) {
    return 'linear-gradient(45deg, #3CB371, #20B2AA)'
  } else {
    return 'linear-gradient(45deg, #1E90FF, #00008B)'
  }
}

export default function TemperatureBox({ icon, temperature, description, rawTemperature, unit }) {
  const backgroundColor = getBackgroundByTemp(rawTemperature, unit)

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      flexDirection: 'column'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        m: 2,
        p: 2,
        gap: 1
      }}>
        <Typography variant='h2' sx={{ textAlign: 'center', mt: 2}}>
          { icon }
        </Typography>
        <Typography variant='h2' fontWeight='bold' sx={{
          background: backgroundColor,
          backgroundClip: 'text',
          textFillColor: 'transparent'
        }}>
          { temperature }
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        mt: '-2rem'
      }}>
        <Typography variant='h5' sx={{ textAlign: 'center', mt: 2 }}>
          { description }
        </Typography>
      </Box>
    </Box>
  )
}