let previousBodyOverflow = ''
let previousBodyPaddingRight = ''
let isBodyScrollLocked = false

export const lockBodyScroll = () => {
  if (typeof window === 'undefined' || isBodyScrollLocked) return

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  previousBodyOverflow = document.body.style.overflow
  previousBodyPaddingRight = document.body.style.paddingRight
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
  document.body.style.setProperty('--lk-scrollbar-compensation', `${scrollbarWidth}px`)
  document.body.classList.add('lk-scroll-locked')
  isBodyScrollLocked = true
}

export const unlockBodyScroll = () => {
  if (typeof window === 'undefined' || !isBodyScrollLocked) return

  document.body.style.overflow = previousBodyOverflow
  document.body.style.paddingRight = previousBodyPaddingRight
  document.body.style.removeProperty('--lk-scrollbar-compensation')
  document.body.classList.remove('lk-scroll-locked')
  isBodyScrollLocked = false
}
