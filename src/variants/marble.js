import { hashCode, getUnit, getRandomColor } from '../utils/utils.js'

const ELEMENTS = 3
const SIZE = 80

function generateColors (name, colors) {
  const numFromName = hashCode(name)
  const range = colors?.length || 0

  return Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 10, 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 10, 2),
    scale: 1.2 + getUnit(numFromName * (i + 1), SIZE / 20) / 10,
    rotate: getUnit(numFromName * (i + 1), 360, 1)
  }))
}

/**
 * Crea un avatar tipo "marble" como SVGElement
 * @param {Object} params
 * @param {string} params.name - Nombre para generar colores únicos
 * @param {Array<string>} [params.colors] - Paleta de colores opcional
 * @param {string} [params.title] - Título accesible para el avatar SVG (accesibilidad)
 * @param {boolean} [params.rounded=false] - Si el avatar debe tener bordes redondeados
 * @param {number} [params.size=80] - Tamaño del avatar
 * @returns {SVGElement}
 */
export default function createAvatarMarble ({
  name,
  colors = [],
  title = '',
  rounded = false,
  size = SIZE
}) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const properties = generateColors(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2, 9)}`
  const filterId = `filter-${maskId}`

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`)
  svg.setAttribute('width', size)
  svg.setAttribute('height', size)
  svg.setAttribute('fill', 'none')
  svg.setAttribute('xmlns', svgNS)
  svg.setAttribute('role', 'img')

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

  // Filtro blur
  const filter = document.createElementNS(svgNS, 'filter')
  filter.setAttribute('id', filterId)
  filter.setAttribute('filterUnits', 'userSpaceOnUse')
  filter.setAttribute('color-interpolation-filters', 'sRGB')

  const feFlood = document.createElementNS(svgNS, 'feFlood')
  feFlood.setAttribute('flood-opacity', '0')
  feFlood.setAttribute('result', 'BackgroundImageFix')

  const feBlend = document.createElementNS(svgNS, 'feBlend')
  feBlend.setAttribute('in', 'SourceGraphic')
  feBlend.setAttribute('in2', 'BackgroundImageFix')
  feBlend.setAttribute('result', 'shape')

  const feGaussian = document.createElementNS(svgNS, 'feGaussianBlur')
  feGaussian.setAttribute('stdDeviation', '7')
  feGaussian.setAttribute('result', 'effect1_foregroundBlur')

  filter.appendChild(feFlood)
  filter.appendChild(feBlend)
  filter.appendChild(feGaussian)
  defs.appendChild(filter)
  svg.appendChild(defs)

  // Grupo con máscara aplicada
  const gMasked = document.createElementNS(svgNS, 'g')
  gMasked.setAttribute('mask', `url(#${maskId})`)

  // Fondo
  const bgRect = document.createElementNS(svgNS, 'rect')
  bgRect.setAttribute('width', SIZE)
  bgRect.setAttribute('height', SIZE)
  bgRect.setAttribute('fill', properties[0].color)
  gMasked.appendChild(bgRect)

  // Primer path (capa intermedia)
  const path1 = document.createElementNS(svgNS, 'path')
  path1.setAttribute('d', 'M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z')
  path1.setAttribute('fill', properties[1].color)
  path1.setAttribute('filter', `url(#${filterId})`)
  path1.setAttribute('transform',
    `translate(${properties[1].translateX} ${properties[1].translateY}) rotate(${properties[1].rotate} ${SIZE / 2} ${SIZE / 2}) scale(${properties[1].scale})`
  )
  gMasked.appendChild(path1)

  // Segundo path (capa superior)
  const path2 = document.createElementNS(svgNS, 'path')
  path2.setAttribute('d', 'M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z')
  path2.setAttribute('fill', properties[2].color)
  path2.setAttribute('filter', `url(#${filterId})`)
  path2.setAttribute('transform',
    `translate(${properties[2].translateX} ${properties[2].translateY}) rotate(${properties[2].rotate} ${SIZE / 2} ${SIZE / 2}) scale(${properties[2].scale})`
  )
  path2.setAttribute('style', 'mix-blend-mode: overlay')
  gMasked.appendChild(path2)

  svg.appendChild(gMasked)

  return svg
}
