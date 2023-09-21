/**
 * Converts a Unix timestamp to a localized time string in 'hh:mm' format.
 * 
 * @param {number} unixTimeStamp - The Unix timestamp to convert.
 * @returns {string} -The formatted time string.
 */

export const unixToTime = (unixTimeStamp) => {
  const dateObject = new Date(unixTimeStamp * 1000)
  return dateObject.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}