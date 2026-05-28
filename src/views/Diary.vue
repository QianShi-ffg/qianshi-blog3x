<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { MapPin, Calendar, ImageIcon, Video, FileText } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { listMoments } from '@/api/diary'
import type { DiaryMomentSummary } from '@/types/content'
import { registerRouteTransitionCleanup } from '@/utils/route-transition-cleanup'

const moments = ref<DiaryMomentSummary[]>([])
const isMomentsLoading = ref(true)
const diaryRoot = ref<HTMLElement | null>(null)
let headerParallaxCtx: gsap.Context | undefined
let unregisterTransitionCleanup: (() => void) | undefined

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const setupHeaderParallax = () => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()

  if (!diaryRoot.value || prefersReducedMotion()) return

  headerParallaxCtx = gsap.context(() => {
    const header = diaryRoot.value?.querySelector<HTMLElement>('.diary-header-wrapper')
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
  }, diaryRoot.value)

  unregisterTransitionCleanup = registerRouteTransitionCleanup(() => {
    headerParallaxCtx?.revert()
    headerParallaxCtx = undefined
    unregisterTransitionCleanup = undefined
  })

  ScrollTrigger.refresh()
}

onMounted(async () => {
  isMomentsLoading.value = true
  try {
    moments.value = await listMoments()
  } finally {
    isMomentsLoading.value = false
    setupHeaderParallax()
  }
})

onUnmounted(() => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()
})

const getTypeIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Video
  return FileText
}
</script>

<template>
  <div ref="diaryRoot" class="diary-page-container">
    <!-- Header -->
    <div class="diary-header-wrapper">
      <div>
        <h1
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="diary-title"
        >
          生活碎片
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
          class="diary-subtitle"
        >
          记录生活中的小确幸，不只是代码，还有远方。
        </p>
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
        class="diary-badge-wrap"
      >
        <div class="diary-badge-inner">
          <ImageIcon class="diary-icon-sm" />
          <span>{{ isMomentsLoading ? '--' : moments.length }} 个瞬间</span>
        </div>
      </div>
    </div>

    <!-- Masonry Layout -->
    <div v-if="isMomentsLoading" class="diary-masonry-grid" aria-live="polite" aria-busy="true">
      <div v-for="item in 6" :key="item" class="diary-masonry-item">
        <div class="diary-card diary-card-skeleton">
          <span class="diary-skeleton-badge"></span>
          <div class="diary-skeleton-media" :class="{ 'diary-skeleton-media-tall': item % 3 === 0 }"></div>
          <div class="diary-content-wrap">
            <span class="diary-skeleton-line"></span>
            <span class="diary-skeleton-line"></span>
            <span class="diary-skeleton-line diary-skeleton-line-short"></span>
            <div class="diary-skeleton-meta">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="diary-masonry-grid">
      <div
        v-for="(moment, index) in moments"
        :key="moment.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 100 } }"
        class="diary-masonry-item"
      >
        <router-link :to="`/diary/${moment.id}`" class="block cursor-pointer">
          <div class="diary-card interactive-card group">

              <!-- Type Badge -->
            <div class="diary-type-badge">
               <component :is="getTypeIcon(moment.type)" class="diary-icon-sm" />
            </div>

            <!-- Media Section -->
            <div v-if="moment.type === 'image' && moment.media" class="diary-media-wrap interactive-media">
              <img
                :src="moment.media"
                alt="Moment"
                class="diary-media-img"
              />
              <div class="diary-media-overlay"></div>
            </div>

            <div v-else-if="moment.type === 'video' && moment.media" class="diary-video-wrap interactive-media group">
              <video
                :src="moment.media"
                :poster="moment.poster"
                controls
                preload="metadata"
                class="diary-video-element"
              ></video>
            </div>

            <!-- Text Content -->
            <div class="diary-content-wrap" :class="{ 'diary-content-bg-text': moment.type === 'text' }">
              <p class="diary-text-content" :class="{ 'diary-text-lg': moment.type === 'text', 'diary-text-md': moment.type !== 'text' }">
                {{ moment.content }}
              </p>

              <!-- Meta -->
              <div class="diary-meta-footer">
                <div class="diary-meta-left">
                  <span class="diary-meta-date">
                    <Calendar class="diary-icon-xs" />
                    {{ moment.date }}
                  </span>
                  <span class="diary-meta-weather">
                    {{ moment.weather }}
                  </span>
                </div>
                <span class="diary-meta-location">
                  <MapPin class="diary-icon-xxs" />
                  {{ moment.location }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-page-container {
  @apply min-h-[80vh] py-12 lg:py-20 lg:pt-32 pt-24 px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 mx-auto max-w-screen-2xl;
}

.diary-header-wrapper {
  @apply mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8;
  will-change: transform;
}

.diary-title {
  @apply text-4xl md:text-5xl font-bold tracking-tight mb-4;
  color: var(--color-heading);
}
:global(html.dark .diary-title){
  color: #e2e8f0;
}

.diary-subtitle {
  @apply text-lg max-w-2xl;
  color: var(--color-text);
}

.diary-badge-wrap {
  @apply flex gap-3;
}

.diary-badge-inner {
  @apply flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium;
  background-color: var(--color-secondary);
  color: var(--color-primary);
}
:global(html.dark .diary-badge-inner){
  background-color: rgba(244, 63, 94, 0.15);
  color: var(--color-primary);
}

.diary-icon-sm {
  @apply w-4 h-4;
}

.diary-masonry-grid {
  @apply columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8;
}

.diary-masonry-item {
  @apply break-inside-avoid mb-6 lg:mb-8;
}

.diary-card {
  @apply rounded-3xl overflow-hidden relative;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
}
:global(html.dark .diary-card){
  background-color: rgba(218, 223, 230, 0.05); /* Match the visual of the second image card background slightly */
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
  border-color: rgba(255, 255, 255, 0.08);
}

.diary-card-skeleton {
  pointer-events: none;
}

.diary-skeleton-badge,
.diary-skeleton-media,
.diary-skeleton-line,
.diary-skeleton-meta span {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: diary-skeleton-shimmer 1.5s ease-in-out infinite;
}

.diary-skeleton-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: 2.25rem;
  height: 2.25rem;
}

.diary-skeleton-media {
  height: 13.5rem;
  border-radius: 0;
}

.diary-skeleton-media-tall {
  height: 18rem;
}

.diary-skeleton-line {
  width: 100%;
  height: 0.875rem;
  margin-bottom: 0.75rem;
}

.diary-skeleton-line-short {
  width: 62%;
  margin-bottom: 1.25rem;
}

.diary-skeleton-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.diary-skeleton-meta span {
  width: 6rem;
  height: 0.75rem;
}

.diary-type-badge {
  @apply absolute top-4 right-4 z-20 p-2 rounded-full shadow-sm;
  background-color: var(--color-background);
  color: var(--color-text);
  opacity: 0.8;
  backdrop-filter: blur(8px);
}
:global(html.dark .diary-type-badge){
  background-color: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  opacity: 1;
}

.diary-media-wrap {
  @apply relative overflow-hidden;
}

.diary-media-img {
  @apply w-full h-auto object-cover;
}

.diary-media-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

.diary-video-wrap {
  @apply relative overflow-hidden aspect-video;
  background-color: var(--color-background);
}

.diary-video-element {
  @apply w-full h-full object-cover;
}

.diary-content-wrap {
  @apply p-6 md:p-8;
}

.diary-content-bg-text {
  background-color: rgba(244, 63, 94, 0.05); /* bg-rose-50/30 equivalent */
}

.diary-text-content {
  @apply leading-relaxed mb-6;
  color: var(--color-text);
}

.diary-text-lg {
  @apply text-xl font-medium;
  color: var(--color-heading);
}

.diary-text-md {
  @apply text-base;
}

.diary-meta-footer {
  @apply flex flex-wrap items-center justify-between gap-4 pt-4 border-t text-xs font-medium;
  color: var(--color-text);
  border-color: var(--color-border);
}

.diary-meta-left {
  @apply flex items-center gap-4;
}

.diary-meta-date {
  @apply flex items-center gap-1 transition-colors;
}
.diary-meta-date:hover {
  color: var(--color-primary);
}

.diary-icon-xs {
  @apply w-3.5 h-3.5;
}

.diary-meta-weather {
  @apply flex items-center gap-1;
}

.diary-meta-location {
  @apply flex items-center gap-1 px-2 py-1 rounded-md;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
:global(html.dark .diary-meta-location){
  background-color: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  border: none;
}
:global(html.dark .diary-meta-footer){
  border-top-color: rgba(255, 255, 255, 0.1);
}

.diary-icon-xxs {
  @apply w-3 h-3;
}

@keyframes diary-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .diary-skeleton-badge,
  .diary-skeleton-media,
  .diary-skeleton-line,
  .diary-skeleton-meta span {
    animation: none;
  }
}
</style>
