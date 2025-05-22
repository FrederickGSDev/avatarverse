import AvatarVerse from './avatar-verse.js'

if (typeof window !== 'undefined' && typeof window.customElements !== 'undefined' && !window.customElements.get('avatar-verse')) {
  window.customElements.define('avatar-verse', AvatarVerse)
}
