// React & Next.js Imports
import { useState, useRef, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

// Contexts & Utils
import { fetchUserSettingsFromAPI } from '@/pages/api/settingsAPI';
import { saveSettingsToAPI } from '@/pages/api/settingsAPI';
import { useTempUnit } from '@/utils/contexts/TempUnitContext';
import { useThemeMode } from '@/utils/contexts/ThemeContext';

// MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Local Components / Other
import ColorThemeSelector from './ColorThemeSelector';
import DarkModeSwitch from './DarkModeSwitch';
import TempUnitSelector from './TempUnitSelector';
import UnsavedChangesDialog from './UnsavedChangesDialog';

export default function SettingsMenu({ settingsOpen, handleSettingsToggle, colorTheme, setColorTheme }) {
  const { data: session } = useSession()

  const { defaultTempUnit, setDefaultTempUnit } = useTempUnit()
  const { darkMode, toggleDarkMode } = useThemeMode()

  const [recentColors, setRecentColors] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [unsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState(false)
  const [changes, setChanges] = useState([])

  const settingsRef = useRef(null);

  const DEFAULTS = {
    TEMP_UNIT: 'C',
    DARK_MODE: false,
    COLOR_THEME: '#4994EC',
    RECENT_COLORS: []
  }
  const [originalSettings, setOriginalSettings] = useState({
    defaultTempUnit: null,
    darkMode: null,
    colorTheme: null,
    recentColors: null
  })

  const checkUnsavedChanges = () => {
    const changesExist = defaultTempUnit !== originalSettings.defaultTempUnit ||
      darkMode !== originalSettings.darkMode || colorTheme !== originalSettings.colorTheme ||
      JSON.stringify(recentColors) !== JSON.stringify(originalSettings.recentColors)
    setHasUnsavedChanges(changesExist)
  }

  useEffect(() => {
    checkUnsavedChanges()
  }, [defaultTempUnit, darkMode, colorTheme, recentColors])

  const saveSettingsToBackend = async () => {
    if (!session) {
      localStorage.setItem('defaultTempUnit', defaultTempUnit)
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
      localStorage.setItem('colorTheme', colorTheme)
      localStorage.setItem('recentColors', JSON.stringify(recentColors))
      setOriginalSettings({
        defaultTempUnit: defaultTempUnit,
        darkMode: darkMode,
        colorTheme: colorTheme,
        recentColors: recentColors
      })
      alert('Settings saved locally. login to save settings across devices.')
      return
    }

    const settingsData = {
      defaultTempUnit: defaultTempUnit || DEFAULTS.TEMP_UNIT,
      darkMode: darkMode || DEFAULTS.DARK_MODE,
      colorTheme: colorTheme || DEFAULTS.COLOR_THEME,
      recentColors: recentColors || DEFAULTS.RECENT_COLORS,
      userId: session.user.id 
    }

    try {
      await saveSettingsToAPI(settingsData)
      
      setOriginalSettings({
        defaultTempUnit: defaultTempUnit,
        darkMode: darkMode,
        colorTheme: colorTheme,
        recentColors: recentColors
      })
      setHasUnsavedChanges(false)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings: ', error)
    }
  }

  const fetchAndApplyUserSettings = async (userId) => {
    try {
      const data = await fetchUserSettingsFromAPI(userId)
      
      if (data) {
        if (data.defaultTempUnit) setDefaultTempUnit(data.defaultTempUnit)
        if (typeof data.darkMode !== 'undefined') toggleDarkMode(data.darkMode)
        if (data.colorTheme) setColorTheme(data.colorTheme)
        if (Array.isArray(data.recentColors)) setRecentColors(data.recentColors);

        setOriginalSettings({
          defaultTempUnit: data.defaultTempUnit || DEFAULTS.TEMP_UNIT,
          darkMode: data.darkMode || DEFAULTS.DARK_MODE,
          colorTheme: data.colorTheme || DEFAULTS.COLOR_THEME,
          recentColors: data.recentColors || DEFAULTS.RECENT_COLORS
        })
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

    setOriginalSettings({
      defaultTempUnit: savedDefaultTempUnit || DEFAULTS.TEMP_UNIT,
      darkMode: savedDarkMode || DEFAULTS.DARK_MODE,
      colorTheme: savedColortheme || DEFAULTS.COLOR_THEME,
      recentColors: savedRecentColors || DEFAULTS.RECENT_COLORS
    })

    setDefaultTempUnit(savedDefaultTempUnit || DEFAULTS.TEMP_UNIT)
    toggleDarkMode(savedDarkMode || DEFAULTS.DARK_MODE)
    setColorTheme(savedColortheme || DEFAULTS.COLOR_THEME)
    setRecentColors(savedRecentColors || DEFAULTS.RECENT_COLORS)
  }

  const resetToDefaults = () => {
    if (defaultTempUnit !== DEFAULTS.TEMP_UNIT) {
      setChanges(prev => [...prev, { settings: 'Temperature Unit', oldValue: defaultTempUnit, newValue: DEFAULTS.TEMP_UNIT }])
    }
    if (darkMode !== DEFAULTS.DARK_MODE) {
      setChanges(prev => [...prev, {settings: 'Dark Mode', oldValue: darkMode ? 'On' : 'Off', newValue: DEFAULTS.DARK_MODE ? 'On' : 'Off'}])
    }
    if (colorTheme !== DEFAULTS.COLOR_THEME) {
      setChanges(prev => [...prev, { settings: 'Color Theme', oldValue: colorTheme, newValue: DEFAULTS.COLOR_THEME }])
    }

    setDefaultTempUnit(DEFAULTS.TEMP_UNIT)
    toggleDarkMode(DEFAULTS.DARK_MODE)
    setColorTheme(DEFAULTS.COLOR_THEME)
    setRecentColors(DEFAULTS.RECENT_COLORS)

    setHasUnsavedChanges(true)
  }

  useEffect(() => {
    if (session) {
      fetchAndApplyUserSettings(session.user.id)
      setOriginalSettings({
        defaultTempUnit: defaultTempUnit,
        darkMode: darkMode,
        colorTheme: colorTheme,
        recentColors: recentColors
      })
    } else {
      loadSettingsFromLocalStorage()
    }
  }, [session])

  const handleSaveAndExit = () => {
    saveSettingsToBackend()
    setHasUnsavedChanges(false)
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
    <>
      <Dialog
        open={settingsOpen}
        onClose={() => {
          if (hasUnsavedChanges) {
            setUnsavedChangesDialogOpen(true)
          } else {
            handleSettingsToggle()
          }
        }}
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
            setDefaultTempUnit={(newUnit) => {
              const change = {
                settings: 'Temperature Unit',
                oldValue: defaultTempUnit,
                newValue: newUnit
              }
              setChanges(prev => [...prev, change])
              setHasUnsavedChanges(true)
              setDefaultTempUnit(newUnit)
            }}
          />
          <DarkModeSwitch 
            darkMode={darkMode}
            toggleDarkMode={() => {
              const change = {
                settings: 'Dark Mode',
                oldValue: darkMode ? 'On' : 'Off',
                newValue: !darkMode ? 'On' : 'Off'
              }
              setChanges(prev => [...prev, change])
              setHasUnsavedChanges(true)
              toggleDarkMode()
            }}
          />
          <ColorThemeSelector 
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            darkMode={darkMode}
            recentColors={recentColors}
            setRecentColors={setRecentColors}
            onColorChange={(newColor) => {
              const change = {
                settings: 'Color Theme',
                oldValue: colorTheme,
                newValue: newColor
              }
              setChanges(prev => [...prev, change])
              setHasUnsavedChanges(true)
            }}
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
          <Button onClick={() => {
            setChanges([])
            handleSaveAndExit()
          }} color='success' variant='contained'>
            Save & Exit
          </Button>
        </DialogActions>
      </Dialog>
      <UnsavedChangesDialog 
        open={unsavedChangesDialogOpen}
        onClose={() => setUnsavedChangesDialogOpen(false)}
        changes={changes}
        onDiscardChanges={() => {
          setDefaultTempUnit(originalSettings.defaultTempUnit)
          toggleDarkMode(originalSettings.darkMode)
          setColorTheme(originalSettings.colorTheme)
          setRecentColors(originalSettings.recentColors)
          setChanges([])
          setUnsavedChangesDialogOpen(false)
          handleSettingsToggle()
        }}
        onSaveAndExit={() => {
          setChanges([])
          setUnsavedChangesDialogOpen(false)
          handleSaveAndExit()
        }}
      />
    </>
  )
}