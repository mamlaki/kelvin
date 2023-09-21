import { createContext, useState, useContext } from 'react'

const SnackbarContext = createContext()

export const useSnackbar = () => {
  return useContext(SnackbarContext)
}

export const SnackbarProvider = ({ children }) => {
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState('')

  const openSnackbar = (message) => {
    setSnackBarMessage(message)
    setSnackBarOpen(true)
  }

  const closeSnackbar = () => {
    setSnackBarOpen(false)
  }

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar, snackBarOpen, snackBarMessage }}>
      { children }
    </SnackbarContext.Provider>
  )
}