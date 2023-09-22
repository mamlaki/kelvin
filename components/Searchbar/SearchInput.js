import TextField from '@mui/material/TextField'

import SearchIcon from '@mui/icons-material/Search'

export default function SearchInput(props) {
  return (
    <TextField {...props}
      placeholder='Enter City'
      sx={{
        width: { xs: 300, md: 400 },
        backgroundColor: 'white',
        borderRadius: '24px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '24px',
          bordercolor: 'rgba(0, 0, 0, 0.23'
        }
      }}
      InputProps={{
        ...props.InputProps,
        startAdornment: (
          <>
            <SearchIcon />
            {props.InputProps.startAdornment}
          </>
        )
      }}
    />
  )
}