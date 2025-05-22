import { hashCode, getRandomColor } from '../utils/utils.js'

const ELEMENTS = 4
const SIZE = 80

function generateColors (name, colors) {
  const numFromName = hashCode(name)
  const range = colors && colors.length

  return Array.from({ length: ELEMENTS }, (_, i) =>
    getRandomColor(numFromName + i, colors, range)
  )
}

/**
 * Crea un avatar "sunset" como SVGElement
 * @param {Object} params
 * @param {string} params.name - Nombre base para generar colores
 * @param {Array<string>} [params.colors] - Paleta de colores opcional
 * @param {string} [params.title] - Título accesible del avatar
 * @param {boolean} [params.rounded=false] - Si el avatar debe tener esquinas redondeadas
 * @param {number} [params.size=80] - Tamaño del avatar
 * @returns {SVGElement}
 */
export default function createAvatarSunset ({
  name,
  colors = [],
  title = '',
  rounded = false,
  size = SIZE
}) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const sunsetColors = generateColors(name, colors)
  const nameWithoutSpace = name.replace(/\s/g, '')
  const maskId = `mask-${Math.random().toString(36).slice(2)}`
  const grad0Id = `gradient0-${nameWithoutSpace}`
  const grad1Id = `gradient1-${nameWithoutSpace}`

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

  // Máscara
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

  // Gradientes
  const gradient0 = document.createElementNS(svgNS, 'linearGradient')
  gradient0.setAttribute('id', grad0Id)
  gradient0.setAttribute('x1', SIZE / 2)
  gradient0.setAttribute('y1', 0)
  gradient0.setAttribute('x2', SIZE / 2)
  gradient0.setAttribute('y2', SIZE / 2)
  gradient0.setAttribute('gradientUnits', 'userSpaceOnUse')

  const stop0a = document.createElementNS(svgNS, 'stop')
  stop0a.setAttribute('stop-color', sunsetColors[0])
  const stop0b = document.createElementNS(svgNS, 'stop')
  stop0b.setAttribute('offset', '1')
  stop0b.setAttribute('stop-color', sunsetColors[1])

  gradient0.appendChild(stop0a)
  gradient0.appendChild(stop0b)

  const gradient1 = document.createElementNS(svgNS, 'linearGradient')
  gradient1.setAttribute('id', grad1Id)
  gradient1.setAttribute('x1', SIZE / 2)
  gradient1.setAttribute('y1', SIZE / 2)
  gradient1.setAttribute('x2', SIZE / 2)
  gradient1.setAttribute('y2', SIZE)
  gradient1.setAttribute('gradientUnits', 'userSpaceOnUse')

  const stop1a = document.createElementNS(svgNS, 'stop')
  stop1a.setAttribute('stop-color', sunsetColors[2])
  const stop1b = document.createElementNS(svgNS, 'stop')
  stop1b.setAttribute('offset', '1')
  stop1b.setAttribute('stop-color', sunsetColors[3])

  gradient1.appendChild(stop1a)
  gradient1.appendChild(stop1b)

  defs.appendChild(gradient0)
  defs.appendChild(gradient1)
  svg.appendChild(defs)

  // Grupo con máscara
  const g = document.createElementNS(svgNS, 'g')
  g.setAttribute('mask', `url(#${maskId})`)

  const path1 = document.createElementNS(svgNS, 'path')
  path1.setAttribute('d', 'M0 0h80v40H0z')
  path1.setAttribute('fill', `url(#${grad0Id})`)

  const path2 = document.createElementNS(svgNS, 'path')
  path2.setAttribute('d', 'M0 40h80v40H0z')
  path2.setAttribute('fill', `url(#${grad1Id})`)

  g.appendChild(path1)
  g.appendChild(path2)
  svg.appendChild(g)

  return svg
}
