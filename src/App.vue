<script setup lang="ts">
import { RouterView } from 'vue-router'
import { gsap } from 'gsap'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import BackgroundBlobs from './components/layout/BackgroundBlobs.vue'
import { runRouteTransitionCleanups } from './utils/route-transition-cleanup'

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

const onPageBeforeEnter = (element: Element) => {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

  if (prefersReducedMotion()) return

  gsap.set(element, {
    autoAlpha: 0,
    y: 18,
    scale: 0.992,
    filter: 'blur(10px)',
    transformOrigin: '50% 0%',
  })
}

const onPageEnter = (element: Element, done: () => void) => {
  if (prefersReducedMotion()) {
    done()
    return
  }

  gsap.to(element, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    duration: 0.42,
    ease: 'power3.out',
    clearProps: 'opacity,visibility,transform,filter',
    onComplete: done,
  })
}

const onPageLeave = (element: Element, done: () => void) => {
  if (prefersReducedMotion()) {
    done()
    return
  }

  gsap.to(element, {
    autoAlpha: 0,
    y: -10,
    scale: 0.996,
    filter: 'blur(8px)',
    duration: 0.24,
    ease: 'power2.in',
    onComplete: () => {
      runRouteTransitionCleanups()
      done()
    },
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
        <transition
          mode="out-in"
          :css="false"
          @before-enter="onPageBeforeEnter"
          @enter="onPageEnter"
          @leave="onPageLeave"
        >
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
  isolation: isolate;
}

.app-main {
  flex-grow: 1;
  width: 100%;
  position: relative;
  z-index: 1;
  isolation: isolate;
}

</style>
