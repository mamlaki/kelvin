/**
 * Converts a string to title case.
 * 
 * @param {string} str - The string to convert.
 * @returns {string} The string in title case format.
 */

export const toTitleCase = (str) => {
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}