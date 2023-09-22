import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from 'react-color/lib/components/common'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import {
  PickerContainer,
  SaturationContainer,
  Controls,
  Sliders,
  HueBox,
  AlphaBox,
  RecentColorsContainer,
  RecentColorBox
} from './CustomColorPicker.styles'

const CustomColorPicker = (props) => {
  const { 
    color, 
    onChange, 
    onChangeComplete, 
    backgroundColor, 
    recentColors, 
    onRecentColorClick 
  } = props 

  return (
    <PickerContainer backgroundColor={backgroundColor}>
      <SaturationContainer>
        <Saturation {...props} />
      </SaturationContainer>
      <Controls>
        <Sliders>
          <HueBox>
            <Hue {...props} />
          </HueBox>
          <AlphaBox>
            <Alpha {...props} />
          </AlphaBox>
        </Sliders>
        <Box sx={{
          height: '24px',
          position: 'relative'
        }}>
          <Checkboard />
        </Box>
      </Controls>
      <Typography
        variant='subtitle1'
        sx={{
          textAlign: 'center',
          margin: '10px 0'
        }}
      >
        Recent Colours
      </Typography>
      <RecentColorsContainer>
        {Array(10).fill(null).map((_, index) => {
          const currentColor = recentColors[index]
          return (
            <RecentColorBox 
              key={index}
              currentColor={currentColor}
              onClick={() => currentColor && onRecentColorClick(currentColor)}
            />
          )
        })}
      </RecentColorsContainer>
    </PickerContainer>
  )
}

const WrappedColorPicker = ColorWrap(CustomColorPicker)

export default WrappedColorPicker
