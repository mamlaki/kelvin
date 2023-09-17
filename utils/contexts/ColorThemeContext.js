import { useState, createContext, useContext } from 'react'
import { blue } from '@mui/material/colors'

const ColorThemeContext = createContext()

export const useColorTheme = () => {
  return useContext(ColorThemeContext)
}

export const ColorThemeProvider = ({ children }) => {
  const [colorTheme, setColorTheme] = useState(blue[500])

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      { children }
    </ColorThemeContext.Provider>
  )
}