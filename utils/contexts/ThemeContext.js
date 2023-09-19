import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = (newValue) => {
    if (typeof newValue === 'boolean') {
      setDarkMode(newValue)
    } else {
      setDarkMode(prev => !prev)
    }
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      { children }
    </ThemeContext.Provider>
  )
}

export const useThemeMode = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider')
  }
  return context
}