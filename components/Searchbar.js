import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import SearchIcon from '@mui/icons-material/Search'

import { useSearchLogic } from '@/utils/hooks/useSearchLogic'

export default function Search() {  
  const {
    timeoutId,
    setSearchTerm,
    suggestions,
    inputValue,
    setInputValue,
    isSuggestionSelected,
    setIsSuggestionSelected,
    setIsSelectionMade,
    fetchWeatherData,
    handleKeyPress,
    handleSearchInputChange
  } = useSearchLogic()

  return (
    <Autocomplete 
      id='auto-complete'
      autoComplete
      options={suggestions.map((option) => option)}
      renderInput={(params) => (
        <TextField {...params}
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
            ...params.InputProps,
            startAdornment: (
              <>
                <SearchIcon />
                {params.InputProps.startAdornment}
              </>
            )
          }}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
        />
      )}
      onInputChange={(event, newInputValue, reason) => {
        console.log('onInputChange - newInputValue: ', newInputValue)
        console.log('onInputChange - reason: ', reason)
        if (reason === 'select-option' || reason === 'reset') {
          clearTimeout(timeoutId)
          fetchWeatherData(newInputValue)
          setIsSuggestionSelected(true)
          setIsSelectionMade(true)
        } else {
          setIsSelectionMade(false)
        }
        setInputValue(newInputValue)
        setSearchTerm(newInputValue)
      }}
      onKeyDown={(event) => {
        if (isSuggestionSelected) {
          console.log('Selected value being fetched: ', inputValue)
          setIsSuggestionSelected(false)
          fetchWeatherData(inputValue)
        }
      }}
    />
  )
}


