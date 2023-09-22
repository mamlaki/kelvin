import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

export default function TempUnitSelector({ defaultTempUnit, setDefaultTempUnit }) {
  return (
    <FormControl fullWidth variant='outlined' sx={{ mt: 2 }}>
      <InputLabel id='default-temp-unit-label'>Default Temperature Unit</InputLabel>
      <Select
        labelId='default-temp-unit-label'
        id='default-temp-unit'
        value={defaultTempUnit}
        onChange={(event) => setDefaultTempUnit(event.target.value)}
        label='Default Temperature Unit'
      >
        <MenuItem value={'C'}>Celsius</MenuItem>
        <MenuItem value={'F'}>Fahrenheit</MenuItem>
        <MenuItem value={'K'}>Kelvin</MenuItem>
      </Select>
    </FormControl>
  )
}