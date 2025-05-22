import { hashCode, getRandomColor } from '../utils/utils.js'

const SIZE = 90
const COLORS = 5

function generateColors (colors, name) {
  const numFromName = hashCode(name)
  const range = colors && colors.length
  const colorsShuffle = Array.from({ length: COLORS }, (_, i) =>
    getRandomColor(numFromName + i, colors, range)
  )

  return [
    colorsShuffle[0],
    colorsShuffle[1],
    colorsShuffle[1],
    colorsShuffle[2],
    colorsShuffle[2],
    colorsShuffle[3],
    colorsShuffle[3],
    colorsShuffle[0],
    colorsShuffle[4]
  ]
}

/**
 * Crea un avatar tipo "Ring" como SVGElement
 * @param {Object} params
 * @param {string} params.name - Nombre para hash
 * @param {Array<string>} [params.colors] - Paleta de colores
 * @param {string} [params.title] - Título accesible para el avatar SVG (accesibilidad)
 * @param {boolean} [params.rounded=true] - Borde redondeado
 * @param {number} [params.size=90] - Tamaño en px
 * @returns {SVGElement}
 */
export default function createAvatarRing ({
  name,
  colors = [],
  title = '',
  rounded = true,
  size = SIZE
}) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const ringColors = generateColors(colors, name)
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

  const g = document.createElementNS(svgNS, 'g')
  g.setAttribute('mask', `url(#${maskId})`)

  const paths = [
    ['M0 0h90v45H0z', ringColors[0]],
    ['M0 45h90v45H0z', ringColors[1]],
    ['M83 45a38 38 0 00-76 0h76z', ringColors[2]],
    ['M83 45a38 38 0 01-76 0h76z', ringColors[3]],
    ['M77 45a32 32 0 10-64 0h64z', ringColors[4]],
    ['M77 45a32 32 0 11-64 0h64z', ringColors[5]],
    ['M71 45a26 26 0 00-52 0h52z', ringColors[6]],
    ['M71 45a26 26 0 01-52 0h52z', ringColors[7]]
  ]

  for (const [d, fill] of paths) {
    const path = document.createElementNS(svgNS, 'path')
    path.setAttribute('d', d)
    path.setAttribute('fill', fill)
    g.appendChild(path)
  }

  const circle = document.createElementNS(svgNS, 'circle')
  circle.setAttribute('cx', 45)
  circle.setAttribute('cy', 45)
  circle.setAttribute('r', 23)
  circle.setAttribute('fill', ringColors[8])
  g.appendChild(circle)

  svg.appendChild(g)
  return svg
}
