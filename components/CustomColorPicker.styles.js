import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

const shouldNotForwardProps = (prop) => {
  return prop !== 'backgroundColor' && prop !== 'currentColor'
}

const PickerContainer = styled(Paper, {
  shouldForwardProp: shouldNotForwardProps
} )(({ backgroundColor }) => ({
  width: '270px',
  background: backgroundColor || 'white',
  borderRadius: '2px',
  boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  padding: '8px'
}))

const SaturationContainer = styled(Box)({
  width: '100%',
  paddingBottom: '55%',
  position: 'relative',
  borderRadius: '2px 2px 0 0',
  overflow: 'hidden'
})

const Controls = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px'
})

const Sliders = styled(Box)({
  flex: '1',
  marginRight: '10px'
})

const HueBox = styled(Box)({
  height: '10px',
  position: 'relative',
  marginBottom: '5px'
})

const AlphaBox = styled(Box)({
  height: '10px',
  position: 'relative'
})

const RecentColorsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  padding: '10px'
})

const RecentColorBox = styled(Box, {
  shouldForwardProp: shouldNotForwardProps
})(({ currentColor }) => ({
  width: '20px',
  height: '20px',
  borderRadius: '2px',
  margin: '0 3px',
  cursor: 'pointer',
  background: currentColor || 'transparent',
  border: currentColor ? 'none' : '1px dashed #CCC'
}))

export {
  PickerContainer,
  SaturationContainer,
  Controls,
  Sliders,
  HueBox,
  AlphaBox,
  RecentColorsContainer,
  RecentColorBox
}