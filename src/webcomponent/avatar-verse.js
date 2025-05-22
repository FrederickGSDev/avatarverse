/* global HTMLElement */
import { generateAvatar } from '../generate-avatar.js'

export default class AvatarVerse extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static get observedAttributes () {
    return ['name', 'variant', 'size', 'colors', 'rounded', 'format', 'title']
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    this.render()
  }

  render () {
    const name = this.getAttribute('name') || 'Avatar'
    const variant = this.getAttribute('variant') || 'beam'
    const size = parseInt(this.getAttribute('size') || '36', 10)
    const rounded = this.hasAttribute('rounded')
    const format = this.getAttribute('format') || 'svg'
    const colorsAttr = this.getAttribute('colors') || ''
    const colors = colorsAttr.split(',').map(c => c.trim()).filter(Boolean)
    const title = this.getAttribute('title') || ''

    this.shadowRoot.innerHTML = ''

    try {
      const avatar = generateAvatar({ name, colors, variant, rounded, size, format, title })
      this.shadowRoot.appendChild(avatar)
    } catch (err) {
      console.error('AvatarVerse error:', err)
      this.shadowRoot.innerHTML = '<span style="color:red;">⚠️ Error generating avatar</span>'
    }
  }
}
