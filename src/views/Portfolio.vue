<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { listProjects } from '@/api/portfolio'
import type { Project } from '@/types/content'
import { registerRouteTransitionCleanup } from '@/utils/route-transition-cleanup'
import AppPagination from '@/components/AppPagination.vue'
import defaultProjectCover from '@/assets/img/thumb.png'

const projects = ref<Project[]>([])
const isProjectsLoading = ref(true)
const hasCheckedProjects = ref(false)
const portfolioRoot = ref<HTMLElement | null>(null)
const activeProjectType = ref<'personal' | 'participated'>('personal')
const currentPage = ref(1)
const pageSize = ref(4)
let hoverCtx: gsap.Context | undefined
let headerParallaxCtx: gsap.Context | undefined
let unregisterTransitionCleanup: (() => void) | undefined
let hoverCleanups: Array<() => void> = []
let largeScreenQuery: MediaQueryList | undefined

const projectTypeTabs = [
  { label: '个人作品', value: 'personal' },
  { label: '参与负责作品', value: 'participated' },
] as const

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const normalizeProjectType = (project: Project) => project.projectType === 'participated' ? 'participated' : 'personal'

const filteredProjects = computed(() => projects.value.filter((project) => normalizeProjectType(project) === activeProjectType.value))
const selectedProjectTypeLabel = computed(() => projectTypeTabs.find((tab) => tab.value === activeProjectType.value)?.label || '作品')
const projectTypeCount = (type: 'personal' | 'participated') =>
  projects.value.filter((project) => normalizeProjectType(project) === type).length
const totalPages = computed(() => Math.max(1, Math.ceil(filteredProjects.value.length / pageSize.value)))
const pagedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredProjects.value.slice(start, start + pageSize.value)
})
const showPagination = computed(() => filteredProjects.value.length > pageSize.value)

const syncPageSize = () => {
  pageSize.value = largeScreenQuery?.matches ? 6 : 4
}

const clampCurrentPage = () => {
  currentPage.value = Math.min(Math.max(1, currentPage.value), totalPages.value)
}

const scrollToPageTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto',
  })
}

const changePage = async (page: number) => {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
  scrollToPageTop()
  await nextTick()
  setupPortfolioHover()
  ScrollTrigger.refresh()
}

const hasProjectLink = (value?: string) => Boolean(value?.trim())
const hasProjectActions = (project: Project) => hasProjectLink(project.github) || hasProjectLink(project.demo)
const getProjectCover = (project: Project) => project.image?.trim() || defaultProjectCover
const getProjectCategory = (project: Project) => project.category?.trim() || '暂无'
const handleProjectCoverError = (event: Event) => {
  const image = event.target as HTMLImageElement | null
  if (!image || image.dataset.fallbackApplied) return
  image.dataset.fallbackApplied = 'true'
  image.src = defaultProjectCover
}

const setupPortfolioHover = () => {
  hoverCleanups.forEach((cleanup) => cleanup())
  hoverCleanups = []
  hoverCtx?.revert()

  if (!portfolioRoot.value || prefersReducedMotion()) return

  hoverCtx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.portfolio-card:not(.portfolio-card-skeleton)')

    cards.forEach((card) => {
      const overlay = card.querySelector<HTMLElement>('.portfolio-overlay')
      const actions = card.querySelectorAll<HTMLElement>('.portfolio-action-btn')
      const title = card.querySelector<HTMLElement>('.portfolio-project-title')
      const arrow = card.querySelector<HTMLElement>('.portfolio-arrow-icon')

      const enter = () => {
        gsap.to(card, {
          filter: 'drop-shadow(0 18px 30px rgba(244, 63, 94, 0.12))',
          duration: 0.28,
          ease: 'none',
          overwrite: true,
        })
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
          duration: 0.28,
          ease: 'none',
          overwrite: true,
        })
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
  largeScreenQuery = window.matchMedia('(min-width: 3840px)')
  syncPageSize()
  largeScreenQuery.addEventListener('change', syncPageSize)

  isProjectsLoading.value = true
  try {
    projects.value = await listProjects()
    hasCheckedProjects.value = true
  } finally {
    isProjectsLoading.value = false
    await nextTick()
    setupPortfolioHover()
    setupHeaderParallax()
  }
})

watch(activeProjectType, async () => {
  currentPage.value = 1
  await nextTick()
  setupPortfolioHover()
  ScrollTrigger.refresh()
})

watch([filteredProjects, pageSize], async () => {
  clampCurrentPage()
  await nextTick()
  setupPortfolioHover()
  ScrollTrigger.refresh()
})

onBeforeUnmount(() => {
  hoverCleanups.forEach((cleanup) => cleanup())
  hoverCleanups = []
  hoverCtx?.revert()
})

onUnmounted(() => {
  largeScreenQuery?.removeEventListener('change', syncPageSize)
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
      <div
        v-if="projects.length > 0"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 180 } }"
        class="portfolio-type-tabs"
        :class="{ 'is-participated': activeProjectType === 'participated' }"
        role="tablist"
        aria-label="作品分类"
      >
        <button
          v-for="tab in projectTypeTabs"
          :key="tab.value"
          class="portfolio-type-tab"
          :class="{ active: activeProjectType === tab.value }"
          type="button"
          role="tab"
          :aria-selected="activeProjectType === tab.value"
          @click="activeProjectType = tab.value"
        >
          <span>{{ tab.label }}</span>
          <small>{{ projectTypeCount(tab.value) }}</small>
        </button>
      </div>
    </div>

    <!-- Projects Grid -->
    <div v-if="isProjectsLoading && !hasCheckedProjects" class="portfolio-checking-state" aria-live="polite" aria-busy="true" aria-label="加载内容">
      <span class="portfolio-checking-dot"></span>
    </div>
    <div v-else-if="isProjectsLoading" class="portfolio-grid" aria-live="polite" aria-busy="true">
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
    <div v-else-if="projects.length === 0" class="portfolio-empty-state" aria-live="polite">
      <p class="portfolio-empty-title">暂无作品</p>
      <p class="portfolio-empty-desc">作品整理完成后会在这里展示。</p>
    </div>
    <div v-else-if="filteredProjects.length === 0" class="portfolio-empty-state" aria-live="polite">
      <p class="portfolio-empty-title">暂无{{ selectedProjectTypeLabel }}</p>
      <p class="portfolio-empty-desc">切换分类看看其他作品。</p>
    </div>
    <div v-else class="portfolio-grid">
      <div
        v-for="(project, index) in pagedProjects"
        :key="project.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 100 } }"
        class="portfolio-card"
      >
        <!-- Project Image -->
        <router-link :to="`/portfolio/${project.id}`" class="portfolio-image-wrapper interactive-media">
          <img
            :src="getProjectCover(project)"
            :alt="project.title"
            class="portfolio-image"
            @error="handleProjectCoverError"
          />
          <div v-if="hasProjectActions(project)" class="portfolio-overlay">
            <a v-if="hasProjectLink(project.github)" :href="project.github" target="_blank" class="portfolio-action-btn" @click.stop>
              <Github class="portfolio-icon" />
            </a>
            <a v-if="hasProjectLink(project.demo)" :href="project.demo" target="_blank" class="portfolio-action-btn" @click.stop>
              <ExternalLink class="portfolio-icon" />
            </a>
          </div>
        </router-link>

        <!-- Project Info -->
        <router-link :to="`/portfolio/${project.id}`" class="portfolio-content-link block cursor-pointer">
          <div class="portfolio-category-wrapper">
            <span class="portfolio-category-badge">
              {{ getProjectCategory(project) }}
            </span>
          </div>

          <h2 class="portfolio-project-title">
            <span class="portfolio-project-title-text">{{ project.title }}</span>
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
    <AppPagination
      v-if="showPagination"
      :current-page="currentPage"
      :total-pages="totalPages"
      aria-label="作品分页"
      @change="changePage"
    />
  </div>
</template>

<style scoped>
.portfolio-page-container {
  @apply min-h-[80vh] py-12 pt-24 px-6 mx-auto max-w-screen-2xl;
  max-width: var(--site-page-max-width);
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
    padding-left: var(--site-page-padding-wide);
    padding-right: var(--site-page-padding-wide);
  }
}

@media (min-width: 2561px) {
  .portfolio-page-container {
    padding-left: clamp(7rem, 6vw, 9rem);
    padding-right: clamp(7rem, 6vw, 9rem);
  }
}

@media (min-width: 3840px) {
  .portfolio-page-container {
    padding-left: clamp(8rem, 6vw, 12rem);
    padding-right: clamp(8rem, 6vw, 12rem);
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

.portfolio-type-tabs {
  position: relative;
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(10rem, 1fr));
  align-items: center;
  gap: 0.35rem;
  margin-top: 1.75rem;
  padding: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(248, 250, 252, 0.7);
  box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  isolation: isolate;
  overflow: hidden;
}

.portfolio-type-tabs::before {
  content: '';
  position: absolute;
  top: 0.35rem;
  bottom: 0.35rem;
  left: 0.35rem;
  z-index: -1;
  width: calc((100% - 1.05rem) / 2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow:
    0 14px 32px rgba(244, 63, 94, 0.12),
    0 8px 18px rgba(15, 23, 42, 0.05);
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.portfolio-type-tabs.is-participated::before {
  transform: translateX(calc(100% + 0.35rem));
}

.portfolio-type-tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 3rem;
  min-width: 0;
  padding: 0 1.25rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-heading);
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

.portfolio-type-tab:hover {
  color: var(--color-primary);
  transform: translateY(-1px);
}

.portfolio-type-tab.active {
  color: var(--color-primary);
}

.portfolio-type-tab small {
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: rgba(244, 63, 94, 0.1);
  color: var(--color-primary);
  font-size: 0.72rem;
  line-height: 1.35rem;
}

:global(html.dark .portfolio-type-tabs) {
  border-color: rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.46);
}

:global(html.dark .portfolio-type-tabs::before) {
  background: rgba(244, 63, 94, 0.14);
  box-shadow:
    0 14px 32px rgba(244, 63, 94, 0.14),
    0 8px 18px rgba(0, 0, 0, 0.16);
}

.portfolio-grid {
  @apply grid grid-cols-1 gap-12;
}

@media (min-width: 1024px) {
  .portfolio-grid {
    @apply grid-cols-2 gap-16;
  }
}

@media (min-width: 2561px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4rem;
  }
}

@media (min-width: 3840px) {
  .portfolio-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 3.5rem;
  }
}

.portfolio-empty-state {
  position: relative;
  min-height: clamp(12rem, 28vh, 18rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  isolation: isolate;
}

.portfolio-empty-state::before {
  content: '';
  position: absolute;
  inset: 10% 18%;
  z-index: -1;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 38% 45%, rgba(244, 63, 94, 0.1), transparent 36%),
    radial-gradient(circle at 62% 46%, rgba(147, 197, 253, 0.16), transparent 34%);
  filter: blur(28px);
  opacity: 0.75;
}

.portfolio-empty-state::after {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 1rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.38;
}

.portfolio-checking-state {
  min-height: clamp(12rem, 28vh, 18rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.portfolio-checking-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.45;
  animation: portfolio-checking-pulse 0.9s ease-in-out infinite alternate;
}

.portfolio-empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
}

.portfolio-empty-desc {
  margin: 0.5rem 0 0;
  font-size: 0.9375rem;
  color: var(--color-text);
}

:global(html.dark .portfolio-empty-title){
  color: #e2e8f0;
}

:global(html.dark .portfolio-empty-state::before){
  opacity: 0.32;
}

.portfolio-card {
  border-radius: 1rem;
  padding-bottom: 0.25rem;
  transition: filter 0.28s linear;
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
  border-radius: 1rem;
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
  @apply relative overflow-hidden aspect-[16/10];
  border-radius: 1rem;
  display: block;
  margin-bottom: 1rem;
  background-color: var(--color-card);
  background-image:
    radial-gradient(circle at 32% 28%, rgba(244, 63, 94, 0.12), transparent 32%),
    radial-gradient(circle at 72% 62%, rgba(147, 197, 253, 0.16), transparent 34%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
}

.portfolio-content-link {
  min-width: 0;
  padding: 0 20px;
}

.portfolio-image {
  @apply w-full h-full object-cover;
  transition: transform 0.28s linear;
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

@media (max-width: 767px) {
  .portfolio-type-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
    margin-top: 1.25rem;
  }

  .portfolio-type-tab {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 0 0.65rem;
    font-size: 0.84rem;
  }

  .portfolio-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .portfolio-card {
    display: grid;
    grid-template-columns: 5.75rem minmax(0, 1fr);
    gap: 0.875rem;
    padding-bottom: 0;
    border-radius: 1rem;
  }

  .portfolio-image-wrapper {
    width: 5.75rem;
    height: 5.75rem;
    margin-bottom: 0;
    border-radius: 1rem;
    aspect-ratio: auto;
  }

  .portfolio-overlay {
    display: none;
  }

  .portfolio-action-btn {
    opacity: 1;
    transform: none;
  }

  .portfolio-content-link {
    min-width: 0;
    padding: 0.35rem 0.75rem 0.35rem 0;
  }

  .portfolio-category-wrapper,
  .portfolio-tags-wrapper,
  .portfolio-arrow-icon {
    display: none;
  }

  .portfolio-project-title {
    margin-bottom: 0.35rem;
    font-size: 1rem;
    line-height: 1.4;
  }

  .portfolio-project-desc {
    -webkit-line-clamp: 2;
    line-clamp: 2;
    font-size: 0.8125rem;
  }

  .portfolio-card-skeleton {
    grid-template-columns: 5.75rem minmax(0, 1fr);
  }

  .portfolio-card-skeleton .portfolio-skeleton-chip,
  .portfolio-card-skeleton .portfolio-skeleton-tags {
    display: none;
  }
}

.portfolio-icon {
  @apply w-5 h-5;
}

.portfolio-category-wrapper {
  @apply flex items-center gap-3 mb-3;
}

.portfolio-category-badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
  background-color: var(--color-primary);
  color: #fff;
}
:global(html.dark .portfolio-category-badge){
  background-color: var(--color-primary);
  color: #fff;
}

.portfolio-project-title {
  @apply text-2xl font-bold mb-3 flex items-start gap-2;
  min-width: 0;
  color: var(--color-heading);
  transition: color 0.22s ease;
}

.portfolio-project-title-text {
  display: -webkit-box;
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.portfolio-card:hover .portfolio-project-title {
  color: var(--color-primary);
}

.portfolio-arrow-icon {
  @apply w-5 h-5 opacity-0 -translate-x-2;
  flex: 0 0 auto;
  margin-top: 0.22rem;
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
  display: -webkit-box;
  min-width: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
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

@keyframes portfolio-checking-pulse {
  0% {
    opacity: 0.28;
    transform: scale(0.78);
  }
  100% {
    opacity: 0.72;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-skeleton-image,
  .portfolio-skeleton-chip,
  .portfolio-skeleton-title,
  .portfolio-skeleton-text,
  .portfolio-skeleton-tags span,
  .portfolio-checking-dot {
    animation: none;
  }
}
</style>
