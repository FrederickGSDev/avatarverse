import { hashCode, getUnit, getBoolean, getRandomColor, getContrast } from '../utils/utils.js'

const SIZE = 36

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

export default function createAvatarBeam ({
  name,
  colors = [],
  rounded = false,
  size = SIZE,
  title = ''
}) {
  const data = generateData(name, colors)
  const maskId = `mask-${Math.random().toString(36).slice(2, 9)}`
  const rx = rounded ? SIZE : 0

  const mouth = data.isMouthOpen
    ? `<path d="M15 ${19 + data.mouthSpread}c2 1 4 1 6 0" stroke="${data.faceColor}" fill="none" stroke-linecap="round"/>`
    : `<path d="M13,${19 + data.mouthSpread} a1,0.75 0 0,0 10,0" fill="${data.faceColor}"/>`

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${size}" height="${size}" fill="none" role="img">
  ${title ? `<title>${title}</title>` : ''}
  <defs>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${SIZE}" height="${SIZE}">
      <rect width="${SIZE}" height="${SIZE}" rx="${rx}" fill="#FFF" />
    </mask>
  </defs>
  <g mask="url(#${maskId})">
    <rect width="${SIZE}" height="${SIZE}" fill="${data.backgroundColor}" />
    <rect
      x="0"
      y="0"
      width="${SIZE}"
      height="${SIZE}"
      fill="${data.wrapperColor}"
      rx="${rx}"
      transform="translate(${data.wrapperTranslateX} ${data.wrapperTranslateY}) rotate(${data.wrapperRotate} ${SIZE / 2} ${SIZE / 2}) scale(${data.wrapperScale})"
    />
    <g transform="translate(${data.faceTranslateX} ${data.faceTranslateY}) rotate(${data.faceRotate} ${SIZE / 2} ${SIZE / 2})">
      ${mouth}
      <rect x="${14 - data.eyeSpread}" y="14" width="1.5" height="2" rx="1" fill="${data.faceColor}" />
      <rect x="${20 + data.eyeSpread}" y="14" width="1.5" height="2" rx="1" fill="${data.faceColor}" />
    </g>
  </g>
</svg>
`.trim()
}
