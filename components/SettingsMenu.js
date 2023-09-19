import { useState, useRef, useEffect } from 'react';
import { useTempUnit } from '@/utils/contexts/TempUnitContext';
import { useThemeMode } from '@/utils/contexts/ThemeContext';
import { rgbaStringToObject } from '@/utils/colorfuncs/rgbaStringToObject';
import WrappedColorPicker from './CustomColorPicker';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'

import ColorLensIcon from '@mui/icons-material/ColorLens'
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function SettingsMenu({ settingsOpen, handleSettingsToggle, colorTheme, setColorTheme }) {
  const { defaultTempUnit, setDefaultTempUnit } = useTempUnit()
  const { darkMode, toggleDarkMode } = useThemeMode()

  const [isInitialized, setIsInitialized] = useState(false)

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [previewColor, setPreviewColor] = useState({
    hex: colorTheme,
    rgb: {r: 0, g: 0, b: 0, a: 1}
  });
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [recentColors, setRecentColors] = useState([])
  const colorPickerRef = useRef();
  const settingsRef = useRef(null);

  useEffect(() => {
    const savedDefaultTempUnit = localStorage.getItem('defaultTempUnit')
    const savedDarkMode = localStorage.getItem('darkMode')
    const savedColorTheme = localStorage.getItem('colorTheme')
    const savedRecentColors = localStorage.getItem('recentColors')

    setDefaultTempUnit(prev => savedDefaultTempUnit || prev)
    if (savedDarkMode !== null) {
      const parsedDarkMode = JSON.parse(savedDarkMode)
      if (typeof parsedDarkMode === 'boolean') {
        toggleDarkMode(parsedDarkMode)
      }
    }
    setColorTheme(prev => savedColorTheme || prev)
    setRecentColors(prev => savedRecentColors ? JSON.parse(savedRecentColors) : prev)

    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('defaultTempUnit', defaultTempUnit)
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
      localStorage.setItem('colorTheme', colorTheme)
      localStorage.setItem('recentColors', JSON.stringify(recentColors))
    }
  }, [defaultTempUnit, darkMode, colorTheme, recentColors, isInitialized])

  const convertRGBtoRGBAString = (rgb) => {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
  }

  const handleColorBoxClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPickerPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    })
    setDisplayColorPicker(true)
  }

  const handleColorDrag = (color) => {
    setPreviewColor(color)
  }

  const handleColorChangeComplete = (color) => {
    setColorTheme(convertRGBtoRGBAString(color.rgb))
    setRecentColors(prevColors => [convertRGBtoRGBAString(color.rgb), ...prevColors].slice(0, 10))
  }

  const handleRecentColorClick = (color) => {
    const rgb = rgbaStringToObject(color)
    if (!rgb) return

    setPreviewColor({
      hex: color,
      rgb: rgb
    })
    setColorTheme(color)
  }

  const handleClickOutside = (event) => {
    if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        handleSettingsToggle()
      }
      setDisplayColorPicker(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Dialog
      open={settingsOpen}
      onClose={handleSettingsToggle}
      ref={settingsRef}
      aria-labelledby='settings-dialog-title'
      maxWidth='lg'
      fullWidth={true}
      PaperProps={{
        sx: { width: '80%'}
      }}
    >
    <DialogTitle id='settings-dialog-title'>Settings</DialogTitle>
      <DialogContent sx={{ minHeight: 400, position: 'relative' }}>
        <FormControl fullWidth variant='outlined' sx={{ mt: 2 }}>
          <InputLabel id='default-temp-unit-label'>Default Temperature Unit</InputLabel>
          <Select
            labelId='default-temp-unit-label'
            id='default-temp-unit'
            value={defaultTempUnit}
            onChange={(event) => setDefaultTempUnit(event.target.value)}
            label='Default Temperature Unit'
          >
            <MenuItem value={'C'}>Celsius</MenuItem>
            <MenuItem value={'F'}>Fahrenheit</MenuItem>
            <MenuItem value={'K'}>Kelvin</MenuItem>
          </Select>
        </FormControl>
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
        <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <ColorLensIcon />
          <Typography varaint='subtitle1' sx={{ mt: 2 }}>Colour Theme</Typography>
        </Box>
        <Box 
          width={36} 
          height={36} 
          sx={{ 
            backgroundColor: colorTheme, 
            cursor: 'pointer',
            border: '3px solid #CCC',
            borderRadius: '2px'
          }} 
          onClick={handleColorBoxClick} />
        {displayColorPicker ?
          <Box ref={colorPickerRef} sx={{ position: 'relative' }}>
            <div style={{
              position: 'fixed', 
              top: `${pickerPosition.top}`, 
              left: `${pickerPosition.left}`, 
              zIndex: 1000
            }}>
              <WrappedColorPicker 
                color={previewColor.rgb} 
                onChange={handleColorDrag} 
                onChangeComplete={handleColorChangeComplete} 
                recentColors={recentColors}
                onRecentColorClick={handleRecentColorClick}
                backgroundColor={darkMode ? '#424242' : 'white'}
              />
            </div>
          </Box>
        : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSettingsToggle} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}