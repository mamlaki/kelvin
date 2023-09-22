import { useState, useRef } from "react";
import { useEffect } from "react";
import { rgbaStringToObject } from "@/utils/colorfuncs/rgbaStringToObject";

import WrappedColorPicker from "../CustomColorPicker/CustomColorPicker";

import Box from '@mui/material/Box'
import { Typography } from "@mui/material";

import ColorLensIcon from "@mui/icons-material/ColorLens";

export default function ColorThemeSelector({ colorTheme, setColorTheme, darkMode, recentColors, setRecentColors }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [previewColor, setPreviewColor] = useState({
    hex: colorTheme,
    rgb: {r: 0, g: 0, b: 0, a: 1}
  });
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const settingsRef = useRef(null);
  const colorPickerRef = useRef();

  const DEFAULT_COLOR_THEME = '#4994EC'

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
    const rgbaColor = convertRGBtoRGBAString(color.rgb)
    setColorTheme(rgbaColor)
    setRecentColors(prevColors => [rgbaColor, ...prevColors].slice(0, 10))
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
    <>
      <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        <ColorLensIcon />
        <Typography varaint='subtitle1' sx={{ mt: 2 }}>Colour Theme</Typography>
      </Box>
      <Box 
        width={36} 
        height={36} 
        sx={{ 
          backgroundColor: colorTheme || DEFAULT_COLOR_THEME, 
          cursor: 'pointer',
          border: '3px solid #CCC',
          borderRadius: '2px'
        }} 
        onClick={handleColorBoxClick} />
      {displayColorPicker &&
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
      }
    </>
  )
}