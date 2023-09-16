export const convertTemp = (kelvinTemp, unit) => {
  if (unit === 'C') {
    return Math.round(kelvinTemp - 273.15)
  } else if (unit === 'F') {
    return Math.round((kelvinTemp - 273.15) * 9 / 5 + 32)
  } else {
    return Math.round(kelvinTemp)
  }
}