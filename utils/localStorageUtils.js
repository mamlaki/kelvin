const saveSettingsToLocalStorage = (settings) => {
  localStorage.setItem('defaultTempUnit', settings.defaultTempUnit)
  localStorage.setItem('darkMode', JSON.stringify(settings.darkMode))
  localStorage.setItem('colorTheme', settings.colorTheme)
  localStorage.setItem('recentColors', JSON.stringify(settings.recentColors))
}

const fetchSettingsFromLocalStorage = (DEFAULTS) => {
  const savedDefaultTempUnit = localStorage.getItem('defaultTempUnit')
  const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || false)
  const savedColortheme = localStorage.getItem('colorTheme')
  const savedRecentColors = JSON.parse(localStorage.getItem('recentColors') || '[]')

  return {
    defaultTempUnit: savedDefaultTempUnit || DEFAULTS.TEMP_UNIT,
    darkMode: savedDarkMode || DEFAULTS.DARK_MODE,
    colorTheme: savedColortheme || DEFAULTS.COLOR_THEME,
    recentColors: savedRecentColors || DEFAULTS.RECENT_COLORS
  }
}

export { saveSettingsToLocalStorage, fetchSettingsFromLocalStorage }