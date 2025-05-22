import { hashCode, getRandomColor } from '../utils/utils.js'

const ELEMENTS = 64
const SIZE = 80

function generateColors (name, colors) {
  const numFromName = hashCode(name)
  const range = colors?.length || 0

  return Array.from({ length: ELEMENTS }, (_, i) =>
    getRandomColor(numFromName % (i + 1), colors, range)
  )
}

/**
 * Genera un avatar tipo "pixel" como string SVG
 * @param {Object} params
 * @param {string} params.name
 * @param {Array<string>} [params.colors]
 * @param {string} [params.title]
 * @param {boolean} [params.rounded=false]
 * @param {number} [params.size=80]
 * @returns {string} SVG como cadena
 */
export default function createAvatarPixel ({
  name,
  colors = [],
  title = '',
  rounded = false,
  size = SIZE
}) {
  const pixelColors = generateColors(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2, 9)}`
  const spacing = 10

  // Genera los rectángulos de píxeles en forma de string
  const pixelsSVG = Array(8).fill(null).map((_, y) =>
    Array(8).fill(null).map((_, x) => {
      const i = y * 8 + x
      return `<rect x="${x * spacing}" y="${y * spacing}" width="${spacing}" height="${spacing}" fill="${pixelColors[i]}" />`
    }).join('')
  ).join('')

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
    ${pixelsSVG}
  </g>
</svg>
  `.trim()
}
