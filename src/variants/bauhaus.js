import { hashCode, getUnit, getRandomColor, getBoolean } from '../utils/utils.js'

const ELEMENTS = 4
const SIZE = 80

function generateColors (name, colors) {
  const numFromName = hashCode(name)
  const range = colors && colors.length

  return Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 2 - (i + 17), 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 2 - (i + 17), 2),
    rotate: getUnit(numFromName * (i + 1), 360),
    isSquare: getBoolean(numFromName, 2)
  }))
}

/**
 * Crea un avatar estilo "Bauhaus" como SVGElement
 * @param {Object} params
 * @param {string} params.name - Nombre base para generar propiedades
 * @param {Array<string>} [params.colors] - Paleta de colores
 * @param {string} [params.title] - Título accesible para el avatar SVG (accesibilidad)
 * @param {boolean} [params.rounded=true] - Si el avatar debe tener esquinas redondeadas
 * @param {number} [params.size=80] - Tamaño del avatar
 * @returns {SVGElement}
 */
export default function createAvatarBauhaus ({
  name,
  colors = [],
  title = '',
  rounded = true,
  size = SIZE
}) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const properties = generateColors(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2)}`

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

  // Defs y máscara
  const defs = document.createElementNS(svgNS, 'defs')
  const mask = document.createElementNS(svgNS, 'mask')
  mask.setAttribute('id', maskId)
  mask.setAttribute('maskUnits', 'userSpaceOnUse')
  mask.setAttribute('x', 0)
  mask.setAttribute('y', 0)
  mask.setAttribute('width', SIZE)
  mask.setAttribute('height', SIZE)

  const rect = document.createElementNS(svgNS, 'rect')
  rect.setAttribute('width', SIZE)
  rect.setAttribute('height', SIZE)
  rect.setAttribute('fill', '#FFFFFF')
  rect.setAttribute('rx', rounded ? SIZE * 2 : 0)

  mask.appendChild(rect)
  defs.appendChild(mask)
  svg.appendChild(defs)

  // Grupo con máscara
  const g = document.createElementNS(svgNS, 'g')
  g.setAttribute('mask', `url(#${maskId})`)

  // Rectángulo de fondo
  const bg = document.createElementNS(svgNS, 'rect')
  bg.setAttribute('width', SIZE)
  bg.setAttribute('height', SIZE)
  bg.setAttribute('fill', properties[0].color)
  g.appendChild(bg)

  // Rectángulo decorativo
  const decoRect = document.createElementNS(svgNS, 'rect')
  decoRect.setAttribute('x', (SIZE - 60) / 2)
  decoRect.setAttribute('y', (SIZE - 20) / 2)
  decoRect.setAttribute('width', SIZE)
  decoRect.setAttribute('height', properties[1].isSquare ? SIZE : SIZE / 8)
  decoRect.setAttribute('fill', properties[1].color)
  decoRect.setAttribute(
    'transform',
    `translate(${properties[1].translateX} ${properties[1].translateY}) rotate(${properties[1].rotate} ${SIZE / 2} ${SIZE / 2})`
  )
  g.appendChild(decoRect)

  // Círculo decorativo
  const circle = document.createElementNS(svgNS, 'circle')
  circle.setAttribute('cx', SIZE / 2)
  circle.setAttribute('cy', SIZE / 2)
  circle.setAttribute('r', SIZE / 5)
  circle.setAttribute('fill', properties[2].color)
  circle.setAttribute(
    'transform',
    `translate(${properties[2].translateX} ${properties[2].translateY})`
  )
  g.appendChild(circle)

  // Línea decorativa
  const line = document.createElementNS(svgNS, 'line')
  line.setAttribute('x1', 0)
  line.setAttribute('y1', SIZE / 2)
  line.setAttribute('x2', SIZE)
  line.setAttribute('y2', SIZE / 2)
  line.setAttribute('stroke', properties[3].color)
  line.setAttribute('stroke-width', 2)
  line.setAttribute(
    'transform',
    `translate(${properties[3].translateX} ${properties[3].translateY}) rotate(${properties[3].rotate} ${SIZE / 2} ${SIZE / 2})`
  )
  g.appendChild(line)

  svg.appendChild(g)
  return svg
}
