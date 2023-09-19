export const blendWithBackground = (rgb, background) => {
  const alpha = rgb.a
  const inverseAlpha = 1 - alpha

  const r = Math.round((rgb.r * alpha) + (background * inverseAlpha))
  const g = Math.round((rgb.g * alpha) + (background * inverseAlpha))
  const b = Math.round((rgb.b * alpha) + (background * inverseAlpha))

  return { r, g, b }
}