export const blendWithWhite = (rgb) => {
  const alpha = rgb.a
  const inverseAlpha = 1 - alpha

  const r = Math.round((rgb.r * alpha) + (255 * inverseAlpha))
  const g = Math.round((rgb.g * alpha) + (255 * inverseAlpha))
  const b = Math.round((rgb.b * alpha) + (255 * inverseAlpha))

  return { r, g, b }
}