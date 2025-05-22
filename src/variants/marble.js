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
 * Genera un avatar estilo "Marble" como SVG string
 * @param {Object} params
 * @param {string} params.name
 * @param {Array<string>} [params.colors]
 * @param {string} [params.title]
 * @param {boolean} [params.rounded=false]
 * @param {number} [params.size=80]
 * @returns {string} SVG como cadena
 */
export default function createAvatarMarble ({
  name,
  colors = [],
  title = '',
  rounded = false,
  size = SIZE
}) {
  const properties = generateColors(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2, 9)}`
  const filterId = `filter-${maskId}`

  return `
<svg viewBox="0 0 ${SIZE} ${SIZE}" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
  ${title ? `<title>${title}</title>` : ''}
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <rect width="${SIZE}" height="${SIZE}" fill="#FFFFFF" rx="${rounded ? SIZE * 2 : 0}" />
    </mask>
    <filter id="${filterId}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
      <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur" />
    </filter>
  </defs>
  <g mask="url(#${maskId})">
    <rect width="${SIZE}" height="${SIZE}" fill="${properties[0].color}" />
    <path
      d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
      fill="${properties[1].color}"
      filter="url(#${filterId})"
      transform="translate(${properties[1].translateX} ${properties[1].translateY}) rotate(${properties[1].rotate} ${SIZE / 2} ${SIZE / 2}) scale(${properties[1].scale})"
    />
    <path
      d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
      fill="${properties[2].color}"
      filter="url(#${filterId})"
      style="mix-blend-mode: overlay"
      transform="translate(${properties[2].translateX} ${properties[2].translateY}) rotate(${properties[2].rotate} ${SIZE / 2} ${SIZE / 2}) scale(${properties[2].scale})"
    />
  </g>
</svg>
`.trim()
}
