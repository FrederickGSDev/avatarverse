import { hashCode, getRandomColor } from '../utils/utils.js'

const ELEMENTS = 4
const SIZE = 80

function generateColors (name, colors) {
  const numFromName = hashCode(name)
  const range = colors?.length || 0

  return Array.from({ length: ELEMENTS }, (_, i) =>
    getRandomColor(numFromName + i, colors, range)
  )
}

/**
 * Crea un avatar "sunset" como string SVG
 * @param {Object} params
 * @param {string} params.name
 * @param {Array<string>} [params.colors]
 * @param {string} [params.title]
 * @param {boolean} [params.rounded=false]
 * @param {number} [params.size=80]
 * @returns {string} SVG en string
 */
export default function createAvatarSunset ({
  name,
  colors = [],
  title = '',
  rounded = false,
  size = SIZE
}) {
  const sunsetColors = generateColors(name, colors)
  const nameWithoutSpace = name.replace(/\s/g, '')
  const maskId = `mask-${Math.random().toString(36).slice(2)}`
  const grad0Id = `gradient0-${nameWithoutSpace}`
  const grad1Id = `gradient1-${nameWithoutSpace}`

  return `
<svg
  viewBox="0 0 ${SIZE} ${SIZE}"
  width="${size}"
  height="${size}"
  fill="none"
  role="img"
  xmlns="http://www.w3.org/2000/svg"
>
  ${title ? `<title>${title}</title>` : ''}
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <rect width="${SIZE}" height="${SIZE}" fill="#fff" rx="${rounded ? SIZE * 2 : 0}" />
    </mask>
    <linearGradient id="${grad0Id}" x1="${SIZE / 2}" y1="0" x2="${SIZE / 2}" y2="${SIZE / 2}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${sunsetColors[0]}" />
      <stop offset="1" stop-color="${sunsetColors[1]}" />
    </linearGradient>
    <linearGradient id="${grad1Id}" x1="${SIZE / 2}" y1="${SIZE / 2}" x2="${SIZE / 2}" y2="${SIZE}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${sunsetColors[2]}" />
      <stop offset="1" stop-color="${sunsetColors[3]}" />
    </linearGradient>
  </defs>
  <g mask="url(#${maskId})">
    <path d="M0 0h80v40H0z" fill="url(#${grad0Id})" />
    <path d="M0 40h80v40H0z" fill="url(#${grad1Id})" />
  </g>
</svg>
  `.trim()
}
