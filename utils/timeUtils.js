export const formatTime = (date) => {
  const hours = date.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  let formattedHours = hours % 12
  formattedHours = formattedHours ? formattedHours : 12
  return `${formattedHours}${ampm}`
}

export const isDayTime = (date) => {
  const hours = date.getHours()
  return hours > 6 && hours < 18
}