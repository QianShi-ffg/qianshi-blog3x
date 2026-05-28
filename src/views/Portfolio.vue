<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { listProjects } from '@/api/portfolio'
import type { Project } from '@/types/content'
import { registerRouteTransitionCleanup } from '@/utils/route-transition-cleanup'

const projects = ref<Project[]>([])
const isProjectsLoading = ref(true)
const portfolioRoot = ref<HTMLElement | null>(null)
let hoverCtx: gsap.Context | undefined
let headerParallaxCtx: gsap.Context | undefined
let unregisterTransitionCleanup: (() => void) | undefined
let hoverCleanups: Array<() => void> = []

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const setupPortfolioHover = () => {
  hoverCleanups.forEach((cleanup) => cleanup())
  hoverCleanups = []
  hoverCtx?.revert()

  if (!portfolioRoot.value || prefersReducedMotion()) return

  hoverCtx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.portfolio-card:not(.portfolio-card-skeleton)')

    cards.forEach((card) => {
      const image = card.querySelector<HTMLElement>('.portfolio-image')
      const overlay = card.querySelector<HTMLElement>('.portfolio-overlay')
      const actions = card.querySelectorAll<HTMLElement>('.portfolio-action-btn')
      const title = card.querySelector<HTMLElement>('.portfolio-project-title')
      const arrow = card.querySelector<HTMLElement>('.portfolio-arrow-icon')

      const enter = () => {
        gsap.to(card, {
          filter: 'drop-shadow(0 18px 30px rgba(244, 63, 94, 0.12))',
          duration: 0.32,
          ease: 'power2.out',
          overwrite: true,
        })
        gsap.to(image, { scale: 1.045, duration: 0.8, ease: 'power3.out', overwrite: true })
        gsap.to(overlay, { autoAlpha: 1, duration: 0.36, ease: 'power2.out', overwrite: true })
        gsap.to(actions, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.36,
          stagger: 0.05,
          ease: 'back.out(1.4)',
          overwrite: true,
        })
        gsap.to(title, { color: 'var(--color-primary)', duration: 0.22, overwrite: true })
        gsap.to(arrow, { autoAlpha: 1, x: 0, duration: 0.28, ease: 'power3.out', overwrite: true })
      }

      const leave = () => {
        gsap.to(card, {
          filter: 'drop-shadow(0 0 0 rgba(244, 63, 94, 0))',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: true,
        })
        gsap.to(image, { scale: 1, duration: 0.7, ease: 'power3.out', overwrite: true })
        gsap.to(overlay, { autoAlpha: 0, duration: 0.28, ease: 'power2.out', overwrite: true })
        gsap.to(actions, {
          autoAlpha: 0,
          y: 10,
          scale: 0.96,
          duration: 0.24,
          stagger: 0.03,
          ease: 'power2.out',
          overwrite: true,
        })
        gsap.to(title, { color: 'var(--color-heading)', duration: 0.22, overwrite: true })
        gsap.to(arrow, { autoAlpha: 0, x: -8, duration: 0.22, ease: 'power2.out', overwrite: true })
      }

      card.addEventListener('pointerenter', enter)
      card.addEventListener('pointerleave', leave)

      hoverCleanups.push(() => {
        card.removeEventListener('pointerenter', enter)
        card.removeEventListener('pointerleave', leave)
      })
    })
  }, portfolioRoot.value)
}

const setupHeaderParallax = () => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()

  if (!portfolioRoot.value || prefersReducedMotion()) return

  headerParallaxCtx = gsap.context(() => {
    const header = portfolioRoot.value?.querySelector<HTMLElement>('.portfolio-header-container')
    if (!header) return

    gsap.to(header, {
      y: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: header,
        start: 'top 10%',
        end: 'bottom 18%',
        scrub: 0.75,
      },
    })
  }, portfolioRoot.value)

  unregisterTransitionCleanup = registerRouteTransitionCleanup(() => {
    headerParallaxCtx?.revert()
    headerParallaxCtx = undefined
    unregisterTransitionCleanup = undefined
  })

  ScrollTrigger.refresh()
}

onMounted(async () => {
  isProjectsLoading.value = true
  try {
    projects.value = await listProjects()
  } finally {
    isProjectsLoading.value = false
    await nextTick()
    setupPortfolioHover()
    setupHeaderParallax()
  }
})

onBeforeUnmount(() => {
  hoverCleanups.forEach((cleanup) => cleanup())
  hoverCleanups = []
  hoverCtx?.revert()
})

onUnmounted(() => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()
})

</script>

<template>
  <div ref="portfolioRoot" class="portfolio-page-container">
    <!-- Header -->
    <div class="portfolio-header-container">
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="portfolio-title"
      >
        精选作品
      </h1>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
        class="portfolio-subtitle"
      >
        将想法转化为现实。以下是我参与开发的一些开源项目和个人作品。
      </p>
    </div>

    <!-- Projects Grid -->
    <div v-if="isProjectsLoading" class="portfolio-grid" aria-live="polite" aria-busy="true">
      <div v-for="item in 4" :key="item" class="portfolio-card portfolio-card-skeleton">
        <div class="portfolio-image-wrapper portfolio-skeleton-image"></div>
        <div class="portfolio-skeleton-chip"></div>
        <div class="portfolio-skeleton-title"></div>
        <div class="portfolio-skeleton-text"></div>
        <div class="portfolio-skeleton-text portfolio-skeleton-text-short"></div>
        <div class="portfolio-skeleton-tags">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div v-else class="portfolio-grid">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 100 } }"
        class="portfolio-card"
      >
        <!-- Project Image -->
        <div class="portfolio-image-wrapper interactive-media">
          <img :src="project.image" :alt="project.title" class="portfolio-image" />
          <div class="portfolio-overlay">
            <a :href="project.github" target="_blank" class="portfolio-action-btn">
              <Github class="portfolio-icon" />
            </a>
            <a :href="project.demo" target="_blank" class="portfolio-action-btn">
              <ExternalLink class="portfolio-icon" />
            </a>
          </div>
        </div>

        <!-- Project Info -->
        <router-link :to="`/portfolio/${project.id}`" class="portfolio-content-link block cursor-pointer">
          <div class="portfolio-category-wrapper">
            <span class="portfolio-category-badge">
              {{ project.category }}
            </span>
          </div>

          <h2 class="portfolio-project-title">
            {{ project.title }}
            <ArrowUpRight class="portfolio-arrow-icon interactive-arrow" />
          </h2>

          <p class="portfolio-project-desc">
            {{ project.desc }}
          </p>

          <div class="portfolio-tags-wrapper">
            <span v-for="tag in project.tags" :key="tag" class="portfolio-tag-badge">
              {{ tag }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.portfolio-page-container {
  @apply min-h-[80vh] py-12 pt-24 px-6 mx-auto max-w-screen-2xl;
}
@media (min-width: 640px) {
  .portfolio-page-container {
    @apply px-12;
  }
}
@media (min-width: 768px) {
  .portfolio-page-container {
    @apply px-20;
  }
}
@media (min-width: 1024px) {
  .portfolio-page-container {
    @apply py-20 pt-32 px-32;
  }
}
@media (min-width: 1280px) {
  .portfolio-page-container {
    @apply px-48;
  }
}

.portfolio-header-container {
  @apply mb-16;
  will-change: transform;
}

.portfolio-title {
  @apply text-4xl font-bold tracking-tight mb-4;
  color: var(--color-heading);
}
:global(html.dark .portfolio-title){
  color: #e2e8f0;
}
@media (min-width: 768px) {
  .portfolio-title {
    @apply text-5xl;
  }
}

.portfolio-subtitle {
  @apply text-lg max-w-2xl;
  color: var(--color-text);
}

.portfolio-grid {
  @apply grid grid-cols-1 gap-12;
}
@media (min-width: 1024px) {
  .portfolio-grid {
    @apply grid-cols-2 gap-16;
  }
}

.portfolio-card {
  border-radius: 1.5rem;
  padding-bottom: 0.25rem;
  will-change: filter;
}

.portfolio-card:hover {
  filter: drop-shadow(0 18px 30px rgba(244, 63, 94, 0.12));
}

:global(html.dark .portfolio-card:hover){
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.28));
}

.portfolio-card-skeleton {
  pointer-events: none;
}

.portfolio-skeleton-image,
.portfolio-skeleton-chip,
.portfolio-skeleton-title,
.portfolio-skeleton-text,
.portfolio-skeleton-tags span {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: portfolio-skeleton-shimmer 1.5s ease-in-out infinite;
}

.portfolio-skeleton-image {
  border-radius: 1.5rem;
}

.portfolio-skeleton-chip {
  width: 5.5rem;
  height: 1.5rem;
  margin-bottom: 0.75rem;
}

.portfolio-skeleton-title {
  width: 72%;
  height: 1.75rem;
  margin-bottom: 0.875rem;
}

.portfolio-skeleton-text {
  width: 100%;
  height: 0.875rem;
  margin-bottom: 0.625rem;
}

.portfolio-skeleton-text-short {
  width: 64%;
  margin-bottom: 1.25rem;
}

.portfolio-skeleton-tags {
  display: flex;
  gap: 0.5rem;
}

.portfolio-skeleton-tags span {
  width: 4rem;
  height: 1.625rem;
}

.portfolio-image-wrapper {
  @apply relative overflow-hidden rounded-3xl aspect-[16/10];
  margin-bottom: 1rem;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.portfolio-content-link {
  padding: 0 20px;
}

.portfolio-image {
  @apply w-full h-full object-cover;
  transition: transform 0.7s ease;
  will-change: transform;
}

.portfolio-card:hover .portfolio-image {
  transform: scale(1.045);
}

.portfolio-overlay {
  @apply absolute inset-0 bg-black/5 opacity-0 flex items-center justify-center gap-4;
  visibility: hidden;
  transition:
    opacity 0.36s ease,
    visibility 0.36s ease;
}

.portfolio-card:hover .portfolio-overlay {
  opacity: 1;
  visibility: visible;
}

.portfolio-action-btn {
  @apply w-12 h-12 rounded-full flex items-center justify-center;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--color-heading);
  opacity: 0;
  transform: translateY(10px) scale(0.96);
  transition:
    opacity 0.28s ease,
    transform 0.32s ease,
    color 0.2s ease;
  will-change: transform, opacity;
}
.portfolio-action-btn:hover {
  color: var(--color-primary);
}

.portfolio-card:hover .portfolio-action-btn {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.portfolio-card:hover .portfolio-action-btn:nth-child(2) {
  transition-delay: 0.05s;
}

.portfolio-icon {
  @apply w-5 h-5;
}

.portfolio-category-wrapper {
  @apply flex items-center gap-3 mb-3;
}

.portfolio-category-badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
  background-color: var(--color-secondary);
  color: var(--color-primary);
}
:global(html.dark .portfolio-category-badge){
  background-color: rgba(244, 63, 94, 0.15);
  color: var(--color-primary);
}

.portfolio-project-title {
  @apply text-2xl font-bold mb-3 flex items-center gap-2;
  color: var(--color-heading);
  transition: color 0.22s ease;
}

.portfolio-card:hover .portfolio-project-title {
  color: var(--color-primary);
}

.portfolio-arrow-icon {
  @apply w-5 h-5 opacity-0 -translate-x-2;
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
  will-change: transform, opacity;
}

.portfolio-card:hover .portfolio-arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.portfolio-project-desc {
  @apply leading-relaxed mb-6;
  color: var(--color-text);
}

.portfolio-tags-wrapper {
  @apply flex flex-wrap gap-2;
}

.portfolio-tag-badge {
  @apply px-3 py-1 rounded-md text-xs font-medium;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
:global(html.dark .portfolio-tag-badge){
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

@keyframes portfolio-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-skeleton-image,
  .portfolio-skeleton-chip,
  .portfolio-skeleton-title,
  .portfolio-skeleton-text,
  .portfolio-skeleton-tags span {
    animation: none;
  }
}
</style>
