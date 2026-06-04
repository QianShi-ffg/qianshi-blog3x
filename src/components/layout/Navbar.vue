<script setup lang="ts">
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'
import { gsap } from 'gsap'
import ThemeToggle from './ThemeToggle.vue'

const isScrolled = ref(false)
const menuOpen = ref(false)
const activeNavPath = ref('')
const navRoot = ref<HTMLElement | null>(null)
const desktopNav = ref<HTMLElement | null>(null)
const hoverPill = ref<HTMLElement | null>(null)
const route = useRoute()
let ctx: gsap.Context | undefined
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
const isArticleDetailRoute = computed(() => route.name === 'blog-post')

const navLinks = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/blog' },
  { name: '日记', path: '/diary' },
  { name: '作品', path: '/portfolio' },
  { name: '简历', path: '/resume' },
  { name: '友链', path: '/links' },
  { name: '日志', path: '/changelog' },
]

const isNavLinkActive = (path: string) => {
  const currentPath = activeNavPath.value || route.path

  if (path === '/') return currentPath === '/'

  return currentPath === path || currentPath.startsWith(`${path}/`)
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleResize = () => {
  syncActiveNavPill(true)
}

const moveNavPill = (target: HTMLElement | null, immediate = false) => {
  if (!desktopNav.value || !hoverPill.value || !target) return

  const navRect = desktopNav.value.getBoundingClientRect()
  const linkRect = target.getBoundingClientRect()
  const x = linkRect.left - navRect.left - 6
  const width = linkRect.width + 12

  gsap.to(hoverPill.value, {
    x,
    width,
    autoAlpha: 1,
    duration: immediate || prefersReducedMotion() ? 0 : 0.3,
    ease: 'power3.out',
    overwrite: 'auto',
  })
}

const syncActiveNavPill = (immediate = false) => {
  const activeLink = desktopNav.value?.querySelector<HTMLElement>('.navbar-link-active')

  if (!activeLink) {
    if (hoverPill.value) {
      gsap.to(hoverPill.value, {
        autoAlpha: 0,
        duration: immediate || prefersReducedMotion() ? 0 : 0.18,
        overwrite: 'auto',
      })
    }
    return
  }

  moveNavPill(activeLink, immediate)
}

const onNavLinkEnter = (event: MouseEvent) => {
  moveNavPill(event.currentTarget as HTMLElement)
}

const onNavLinkClick = (path: string, event: MouseEvent) => {
  activeNavPath.value = path
  moveNavPill(event.currentTarget as HTMLElement)
}

const onDesktopNavLeave = () => {
  syncActiveNavPill()
}

onMounted(() => {
  activeNavPath.value = route.path
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  handleScroll()
  nextTick(() => syncActiveNavPill(true))

  if (!navRoot.value || prefersReducedMotion()) return

  ctx = gsap.context(() => {
    gsap.from('.navbar-inner', {
      autoAlpha: 0,
      y: -18,
      scaleX: 0.98,
      scaleY: 0.98,
      duration: 0.55,
      ease: 'power3.out',
    })

    gsap.from('.navbar-link', {
      autoAlpha: 0,
      y: -8,
      duration: 0.36,
      stagger: 0.045,
      ease: 'power2.out',
      delay: 0.12,
    })
  }, navRoot.value)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  ctx?.revert()
})

watch(
  () => route.path,
  (path) => {
    activeNavPath.value = path
    nextTick(() => syncActiveNavPill())
  },
)

const onMobileMenuEnter = (el: Element, done: () => void) => {
  const dropdown = el as HTMLElement
  const links = dropdown.querySelectorAll('.navbar-mobile-link')

  gsap
    .timeline({ onComplete: done })
    .fromTo(
      dropdown,
      { autoAlpha: 0, y: -12, scaleX: 0.98, scaleY: 0.98 },
      { autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.22, ease: 'power2.out' },
    )
    .from(
      links,
      {
        autoAlpha: 0,
        x: -8,
        duration: 0.18,
        stagger: 0.025,
        ease: 'power2.out',
      },
      '-=0.08',
    )
}

const onMobileMenuLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    autoAlpha: 0,
    y: -10,
    scaleX: 0.98,
    scaleY: 0.98,
    duration: 0.16,
    ease: 'power2.in',
    onComplete: done,
  })
}
</script>

<template>
  <header
    ref="navRoot"
    class="navbar-header"
    :class="{
      'navbar-scrolled': isScrolled,
      'navbar-cover': isArticleDetailRoute && !isScrolled,
    }"
  >
    <div class="navbar-container">
      <div class="navbar-inner" :class="{ 'navbar-inner-scrolled': isScrolled }">
        <!-- Logo -->
        <RouterLink to="/" class="navbar-brand group">
          <div class="navbar-logo-icon">R</div>
          <span class="navbar-logo-text">QianShiBlog</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <div class="navbar-desktop-actions">
          <nav ref="desktopNav" class="navbar-desktop-nav" @mouseleave="onDesktopNavLeave">
            <span ref="hoverPill" class="navbar-hover-pill" aria-hidden="true"></span>
            <RouterLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="navbar-link"
              :class="{ 'navbar-link-active': isNavLinkActive(link.path) }"
              @mouseenter="onNavLinkEnter"
              @click="onNavLinkClick(link.path, $event)"
            >
              {{ link.name }}
              <span
                class="navbar-link-indicator"
                :class="{ 'indicator-active': isNavLinkActive(link.path) }"
              ></span>
            </RouterLink>
          </nav>

          <div class="navbar-theme-desktop">
            <ThemeToggle />
          </div>
        </div>

        <!-- Mobile Menu Toggle & Theme -->
        <div class="navbar-mobile-actions">
          <ThemeToggle />
          <button @click="menuOpen = !menuOpen" class="navbar-mobile-toggle interactive-lift">
            <Menu v-if="!menuOpen" class="navbar-mobile-icon" />
            <X v-else class="navbar-mobile-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Nav Dropdown -->
    <transition
      :css="false"
      @enter="onMobileMenuEnter"
      @leave="onMobileMenuLeave"
    >
      <div v-if="menuOpen" class="navbar-mobile-dropdown">
        <nav class="navbar-mobile-nav">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="activeNavPath = link.path; menuOpen = false"
            class="navbar-mobile-link"
            :class="{ 'navbar-mobile-link-active': isNavLinkActive(link.path) }"
          >
            {{ link.name }}
          </RouterLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.navbar-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition-property: padding, background-color, border-color, box-shadow;
  transition-duration: 300ms;
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  padding-top: 1.5rem; /* py-6 */
  padding-bottom: 1.5rem;
}

.navbar-scrolled {
  padding-top: 1rem; /* py-4 */
  padding-bottom: 1rem;
}

.navbar-cover {
  color: rgba(255, 255, 255, 0.86);
}

@media (min-width: 640px) {
  .navbar-header {
    padding-left: 1.5rem; /* sm:px-6 */
    padding-right: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .navbar-header {
    padding-left: 3rem; /* lg:px-12 */
    padding-right: 3rem;
  }
}

.navbar-container {
  width: 100%;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  transition-property: color, background-color;
  transition-duration: 300ms;
  border-radius: 9999px; /* rounded-full */
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  padding-top: 0.75rem; /* py-3 */
  padding-bottom: 0.75rem; /* py-3 */
  background-color: transparent;
}

.navbar-cover .navbar-inner {
  background: transparent;
  border: 0;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.navbar-inner-scrolled {
  background: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  text-decoration: none;
}

.navbar-logo-icon {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  border-radius: 9999px; /* rounded-full */
  background-color: #f43f5e; /* bg-rose-500 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700; /* font-bold */
  font-size: 1.125rem; /* text-lg */
  transition-property: transform;
  transition-duration: 300ms;
}

.group:hover .navbar-logo-icon {
  transform: scale(1.1); /* group-hover:scale-110 */
}

.navbar-logo-text {
  font-weight: 700; /* font-bold */
  color: var(--color-heading);
  letter-spacing: -0.025em; /* tracking-tight */
  font-size: 1.125rem; /* text-lg */
  transition-property: color;
  transition-duration: 150ms;
}

.navbar-cover .navbar-logo-text {
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 8px rgba(15, 23, 42, 0.32);
}

.group:hover .navbar-logo-text {
  color: #f43f5e; /* group-hover:text-rose-500 */
}

.navbar-desktop-actions {
  display: none; /* hidden */
  align-items: center;
  gap: 2rem; /* gap-8 */
}

@media (min-width: 768px) {
  .navbar-desktop-actions {
    display: flex; /* md:flex */
  }
}

.navbar-desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem; /* gap-8 */
  position: relative;
  isolation: isolate;
}

.navbar-hover-pill {
  position: absolute;
  top: 50%;
  left: 0;
  width: 0;
  height: 1.45rem;
  box-sizing: border-box;
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-50%);
  transform-origin: left center;
  background: rgba(244, 63, 94, 0.16);
  filter: blur(12px);
  z-index: 0;
  will-change: transform, opacity, width;
}

.navbar-cover .navbar-hover-pill {
  background: rgba(244, 63, 94, 0.34);
  filter: blur(14px);
}

:global(html.dark .navbar-hover-pill){
  background: rgba(244, 63, 94, 0.24);
}

.navbar-theme-desktop {
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  border-left: 1px solid #e2e8f0; /* slate-200 */
}

.navbar-cover .navbar-theme-desktop {
  border-left-color: rgba(255, 255, 255, 0.34);
}

:global(.navbar-cover .theme-toggle-btn){
  color: rgba(255, 255, 255, 0.7);
}

:global(html.dark .navbar-cover .theme-toggle-btn){
  color: rgba(255, 255, 255, 0.7);
}

:global(.navbar-cover .theme-toggle-btn:hover){
  color: #ffffff;
}

:global(html.dark .navbar-cover .theme-toggle-btn:hover){
  color: #ffffff;
}

:global(html.dark .navbar-theme-desktop){
  border-left-color: #334155; /* slate-700 */
}

.navbar-mobile-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .navbar-mobile-actions {
    display: none; /* md:hidden */
  }
}

.navbar-link {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  transition-property: color;
  transition-duration: 150ms;
  position: relative; /* relative */
  z-index: 1;
  padding: 0.5rem 0.125rem;
  text-decoration: none;
  color: var(--color-text);
  will-change: color;
}

.navbar-cover .navbar-link {
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 8px rgba(15, 23, 42, 0.36);
}

.navbar-link:hover {
  color: var(--color-primary);
}

.navbar-cover .navbar-link:hover {
  color: #ffffff;
}

.navbar-link-active {
  color: #f43f5e; /* text-rose-500 */
}

.navbar-cover .navbar-link-active {
  color: #fb7185;
}

.navbar-link-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 0.25rem; /* w-1 */
  height: 0.25rem; /* h-1 */
  border-radius: 9999px; /* rounded-full */
  background-color: #f43f5e; /* bg-rose-500 */
  transition-property: all;
  transition-duration: 300ms;
  opacity: 0;
}

.indicator-active {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.navbar-mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  border-radius: 9999px; /* rounded-full */
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  transition-property: all;
  transition-duration: 200ms;
}

.navbar-cover .navbar-mobile-toggle {
  color: rgba(255, 255, 255, 0.78);
}

.navbar-mobile-toggle:hover {
  background-color: var(--color-border);
  color: var(--color-heading);
}

@media (min-width: 768px) {
  .navbar-mobile-toggle {
    display: none; /* md:hidden */
  }
}

.navbar-mobile-icon {
  width: 1.5rem; /* w-6 */
  height: 1.5rem; /* h-6 */
}

.navbar-mobile-dropdown {
  position: absolute;
  top: 100%;
  left: 1rem; /* left-4 */
  right: 1rem; /* right-4 */
  margin-top: 0.5rem; /* mt-2 */
  border-radius: 1rem; /* rounded-2xl */
  overflow: hidden;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  padding: 1rem; /* p-4 */
  background: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
}
:global(html.dark .navbar-mobile-dropdown){
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

@media (min-width: 768px) {
  .navbar-mobile-dropdown {
    display: none; /* md:hidden */
  }
}

.navbar-mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

.navbar-mobile-link {
  display: block;
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  padding-top: 0.75rem; /* py-3 */
  padding-bottom: 0.75rem;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 1rem; /* text-base */
  font-weight: 500; /* font-medium */
  transition-property: color, background-color;
  transition-duration: 150ms;
  text-decoration: none;
  color: var(--color-text);
}

.navbar-mobile-link:hover {
  background-color: var(--color-border);
  color: var(--color-heading);
}

.navbar-mobile-link-active {
  color: #f43f5e; /* text-rose-500 */
  background-color: var(--color-border);
}

@media (max-width: 767px) {
  .navbar-brand {
    min-height: 44px;
  }

  .navbar-mobile-toggle {
    width: 44px;
    height: 44px;
  }

  .navbar-cover {
    color: var(--color-text);
  }

  .navbar-cover .navbar-logo-text {
    color: var(--color-heading);
    text-shadow: none;
  }

  .navbar-cover .navbar-inner {
    background: transparent;
    border: 0;
    box-shadow: none;
  }

  .navbar-cover .navbar-mobile-toggle {
    color: var(--color-text);
  }

  .navbar-cover .navbar-mobile-toggle:hover {
    background-color: var(--color-border);
    color: var(--color-heading);
  }

  :global(.navbar-cover .theme-toggle-btn),
  :global(html.dark .navbar-cover .theme-toggle-btn) {
    color: var(--color-text);
  }

  :global(.navbar-cover .theme-toggle-btn:hover),
  :global(html.dark .navbar-cover .theme-toggle-btn:hover) {
    color: var(--color-primary);
  }
}

/* Mobile Menu Transitions */
.mobile-menu-enter-active {
  transition: all 200ms ease-out;
}

.mobile-menu-leave-active {
  transition: all 150ms ease-in;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-1rem); /* -translate-y-4 */
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
