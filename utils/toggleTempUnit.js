/**
 * Toggle between temperature units.
 * Cycles between Celsius (C), Fahrenheit (F), and Kelvin (K). With a fallback default of Celsius.
 * 
 * @param {string} currentUnit - The Current temperature unit (C, F, or K).
 * @returns {string} The next temperature unit in the cycle.
 */

export const toggleTempUnit = (currentUnit) => {
  switch (currentUnit) {
    case 'C':
      return 'F'
    case 'F':
      return 'K'
    case 'K':
    default:
      return 'C'
  }
}