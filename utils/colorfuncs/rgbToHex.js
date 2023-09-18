export const rgbToHex = (r, g, b) => {
  console.log("RGB to Hex Input:", r, g, b)

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}