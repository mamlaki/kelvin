/**
 * Converts a given ISO 3166-1 alpha-2 country code into the corresponding flag emoji.
 * Uses Unicode regional indicator symbols to derive the flag.
 * 
 * @param {string} countryCode - The ISO 3166-1 alpha-2 code of a country.
 * @returns {string} The flag emoji representaing the country.
 */

export const countryCodeToFlag = (countryCode) => {
  return countryCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
}