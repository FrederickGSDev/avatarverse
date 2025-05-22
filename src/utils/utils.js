/**
 * Genera un hash numérico a partir de una cadena.
 * Es usado para producir datos deterministas a partir del nombre.
 */
export function hashCode (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // Algoritmo simple de dispersión basado en código ASCII
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Convierte a entero de 32 bits
  }
  return Math.abs(hash)
}

/**
 * Retorna un número dentro de un rango, derivado del hash.
 * Permite obtener valores pseudoaleatorios consistentes.
 */
export function getUnit (seed, range, index = 0) {
  const str = seed.toString()
  const charCode = str.charCodeAt(index % str.length)
  return charCode % range
}

/**
 * Devuelve true o false de forma pseudoaleatoria y consistente.
 */
export function getBoolean (seed, index = 0) {
  return getUnit(seed, 2, index) === 0
}

/**
 * Selecciona un color de una paleta de forma pseudoaleatoria.
 * Si no se proporciona una paleta, usa un fallback.
 */
export function getRandomColor (seed, colors = null, range = null) {
  if (colors && colors.length > 0) {
    return colors[seed % colors.length]
  }

  // Paleta de respaldo
  const fallbackColors = ['#01888C', '#FC7500', '#034F5D', '#F73F01', '#FC1960', '#C7144C', '#F3C100', '#1598F2', '#2465E1', '#F19E02']
  return fallbackColors[seed % fallbackColors.length]
}

/**
 * Retorna un color (negro o blanco) para garantizar contraste legible
 * sobre un fondo dado (color hex).
 */
export function getContrast (hexColor) {
  // Elimina el "#" si existe
  const hex = hexColor.replace('#', '')

  // Convierte hex a componentes RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Cálculo de luminancia relativa según WCAG
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}
