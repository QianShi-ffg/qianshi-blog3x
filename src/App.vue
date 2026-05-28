<script setup lang="ts">
import { RouterView } from 'vue-router'
import { gsap } from 'gsap'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import BackgroundBlobs from './components/layout/BackgroundBlobs.vue'

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const pressTargets = [
  'button',
  'a',
  '.blog-article-card',
  '.diary-card',
  '.portfolio-card',
  '.lk-card',
  '.cl-glass-card',
  '.resume-skill-item',
  '.pd-gallery-item',
  '.comment-item',
].join(',')

const onAppPointerDown = (event: PointerEvent) => {
  if (prefersReducedMotion()) return

  const target = event.target as Element | null
  const element = target?.closest<HTMLElement>(pressTargets)
  if (!element || element.closest('[disabled]')) return

  gsap.to(element, {
    scaleX: 0.985,
    scaleY: 0.985,
    duration: 0.08,
    ease: 'power2.out',
    overwrite: 'auto',
    yoyo: true,
    repeat: 1,
  })
}
</script>

<template>
  <div class="app-container" @pointerdown.capture="onAppPointerDown">
    <!-- Global Dynamic Background -->
    <BackgroundBlobs />

    <Navbar />

    <main class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>

<style>
/* Global Selection Style */
::selection {
  background-color: #f43f5e; /* rose-500 */
  color: #ffffff; /* white */
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: transparent;
  color: #475569; /* slate-600 */
  position: relative;
}

.app-main {
  flex-grow: 1;
  width: 100%;
  position: relative;
  isolation: isolate;
}

.page-fade-enter-active {
  transition: opacity 180ms ease;
}

.page-fade-leave-active {
  pointer-events: none;
  transition: opacity 140ms ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
