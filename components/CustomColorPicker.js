import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from 'react-color/lib/components/common'

import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const CustomColorPicker = (props) => {
  const { 
    color, 
    onChange, 
    onChangeComplete, 
    backgroundColor, 
    recentColors, 
    onRecentColorClick 
  } = props 

  const styles = {
    pickercontainer: {
      width: '270px',
      background: backgroundColor,
      borderRadius: '2px',
      boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      padding: '8px'
    },
    saturationContainer: {
      width: '100%',
      paddingBottom: '55%',
      position: 'relative',
      borderRadius: '2px 2px 0 0',
      overflow: 'hidden'
    },
    controls: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px'
    },
    sliders: {
      flex: '1',
      marginRight: '10px'
    },
    hue: {
      height: '10px',
      position: 'relative',
      marginBottom: '5px'
    },
    alpha: {
      height: '10px',
      position: 'relative'
    },
    checkboard: {
      borderRadius: '0 0 2px 2px'
    }
  }

  const recentColorStyles = {
    recentColorsContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10px'
    },
    recentColorBox: {
      width: '20px',
      height: '20px',
      borderRadius: '2px',
      margin: '0 3px',
      cursor: 'pointer'
    }
  }

  return (
    <Paper style={styles.pickercontainer}>
      <Box style={styles.saturationContainer}>
        <Saturation {...props} />
      </Box>
      <Box style={styles.controls}>
        <Box style={styles.sliders}>
          <Box style={styles.hue}>
            <Hue {...props} />
          </Box>
          <Box style={styles.alpha}>
            <Alpha {...props} />
          </Box>
        </Box>
        <Box sx={{
        height: '24px', position: 'relative'
        }}>
          <Checkboard />
        </Box>
      </Box>
      <Typography variant='subtitle1' sx={{
        textAlign: 'center',
        margin: '10px 0'
      }}>
        Recent Colours
      </Typography>
      <Box style={recentColorStyles.recentColorsContainer}>
        {Array(10).fill(null).map((_, index) => {
          const currentColor = recentColors[index]
          return (
            <Box 
              key={index}
              style={{
                ...recentColorStyles.recentColorBox,
                background: currentColor || 'transparent',
                border: !currentColor ? '1px dashed #CCC' : 'none'
              }}
              onClick={() => currentColor && onRecentColorClick(currentColor)}
            />
          )
        })}
      </Box>
    </Paper>
  )
}

const WrappedColorPicker = ColorWrap(CustomColorPicker)

export default WrappedColorPicker
