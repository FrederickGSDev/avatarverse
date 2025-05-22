import { hashCode, getUnit, getBoolean, getRandomColor, getContrast } from '../utils/utils.js'

// Tamaño base del avatar
const SIZE = 36

/**
 * Generar datos únicos para el avatar beam según nombre y colores
 */
function generateData (name, colors) {
  const numFromName = hashCode(name)
  const range = colors?.length || 0

  const wrapperColor = getRandomColor(numFromName, colors, range)
  const preTranslateX = getUnit(numFromName, 10, 1)
  const wrapperTranslateX = preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX

  const preTranslateY = getUnit(numFromName, 10, 2)
  const wrapperTranslateY = preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY

  return {
    wrapperColor,
    faceColor: getContrast(wrapperColor),
    backgroundColor: getRandomColor(numFromName + 13, colors, range),
    wrapperTranslateX,
    wrapperTranslateY,
    wrapperRotate: getUnit(numFromName, 360),
    wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
    isMouthOpen: getBoolean(numFromName, 2),
    eyeSpread: getUnit(numFromName, 5),
    mouthSpread: getUnit(numFromName, 3),
    faceRotate: getUnit(numFromName, 10, 3),
    faceTranslateX: wrapperTranslateX > SIZE / 6 ? wrapperTranslateX / 2 : getUnit(numFromName, 8, 1),
    faceTranslateY: wrapperTranslateY > SIZE / 6 ? wrapperTranslateY / 2 : getUnit(numFromName, 7, 2)
  }
}

/**
 * Función principal que crea el SVG para el avatar variante "beam"
 * @param {Object} params - Parámetros de configuración
 * @param {string} params.name - Nombre para generar avatar
 * @param {Array<string>} [params.colors] - Paleta de colores opcional
 * @param {boolean} [params.rounded=false] - Si true, avatar circular (esquinas totalmente redondeadas)
 * @param {number} [params.size=36] - Tamaño del SVG generado
 * @param {string} [params.title] - Título accesible para el avatar SVG (accesibilidad)
 * @returns {SVGElement} Elemento SVG del avatar generado
 */
export default function createAvatarBeam ({
  name,
  colors = [],
  rounded = false,
  size = SIZE,
  title = ''
}) {
  const data = generateData(name, colors)
  const svgNS = 'http://www.w3.org/2000/svg'
  const maskId = `mask-${Math.random().toString(36).slice(2, 9)}`

  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${SIZE} ${SIZE}`)
  svg.setAttribute('width', size)
  svg.setAttribute('height', size)
  svg.setAttribute('xmlns', svgNS)
  svg.setAttribute('fill', 'none')
  svg.setAttribute('role', 'img')

  // Soporte para título accesible
  if (title && typeof title === 'string') {
    const titleElement = document.createElementNS(svgNS, 'title')
    titleElement.textContent = title
    svg.appendChild(titleElement)
  }

  // Definición de máscara para esquinas redondeadas o cuadradas
  const defs = document.createElementNS(svgNS, 'defs')
  const mask = document.createElementNS(svgNS, 'mask')
  mask.setAttribute('id', maskId)
  mask.setAttribute('maskUnits', 'userSpaceOnUse')
  mask.setAttribute('x', '0')
  mask.setAttribute('y', '0')
  mask.setAttribute('width', SIZE)
  mask.setAttribute('height', SIZE)

  const rectMask = document.createElementNS(svgNS, 'rect')
  rectMask.setAttribute('width', SIZE)
  rectMask.setAttribute('height', SIZE)
  rectMask.setAttribute('fill', '#FFFFFF')

  // Si es circular (rounded = true) pone rx igual al tamaño para círculo perfecto,
  // si no (rounded = false) rx 0 para esquinas cuadradas
  rectMask.setAttribute('rx', rounded ? SIZE : 0)

  mask.appendChild(rectMask)
  defs.appendChild(mask)
  svg.appendChild(defs)

  // Grupo principal con máscara aplicada
  const gMasked = document.createElementNS(svgNS, 'g')
  gMasked.setAttribute('mask', `url(#${maskId})`)

  // Fondo
  const bgRect = document.createElementNS(svgNS, 'rect')
  bgRect.setAttribute('width', SIZE)
  bgRect.setAttribute('height', SIZE)
  bgRect.setAttribute('fill', data.backgroundColor)
  gMasked.appendChild(bgRect)

  // Wrapper coloreado y transformado
  const wrapper = document.createElementNS(svgNS, 'rect')
  wrapper.setAttribute('x', '0')
  wrapper.setAttribute('y', '0')
  wrapper.setAttribute('width', SIZE)
  wrapper.setAttribute('height', SIZE)
  wrapper.setAttribute('fill', data.wrapperColor)
  // Usamos el mismo rx para que coincida con la máscara
  wrapper.setAttribute('rx', rounded ? SIZE : 0)
  wrapper.setAttribute('transform', `
    translate(${data.wrapperTranslateX} ${data.wrapperTranslateY})
    rotate(${data.wrapperRotate} ${SIZE / 2} ${SIZE / 2})
    scale(${data.wrapperScale})
  `)
  gMasked.appendChild(wrapper)

  // Grupo de la cara
  const faceGroup = document.createElementNS(svgNS, 'g')
  faceGroup.setAttribute('transform', `
    translate(${data.faceTranslateX} ${data.faceTranslateY})
    rotate(${data.faceRotate} ${SIZE / 2} ${SIZE / 2})
  `)

  // Boca (abierta o cerrada)
  const mouth = document.createElementNS(svgNS, 'path')
  if (data.isMouthOpen) {
    mouth.setAttribute('d', `M15 ${19 + data.mouthSpread}c2 1 4 1 6 0`)
    mouth.setAttribute('stroke', data.faceColor)
    mouth.setAttribute('fill', 'none')
    mouth.setAttribute('stroke-linecap', 'round')
  } else {
    mouth.setAttribute('d', `M13,${19 + data.mouthSpread} a1,0.75 0 0,0 10,0`)
    mouth.setAttribute('fill', data.faceColor)
  }
  faceGroup.appendChild(mouth)

  // Ojo izquierdo
  const leftEye = document.createElementNS(svgNS, 'rect')
  leftEye.setAttribute('x', 14 - data.eyeSpread)
  leftEye.setAttribute('y', 14)
  leftEye.setAttribute('width', 1.5)
  leftEye.setAttribute('height', 2)
  leftEye.setAttribute('rx', 1)
  leftEye.setAttribute('fill', data.faceColor)
  faceGroup.appendChild(leftEye)

  // Ojo derecho
  const rightEye = document.createElementNS(svgNS, 'rect')
  rightEye.setAttribute('x', 20 + data.eyeSpread)
  rightEye.setAttribute('y', 14)
  rightEye.setAttribute('width', 1.5)
  rightEye.setAttribute('height', 2)
  rightEye.setAttribute('rx', 1)
  rightEye.setAttribute('fill', data.faceColor)
  faceGroup.appendChild(rightEye)

  gMasked.appendChild(faceGroup)
  svg.appendChild(gMasked)

  return svg
}
