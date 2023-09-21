import { unixToTime } from '@/utils/unixToTime'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import WbSunnyIcon from '@mui/icons-material/WbSunny'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function SunCards({ sunrise, sunset }) {
  return (
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      mt: { xs: 0, sm: 4 }
    }}>
      <Card sx={{
        m: 2,
        width: { xs: 440, sm: 200 }, 
        background: 'linear-gradient(90deg, #FF7E5F, #FEB47B)',
        color: 'white'
      }}>
        <CardContent>
          <Typography variant='h6' sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            gap: '0.3rem'
          }}>
            Sunrise <WbSunnyIcon />:
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start'}
          }}>
            <Typography variant='h4'>{ unixToTime(sunrise) }<ArrowDropUpIcon /></Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{
        m: 2,
        width: { xs: 440, sm: 200 }, 
        background: 'linear-gradient(90deg, #5A7D9A, #243447)',
        color: 'white'
      }}>
        <CardContent>
          <Typography variant='h6' sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            gap: '0.3rem'
          }}>
            Sunset <DarkModeIcon />:
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start'}
          }}>
            <Typography variant='h4'>{ unixToTime(sunset) }<ArrowDropDownIcon /></Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}