import { hashCode, getRandomColor } from '../utils/utils.js'

const SIZE = 90
const COLORS = 5

function generateColors (colors, name) {
  const numFromName = hashCode(name)
  const range = colors?.length || 0
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
 * Crea un avatar tipo "Ring" como string SVG
 * @param {Object} params
 * @param {string} params.name
 * @param {Array<string>} [params.colors]
 * @param {string} [params.title]
 * @param {boolean} [params.rounded=true]
 * @param {number} [params.size=90]
 * @returns {string} SVG en string
 */
export default function createAvatarRing ({
  name,
  colors = [],
  title = '',
  rounded = true,
  size = SIZE
}) {
  const ringColors = generateColors(colors, name)
  const maskId = `mask-${Math.random().toString(36).slice(2)}`

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
      <rect width="${SIZE}" height="${SIZE}" fill="#FFFFFF" rx="${rounded ? SIZE * 2 : 0}" />
    </mask>
  </defs>
  <g mask="url(#${maskId})">
    ${paths.map(([d, fill]) => `<path d="${d}" fill="${fill}" />`).join('')}
    <circle cx="45" cy="45" r="23" fill="${ringColors[8]}" />
  </g>
</svg>
  `.trim()
}
