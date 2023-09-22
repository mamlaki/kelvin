import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'

import DarkModeIcon from '@mui/icons-material/DarkMode'

export default function DarkModeSwitch({ darkMode, toggleDarkMode }) {
  return (
    <Box mt={2}>
      <Box display='flex' alignItems='flex-end' gap={1}>
        <DarkModeIcon />
        <Typography varaint='subtitle1' sx={{ mt: 2 }}>Dark Mode</Typography>
      </Box>
      <Switch 
        checked={darkMode}
        onChange={toggleDarkMode}
        name='darkMode'
        color='primary' 
        sx={{ marginLeft: '-10px' }}
      />
    </Box>
  )
}