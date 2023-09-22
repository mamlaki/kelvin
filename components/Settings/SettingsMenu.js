import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useTempUnit } from '@/utils/contexts/TempUnitContext';
import { useThemeMode } from '@/utils/contexts/ThemeContext';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useSession } from 'next-auth/react';

import TempUnitSelector from './TempUnitSelector';
import ColorThemeSelector from './ColorThemeSelector';
import DarkModeSwitch from './DarkModeSwitch';

export default function SettingsMenu({ settingsOpen, handleSettingsToggle, colorTheme, setColorTheme }) {
  const { data: session } = useSession()

  const { defaultTempUnit, setDefaultTempUnit } = useTempUnit()
  const { darkMode, toggleDarkMode } = useThemeMode()

  const [recentColors, setRecentColors] = useState([])
  
  const settingsRef = useRef(null);

  const DEFAULT_TEMP_UNIT = 'C'
  const DEFAULT_DARK_MODE = false
  const DEFAULT_COLOR_THEME = '#4994EC'
  const DEFAULT_RECENT_COLORS = []

  const saveSettingsToBackend = async () => {
    if (!session) {
      localStorage.setItem('defaultTempUnit', defaultTempUnit)
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
      localStorage.setItem('colorTheme', colorTheme)
      localStorage.setItem('recentColors', JSON.stringify(recentColors))
      alert('Settings saved locally. login to save settings across devices.')
      return
    }

    const settingsData = {
      defaultTempUnit: defaultTempUnit,
      darkMode: darkMode,
      colorTheme: colorTheme,
      recentColors: recentColors,
      userId: session.user.id 
    }

    try {
      const response = await fetch('/api/updateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
      })

      if (!response.ok) {
        const responseData = await response.json()
        throw new Error(responseData.message || 'Failed to save settings.')
      }
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings: ', error)
    }
  }

  const fetchAndApplyUserSettings = async (userId) => {
    try {
      const response = await fetch(`/api/getSettings?userId=${userId}`)
      const data = await response.json()

      if (data) {
        if (data.defaultTempUnit) setDefaultTempUnit(data.defaultTempUnit)
        if (typeof data.darkMode !== 'undefined') toggleDarkMode(data.darkMode)
        if (data.colorTheme) setColorTheme(data.colorTheme)
        if (Array.isArray(data.recentColors)) setRecentColors(data.recentColors);
      } else {
        loadSettingsFromLocalStorage();
      }
    } catch (error) {
      console.error('Error fetching user settings: ', error)
    }
  }

  const loadSettingsFromLocalStorage = () => {
    const savedDefaultTempUnit = localStorage.getItem('defaultTempUnit')
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || false)
    const savedColortheme = localStorage.getItem('colorTheme')
    const savedRecentColors = JSON.parse(localStorage.getItem('recentColors') || '[]')

    setDefaultTempUnit(savedDefaultTempUnit || DEFAULT_TEMP_UNIT)
    toggleDarkMode(savedDarkMode || DEFAULT_DARK_MODE)
    setColorTheme(savedColortheme || DEFAULT_COLOR_THEME)
    setRecentColors(savedRecentColors || DEFAULT_RECENT_COLORS)
  }

  const resetToDefaults = () => {
    setDefaultTempUnit(DEFAULT_TEMP_UNIT)
    toggleDarkMode(DEFAULT_DARK_MODE)
    setColorTheme(DEFAULT_COLOR_THEME)
    setRecentColors(DEFAULT_RECENT_COLORS)

    localStorage.setItem('defaultTempUnit', DEFAULT_TEMP_UNIT)
    localStorage.setItem('darkMode', JSON.stringify(DEFAULT_DARK_MODE))
    localStorage.setItem('colorTheme', DEFAULT_COLOR_THEME)
    localStorage.setItem('recentColors', JSON.stringify(DEFAULT_RECENT_COLORS))
  }

  useEffect(() => {
    if (session) {
      fetchAndApplyUserSettings(session.user.id)
    } else {
      loadSettingsFromLocalStorage()
    }
  }, [session])

  const handleSaveAndExit = () => {
    saveSettingsToBackend()
    handleSettingsToggle()
  }
  
  const deleteUser = async () => {
    try {
      const response = await fetch(`/api/deleteUser?userId=${session.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: session.user.id })
      })

      if (response.ok) {
        alert('Your account was successfully deleted.')
        handleSettingsToggle()
        await signOut({ redirect: false, callbackUrl: '/' })
      } else {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete account.')
      }
    } catch (error) {
      console.error('Error deleting user account: ', error)
      alert('An error occurred. Please try again later.')
    }
  }

  const handleDeleteAccount = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (isConfirmed) {
      deleteUser()
    }
  }

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
        <TempUnitSelector 
          defaultTempUnit={defaultTempUnit}
          setDefaultTempUnit={setDefaultTempUnit}
        />
        <DarkModeSwitch 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <ColorThemeSelector 
          colorTheme={colorTheme}
          setColorTheme={setColorTheme}
          darkMode={darkMode}
          recentColors={recentColors}
          setRecentColors={setRecentColors}
        />
        {session && (
          <Box sx={{ mt: 4 }}>
            <Button onClick={handleDeleteAccount} color='secondary' variant='contained'>Delete Account</Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={resetToDefaults} color='primary'>
          Default Settings
        </Button>
        <Button onClick={handleSaveAndExit} color='success' variant='contained'>
          Save & Exit
        </Button>
      </DialogActions>
    </Dialog>
  )
}