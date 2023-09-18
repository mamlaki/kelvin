export const ensureRGBA = (color) => {
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      let bigint = parseInt(color.slice(1), 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255

      return { r, g, b, a: 1 }
    } else if (color.startsWith('rgba')) {
      const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
      if (rgbaMatch) {
        const r = Number(rgbaMatch[1])
        const g = Number(rgbaMatch[2])
        const b = Number(rgbaMatch[3])
        const a = Number(rgbaMatch[4])

        return { r, g, b, a }
      }
    }
  } else if (color && 'r' in color && 'g' in color && 'b' in color) {
    return color
  }

  throw new Error('Invalid color format')
}