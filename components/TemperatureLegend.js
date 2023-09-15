import React from 'react'
import Box from '@mui/material/Box'

const legend = [
  'rgba(255, 0, 0, 0.6)',
  'rgba(255, 123, 0, 0.6)' ,
  'rgba(255, 241, 0, 0.6)',
  'rgba(140, 223, 0, 0.6)',
  'rgba(36, 173, 0, 0.6)',
  'rgba(0, 198, 196, 0.6)',
  'rgba(0, 130, 251, 0.6)',
  'rgba(67, 67, 188, 0.6)',
]

export default function TemperatureLegend() {
  const gradientVertical = legend.reverse().join(', ')
  const gradientHorizontal = legend.join(', ')

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', sm: 'column' },
        zIndex: 2,
        borderRadius: 1,
        background: {
          xs: `linear-gradient(to right, ${gradientHorizontal})`,
          sm: `linear-gradient(${gradientVertical})`
        },
        height: { xs: '20px', sm: '200px' },
        width: { xs: '70%', sm: '20px' },
        maxWidth: { xs: '300px', sm: 'none' },
        borderRadius: { xs: '15px 15px 0  0', sm: '15px 0 0 15px' }
      }}
    >
    </Box>
  )
}