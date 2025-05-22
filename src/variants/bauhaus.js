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
 * Genera un avatar estilo Bauhaus como cadena SVG.
 * @param {Object} params
 * @param {string} params.name
 * @param {Array<string>} [params.colors]
 * @param {string} [params.title]
 * @param {boolean} [params.rounded=true]
 * @param {number} [params.size=80]
 * @returns {string} SVG como cadena
 */
export default function createAvatarBauhaus ({
  name,
  colors = [],
  title = '',
  rounded = true,
  size = SIZE
}) {
  const properties = generateColors(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2)}`

  return `
<svg viewBox="0 0 ${SIZE} ${SIZE}" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
  ${title ? `<title>${title}</title>` : ''}
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <rect width="${SIZE}" height="${SIZE}" fill="#fff" rx="${rounded ? SIZE * 2 : 0}" />
    </mask>
  </defs>
  <g mask="url(#${maskId})">
    <rect width="${SIZE}" height="${SIZE}" fill="${properties[0].color}" />
    <rect
      x="${(SIZE - 60) / 2}" y="${(SIZE - 20) / 2}"
      width="${SIZE}" height="${properties[1].isSquare ? SIZE : SIZE / 8}"
      fill="${properties[1].color}"
      transform="translate(${properties[1].translateX} ${properties[1].translateY}) rotate(${properties[1].rotate} ${SIZE / 2} ${SIZE / 2})"
    />
    <circle
      cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 5}"
      fill="${properties[2].color}"
      transform="translate(${properties[2].translateX} ${properties[2].translateY})"
    />
    <line
      x1="0" y1="${SIZE / 2}" x2="${SIZE}" y2="${SIZE / 2}"
      stroke="${properties[3].color}" stroke-width="2"
      transform="translate(${properties[3].translateX} ${properties[3].translateY}) rotate(${properties[3].rotate} ${SIZE / 2} ${SIZE / 2})"
    />
  </g>
</svg>
`.trim()
}
