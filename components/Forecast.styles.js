import { styled } from '@mui/material/styles'

import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ForecastContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  mt: 4,
  overflowX: 'hidden',
  maxWidth: theme.breakpoints.down('sm') ? '100%' : 700,
  padding: 1,
  flexDirection: 'row',
  alignItems: 'center'
}))

const ForecastArrowLeft = styled(ArrowBackIosIcon)({
  position: 'absolute',
  left: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.2,
  zIndex: 2
})

const ForecastArrowRight = styled(ArrowForwardIosIcon)({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  opacity: 0.2,
  zIndex: 2
})

const ForecastCardContent = styled(CardContent)({
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  'MsOverflowStyle': 'none',
  'scrollbarWidth': 'none'
})

const ForecastBox = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  whiteSpace: 'nowrap'
})

export { 
  ForecastContainer, 
  ForecastArrowLeft, 
  ForecastArrowRight,
  ForecastCardContent,
  ForecastBox
}