<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { RouterLink, useRoute } from 'vue-router'

const isScrolled = ref(false)
const menuOpen = ref(false)
const route = useRoute()

const navLinks = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/blog' },
  { name: '日记', path: '/diary' },
  { name: '作品', path: '/portfolio' },
  { name: '简历', path: '/resume' },
  { name: '友链', path: '/links' },
  { name: '日志', path: '/changelog' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header class="navbar-header" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <div class="navbar-inner" :class="{ 'navbar-inner-scrolled': isScrolled }">
        <!-- Logo -->
        <RouterLink to="/" class="navbar-brand group">
          <div class="navbar-logo-icon">
            R
          </div>
          <span class="navbar-logo-text">QianShiBlog</span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="navbar-desktop-nav">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="navbar-link"
            :class="{ 'navbar-link-active': route.path === link.path }"
          >
            {{ link.name }}
            <span
              class="navbar-link-indicator"
              :class="{ 'indicator-active': route.path === link.path }"
            ></span>
          </RouterLink>
        </nav>

        <!-- Mobile Menu Toggle -->
        <button
          @click="menuOpen = !menuOpen"
          class="navbar-mobile-toggle"
        >
          <Menu v-if="!menuOpen" class="navbar-mobile-icon" />
          <X v-else class="navbar-mobile-icon" />
        </button>
      </div>
    </div>

    <!-- Mobile Nav Dropdown -->
    <transition name="mobile-menu">
      <div v-if="menuOpen" class="navbar-mobile-dropdown">
        <nav class="navbar-mobile-nav">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            @click="menuOpen = false"
            class="navbar-mobile-link"
            :class="{ 'navbar-mobile-link-active': route.path === link.path }"
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
  transition-property: all;
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
  max-width: 1536px; /* max-w-screen-2xl */
  margin-left: auto;
  margin-right: auto;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  transition-property: all;
  transition-duration: 300ms;
  border-radius: 9999px; /* rounded-full */
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  padding-top: 0.75rem; /* py-3 */
  padding-bottom: 0.75rem; /* py-3 */
  background-color: transparent;
}

.navbar-inner-scrolled {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
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
  color: #1e293b; /* text-slate-800 */
  letter-spacing: -0.025em; /* tracking-tight */
  font-size: 1.125rem; /* text-lg */
  transition-property: color;
  transition-duration: 150ms;
}

.group:hover .navbar-logo-text {
  color: #f43f5e; /* group-hover:text-rose-500 */
}

.navbar-desktop-nav {
  display: none; /* hidden */
  align-items: center;
  gap: 2rem; /* gap-8 */
}

@media (min-width: 768px) {
  .navbar-desktop-nav {
    display: flex; /* md:flex */
  }
}

.navbar-link {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  transition-property: color;
  transition-duration: 150ms;
  position: relative; /* relative */
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
  text-decoration: none;
  color: #64748b; /* text-slate-500 */
}

.navbar-link:hover {
  color: #0f172a; /* hover:text-slate-900 */
}

.navbar-link-active {
  color: #f43f5e; /* text-rose-500 */
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
  display: block;
  padding: 0.5rem; /* p-2 */
  color: #475569; /* text-slate-600 */
  border-radius: 9999px; /* rounded-full */
  transition-property: color, background-color;
  transition-duration: 150ms;
  background: transparent;
  border: none;
  cursor: pointer;
}

.navbar-mobile-toggle:hover {
  color: #f43f5e; /* hover:text-rose-500 */
  background-color: #fff1f2; /* hover:bg-rose-50 */
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
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  padding: 1rem; /* p-4 */
  background: rgba(255, 255, 255, 0.85); /* glass-card */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
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
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  padding-top: 0.75rem; /* py-3 */
  padding-bottom: 0.75rem;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  transition-property: color, background-color;
  transition-duration: 150ms;
  text-decoration: none;
  color: #475569; /* text-slate-600 */
}

.navbar-mobile-link:hover {
  background-color: #f8fafc; /* hover:bg-slate-50 */
}

.navbar-mobile-link-active {
  background-color: #fff1f2; /* bg-rose-50 */
  color: #e11d48; /* text-rose-600 */
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
