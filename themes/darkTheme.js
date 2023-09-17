import { createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9'
    },
    secondary: {
      main: '#FF4081'
    },
    background: {
      default: '#303030',
      paper: '#424242'
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0'
    }
  },
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiAutocomplete-inputRoot': {
            backgroundColor: '#303030' 
          },
          '& .MuiInputBase-input': {
            backgroundColor: '#303030' 
          },
          '& .MuiAutocomplete-popupIndicator': {
            backgroundColor: '#303030' 
          },
          '& .MuiAutocomplete-listbox': {
            backgroundColor: '#424242' 
          },
          '& .MuiAutocomplete-option': {
            '&:hover': {
              backgroundColor: '#505050' 
            }
          }
        }
      }
    }
  }
})

export default darkTheme