/**
 * Genera un hash numérico positivo a partir de una cadena.
 * Usado para derivar una semilla determinista del nombre.
 */
export function hashCode (str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const character = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + character
    hash = hash & hash // Fuerza a número de 32 bits
  }
  return Math.abs(hash)
}

/**
 * Retorna el dígito en la posición indicada de un número.
 * Permite derivar variabilidad a partir de partes del hash.
 */
export function getDigit (number, index) {
  return Math.floor((number / Math.pow(10, index)) % 10)
}

/**
 * Deriva un booleano determinista usando un dígito del número.
 */
export function getBoolean (number, index = 0) {
  return getDigit(number, index) % 2 === 0
}

/**
 * Retorna un número dentro de un rango, con posible signo negativo
 * dependiendo del índice, para mayor variabilidad.
 */
export function getUnit (number, range, index = 0) {
  const base = number % range
  const isNegative = index && getDigit(number, index) % 2 === 0
  return isNegative ? -base : base
}

/**
 * Selecciona un color pseudoaleatorio de una paleta, de forma determinista.
 * El `range` debe coincidir con `colors.length`.
 */
export function getRandomColor (number, colors = [], range = colors.length) {
  return colors[number % range]
}

/**
 * Calcula un color de alto contraste (blanco o negro) para el texto
 * que se superpone a un fondo dado (en formato hexadecimal).
 */
export function getContrast (hexColor) {
  // Elimina el "#" si está presente
  const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor

  // Convierte a componentes RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Cálculo de luminancia perceptual (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Devuelve negro o blanco según contraste mínimo
  return yiq >= 128 ? '#000000' : '#FFFFFF'
}
