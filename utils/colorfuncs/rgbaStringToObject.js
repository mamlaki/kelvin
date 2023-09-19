export const rgbaStringToObject = (rgba) => {
  const matches = rgba.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([\d\.]+)\s*)?\)$/)

  if (!matches) return null

  const r = parseInt(matches[1])
  const g = parseInt(matches[2])
  const b = parseInt(matches[3])
  const a = matches[5] !== undefined ? parseFloat(matches[5]) : 1

  return { r, g, b, a }
}