import Autocomplete from '@mui/material/Autocomplete'

import { useSearchLogic } from '@/utils/hooks/useSearchLogic'

import SearchInput from './SearchInput'

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
        <SearchInput {...params}
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


