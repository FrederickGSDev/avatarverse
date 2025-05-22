import createAvatarBeam from './variants/beam.js'
import createAvatarMarble from './variants/marble.js'
import createAvatarPixel from './variants/pixel.js'
import createAvatarSunset from './variants/sunset.js'
import createAvatarBauhaus from './variants/bauhaus.js'
import createAvatarRing from './variants/ring.js'

const variants = {
  beam: createAvatarBeam,
  marble: createAvatarMarble,
  pixel: createAvatarPixel,
  sunset: createAvatarSunset,
  bauhaus: createAvatarBauhaus,
  ring: createAvatarRing
}

/**
 * Genera un avatar SVG o imagen basado en los parámetros.
 * @param {Object} options
 * @param {string} options.name - Texto base para generar el avatar.
 * @param {string[]} [options.colors] - Paleta de colores personalizada.
 * @param {string} [options.variant='beam'] - Nombre de la variante.
 * @param {boolean} [options.rounded=false] - Si el avatar tiene esquinas redondeadas (círculo).
 * @param {number} [options.size=36] - Tamaño del avatar en píxeles.
 * @param {'svg'|'image'} [options.format='svg'] - Formato de salida.
 * @param {string} [options.title] - Título accesible para el avatar SVG.
 * @returns {string|HTMLImageElement} SVG como string o imagen en entorno navegador
 */
export function generateAvatar ({
  name = 'John Doe',
  colors = ['#0a0310', '#49007e', '#ff005b', '#ff7d10', '#ffb238'],
  variant = 'beam',
  rounded = false,
  size = 40,
  format = 'svg',
  title = name
}) {
  const generator = variants[variant]
  if (!generator) {
    throw new Error(`Variant "${variant}" is not supported.`)
  }

  const svgString = generator({ name, colors, rounded, size, title })

  if (format === 'image') {
    const encoded = encodeURIComponent(svgString)
    if (typeof window !== 'undefined' && typeof window.Image !== 'undefined') {
      const img = new window.Image()
      img.src = `data:image/svg+xml,${encoded}`
      img.width = size
      img.height = size
      img.alt = title
      return img
    } else {
      throw new Error('Image output only supported in browser environments.')
    }
  }

  return svgString
}
