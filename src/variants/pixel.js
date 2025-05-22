import { hashCode, getRandomColor } from '../utils/utils.js'

const ELEMENTS = 64
const SIZE = 80

function generateColors (name, colors) {
  const numFromName = hashCode(name)
  const range = colors && colors.length

  return Array.from({ length: ELEMENTS }, (_, i) =>
    getRandomColor(numFromName % (i + 1), colors, range)
  )
}

/**
 * Crea un avatar tipo "pixel" como SVGElement
 * @param {Object} params
 * @param {string} params.name - Nombre base para generar colores
 * @param {Array<string>} [params.colors] - Paleta de colores opcional
 * @param {string} [params.title] - Título accesible del avatar
 * @param {boolean} [params.rounded=false] - Si el avatar debe tener esquinas redondeadas
 * @param {number} [params.size=80] - Tamaño del avatar
 * @returns {SVGElement}
 */
export default function createAvatarPixel ({
  name,
  colors = [],
  title = '',
  rounded = false,
  size = SIZE
}) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const pixelColors = generateColors(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2, 9)}`

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`)
  svg.setAttribute('width', size)
  svg.setAttribute('height', size)
  svg.setAttribute('fill', 'none')
  svg.setAttribute('role', 'img')
  svg.setAttribute('xmlns', svgNS)

  // Soporte para título accesible
  if (title && typeof title === 'string') {
    const titleEl = document.createElementNS(svgNS, 'title')
    titleEl.textContent = title
    svg.appendChild(titleEl)
  }

  // Definición de máscara
  const defs = document.createElementNS(svgNS, 'defs')
  const mask = document.createElementNS(svgNS, 'mask')
  mask.setAttribute('id', maskId)
  mask.setAttribute('maskUnits', 'userSpaceOnUse')
  mask.setAttribute('x', 0)
  mask.setAttribute('y', 0)
  mask.setAttribute('width', SIZE)
  mask.setAttribute('height', SIZE)

  const rectMask = document.createElementNS(svgNS, 'rect')
  rectMask.setAttribute('width', SIZE)
  rectMask.setAttribute('height', SIZE)
  rectMask.setAttribute('fill', '#FFFFFF')
  rectMask.setAttribute('rx', rounded ? SIZE * 2 : 0)

  mask.appendChild(rectMask)
  defs.appendChild(mask)
  svg.appendChild(defs)

  // Grupo con máscara
  const g = document.createElementNS(svgNS, 'g')
  g.setAttribute('mask', `url(#${maskId})`)

  // Agregar los 64 píxeles
  const spacing = 10
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const i = y * 8 + x
      const rect = document.createElementNS(svgNS, 'rect')
      rect.setAttribute('x', x * spacing)
      rect.setAttribute('y', y * spacing)
      rect.setAttribute('width', spacing)
      rect.setAttribute('height', spacing)
      rect.setAttribute('fill', pixelColors[i])
      g.appendChild(rect)
    }
  }

  svg.appendChild(g)

  return svg
}
