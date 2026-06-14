<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ImageIcon,
  Video,
  FileText,
  Heart,
  Share2,
  MessageCircle,
} from 'lucide-vue-next'
import Comments from '../components/Comments.vue'
import WeatherIcon from '@/components/WeatherIcon.vue'
import { getMomentById } from '@/api/diary'
import { getLikeStatus, likeDiary } from '@/api/comment'
import type { DiaryMoment } from '@/types/content'
import { parseMediaList } from '@/utils/media'
import { lockBodyScroll, unlockBodyScroll } from '@/utils/body-scroll-lock'
import { MdPreview } from 'md-editor-v3'
import VueEasyLightbox from 'vue-easy-lightbox'
import 'md-editor-v3/lib/style.css'

const route = useRoute()
const router = useRouter()
const colorMode = useColorMode()
const momentId = Number(route.params.id)
const moment = ref<DiaryMoment | null>(null)
const isLoading = ref(true)
const isDiaryLiked = ref(false)
const actionMessage = ref('')
const backButtonAnchor = ref<HTMLElement | null>(null)
const showFloatingBack = ref(false)
const previewId = `diary-preview-${momentId}`
const diaryContent = computed(() => moment.value?.longContent || moment.value?.content || '')
const diaryImages = computed(() => parseMediaList(moment.value?.media).slice(0, 9))
const previewVisible = ref(false)
const previewIndex = ref(0)
const imageGridClass = computed(() => {
  const count = diaryImages.value.length
  if (count === 1) return 'dd-media-grid-single'
  if (count <= 3) return 'dd-media-grid-row'
  if (count === 4) return 'dd-media-grid-four'
  if (count <= 6) return 'dd-media-grid-six'
  return 'dd-media-grid-nine'
})

onMounted(async () => {
  isLoading.value = true
  try {
    moment.value = await getMomentById(momentId)
    const likeStatus = await getLikeStatus('diary', momentId)
    isDiaryLiked.value = likeStatus.liked
  } finally {
    isLoading.value = false
    requestAnimationFrame(setupFloatingBackButton)
  }
})

onUnmounted(() => {
  backButtonObserver?.disconnect()
  unlockBodyScroll()
})

const getTypeIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Video
  return FileText
}

const goBack = () => {
  router.push('/diary')
}

const openImagePreview = (index: number) => {
  previewIndex.value = index
  lockBodyScroll()
  previewVisible.value = true
}

const closeImagePreview = () => {
  previewVisible.value = false
  window.setTimeout(unlockBodyScroll, 300)
}

let backButtonObserver: IntersectionObserver | undefined

const setupFloatingBackButton = () => {
  backButtonObserver?.disconnect()
  backButtonObserver = undefined
  showFloatingBack.value = false

  if (!backButtonAnchor.value) return

  backButtonObserver = new IntersectionObserver(
    ([entry]) => {
      showFloatingBack.value = !entry.isIntersecting
    },
    { threshold: 0 },
  )
  backButtonObserver.observe(backButtonAnchor.value)
}

const toggleDiaryLike = async () => {
  if (!moment.value) return
  try {
    const res = await likeDiary(moment.value.id)
    moment.value.likes = res.likes
    isDiaryLiked.value = res.liked
    actionMessage.value = ''
  } catch (error) {
    actionMessage.value = error instanceof Error ? error.message : '点赞失败'
  }
}

const syncCommentCount = (count: number) => {
  if (moment.value) {
    moment.value.comments = count
  }
}
</script>


<template>
  <div>

    <div v-if="isLoading" class="dd-page-container" aria-live="polite" aria-busy="true">
      <div class="dd-top-bar">
        <div class="dd-loading-back"></div>
        <div class="dd-loading-type"></div>
      </div>
      <article class="dd-article-card dd-loading-card">
        <header class="dd-meta-header">
          <span class="dd-loading-meta"></span>
          <span class="dd-loading-meta dd-loading-meta-short"></span>
        </header>
        <div class="dd-loading-media"></div>
        <div class="dd-content-section pt-8">
          <span class="dd-loading-quote"></span>
          <span class="dd-loading-line"></span>
          <span class="dd-loading-line"></span>
          <span class="dd-loading-line dd-loading-line-short"></span>
        </div>
        <footer class="dd-interaction-footer">
          <span class="dd-loading-action"></span>
          <span class="dd-loading-action dd-loading-action-small"></span>
        </footer>
      </article>
    </div>
  
    <div class="dd-page-container" v-else-if="moment">
      <!-- Top Action Bar -->
      <div
        ref="backButtonAnchor"
        class="dd-top-bar"
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
      >
        <button @click="goBack" class="dd-back-btn group">
          <span class="dd-back-icon-wrap">
            <ArrowLeft class="dd-back-icon" />
          </span>
          <span class="text-sm font-medium">返回碎片</span>
        </button>
  
        <div class="dd-type-badge dd-type-badge-top">
          <component :is="getTypeIcon(moment.type)" class="w-4 h-4" />
          <span class="uppercase text-xs font-bold tracking-wider">{{ moment.type }}</span>
        </div>
      </div>

      <Transition name="floating-back">
        <button
          v-if="showFloatingBack"
          type="button"
          class="dd-floating-back-btn"
          aria-label="返回碎片"
          @click="goBack"
        >
          <ArrowLeft class="dd-floating-back-icon" />
        </button>
      </Transition>
  
      <!-- Main Content Card -->
      <article
        class="dd-article-card"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
      >
        <!-- Meta Header -->
        <header class="dd-meta-header">
          <div class="dd-meta-item">
            <Calendar class="w-4 h-4 text-rose-500" />
            <span class="font-medium dd-meta-text">{{ moment.date }}1111111111</span>
          </div>
          <div class="flex items-center gap-4 dd-meta-text">
            <div class="dd-meta-item">
              <WeatherIcon :weather="moment.weather" class="dd-weather-icon" />
              <span>{{ moment.weather || '未知' }}</span>
            </div>
            <div class="dd-meta-item dd-meta-location">
              <MapPin class="w-3.5 h-3.5" />
              <span class="text-sm">{{ moment.location || '未知' }}</span>
            </div>
          </div>
        </header>
  
        <!-- Media Section -->
        <div v-if="moment.type === 'image' && diaryImages.length" class="dd-media-section">
          <div class="dd-media-grid" :class="imageGridClass">
            <button
              v-for="(image, index) in diaryImages"
              :key="`${image}-${index}`"
              type="button"
              class="dd-media-image-button interactive-media"
              :aria-label="`预览日记图片 ${index + 1}`"
              @click="openImagePreview(index)"
            >
              <img :src="image" alt="Diary cover" class="dd-media-img" />
            </button>
          </div>
        </div>
  
        <div v-else-if="moment.type === 'video' && moment.media" class="dd-media-section">
          <video :src="moment.media" :poster="moment.poster" controls class="dd-media-video"></video>
        </div>
  
        <!-- Text Content -->
        <div
          class="dd-content-section"
          :class="{ 'pt-8 md:pt-12': !moment.media, 'pt-8': moment.media }"
        >
          <MdPreview
            :editorId="previewId"
            :modelValue="diaryContent"
            :theme="colorMode === 'dark' ? 'dark' : 'light'"
          />
        </div>
  
        <!-- Interaction Footer -->
        <footer class="dd-interaction-footer">
          <div class="flex items-center gap-6">
            <button class="dd-like-btn" :class="{ 'is-liked': isDiaryLiked }" @click="toggleDiaryLike">
              <Heart class="w-5 h-5" :class="{ 'fill-rose-500 text-rose-500': isDiaryLiked }" />
              <span>{{ moment.likes }}</span>
            </button>
            <button class="dd-action-btn group">
              <MessageCircle
                class="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors"
              />
              <span class="group-hover:text-blue-600 transition-colors">{{ moment.comments }}</span>
            </button>
          </div>
          <button class="dd-action-btn hover:text-slate-900 transition-colors">
            <Share2 class="w-5 h-5" />
          </button>
        </footer>
        <p v-if="actionMessage" class="dd-action-message">{{ actionMessage }}</p>
  
        <!-- Comments Module -->
        <div class="px-6 md:px-10 pb-10">
          <Comments target-type="diary" :target-id="moment.id" @comment-change="syncCommentCount" />
        </div>
      </article>
    </div>
  
    <!-- 404 Fallback -->
    <div v-else-if="`${null}`" class="dd-page-container dd-empty-state" aria-live="polite">
      <p class="dd-empty-title">暂无日记详情</p>
    </div>

    <VueEasyLightbox
      :visible="previewVisible"
      :imgs="diaryImages"
      :index="previewIndex"
      :scroll-disabled="false"
      @hide="closeImagePreview"
    />
  </div>
</template>

<style scoped lang="scss">
.dd-page-container {
  @apply mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28;
  max-width: 1120px;
}

@media (min-width: 2561px) {
  .dd-page-container {
    max-width: 1240px;
    padding-top: 8rem;
    padding-bottom: 7rem;
  }
}

@media (min-width: 3840px) {
  .dd-page-container {
    max-width: 1320px;
  }
}

.dd-top-bar {
  @apply flex justify-between items-center mb-8;
  padding-inline: 0.125rem;
}

.dd-loading-back,
.dd-loading-type,
.dd-loading-meta,
.dd-loading-media,
.dd-loading-quote,
.dd-loading-line,
.dd-loading-action {
  display: block;
  border-radius: 9999px;
  animation: dd-skeleton-shimmer 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
}

.dd-loading-back {
  width: 8rem;
  height: 2.5rem;
}

.dd-loading-type {
  width: 5.75rem;
  height: 2rem;
}

.dd-loading-card {
  pointer-events: none;
}

.dd-loading-meta {
  width: 9rem;
  height: 1rem;
}

.dd-loading-meta-short {
  width: 13rem;
}

.dd-loading-media {
  width: 100%;
  height: clamp(14rem, 34vw, 26rem);
  border-radius: 0;
}

.dd-loading-quote {
  width: min(38rem, 82%);
  height: 2rem;
  margin-bottom: 2rem;
}

.dd-loading-line {
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
}

.dd-loading-line-short {
  width: 68%;
}

.dd-loading-action {
  width: 7rem;
  height: 2.25rem;
}

.dd-loading-action-small {
  width: 2.25rem;
}

.dd-back-btn {
  @apply flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full shadow-sm transition-colors;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.dd-back-icon-wrap {
  @apply w-6 h-6 rounded-full flex items-center justify-center;
  background-color: var(--color-border);
  transition:
    background-color 220ms ease,
    box-shadow 220ms ease;
}
.dd-back-icon {
  width: 1rem;
  height: 1rem;
  transform: translateX(0);
  transition:
    transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    color 220ms ease;
  will-change: transform;
}
.dd-back-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-secondary);
}
.dd-back-btn:hover .dd-back-icon-wrap {
  background-color: rgba(244, 63, 94, 0.12);
  box-shadow: inset 0 0 0 1px rgba(244, 63, 94, 0.1);
}
.dd-back-btn:hover .dd-back-icon {
  transform: translateX(-0.1875rem);
}
:global(html.dark .dd-back-btn){
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}
:global(html.dark .dd-back-icon-wrap){
  background-color: rgba(255, 255, 255, 0.1);
}
:global(html.dark .dd-back-btn:hover){
  color: var(--color-primary);
  background-color: rgba(255, 255, 255, 0.08);
}
:global(html.dark .dd-back-btn:hover .dd-back-icon-wrap){
  background-color: rgba(244, 63, 94, 0.16);
  box-shadow: inset 0 0 0 1px rgba(244, 63, 94, 0.16);
}

.dd-floating-back-btn {
  position: fixed;
  left: max(1.25rem, calc((100vw - 1240px) / 2 - 5rem));
  top: 34vh;
  z-index: 80;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-heading);
  box-shadow: 0 18px 38px -26px rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: pointer;
  transition:
    transform 220ms ease,
    color 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    box-shadow 220ms ease;
}

.dd-floating-back-btn:hover {
  transform: translateX(-0.1875rem);
  color: var(--color-primary);
  border-color: rgba(244, 63, 94, 0.22);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 22px 42px -28px rgba(244, 63, 94, 0.45);
}

.dd-floating-back-icon {
  width: 1.2rem;
  height: 1.2rem;
}

:global(html.dark .dd-floating-back-btn) {
  background: rgba(15, 23, 42, 0.68);
  border-color: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

:global(html.dark .dd-floating-back-btn:hover) {
  background: rgba(30, 41, 59, 0.86);
  border-color: rgba(244, 63, 94, 0.24);
  color: var(--color-primary);
}

.floating-back-enter-active,
.floating-back-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms ease;
}

.floating-back-enter-from,
.floating-back-leave-to {
  opacity: 0;
  transform: translateX(-0.5rem);
}

.dd-type-badge {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm;
  background-color: var(--color-background);
  color: var(--color-text);
  border-color: var(--color-border);
}
:global(html.dark .dd-type-badge){
  background-color: rgba(244, 63, 94, 0.15);
  color: var(--color-primary);
  border: none;
}

.dd-type-badge-top {
  /* Inherits from dd-type-badge but specific to top bar */
}
:global(html.dark .dd-type-badge-top){
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.dd-article-card {
  @apply overflow-hidden relative;
  border-radius: 1rem;
  background-color: var(--color-card);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(226, 232, 240, 0.78);
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.72) inset;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 1.75rem;
    right: 1.75rem;
    z-index: 2;
    height: 2px;
    border-radius: 9999px;
    background: linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.52), transparent);
    opacity: 0.78;
  }
}
:global(html.dark .dd-article-card){
  background-color: #162032;
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.dd-meta-header {
  @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 md:px-8 border-b;
  background: rgba(255, 255, 255, 0.36);
  border-color: rgba(226, 232, 240, 0.72);
}
:global(html.dark .dd-meta-header){
  border-bottom-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.025);
}

.dd-meta-item {
  @apply flex items-center gap-2 text-sm;
  color: var(--color-text);
}

.dd-weather-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-primary);
}

.dd-meta-text {
  color: var(--color-text);
}
:global(html.dark .dd-meta-text){
  color: #cbd5e1; /* slate-300 */
}

.dd-meta-location {
  @apply px-3 py-1 rounded-full;
  background-color: var(--color-background);
}
:global(html.dark .dd-meta-location){
  background-color: rgba(255, 255, 255, 0.05);
}

.dd-media-section {
  @apply w-full relative;
  background-color: var(--color-background);
  overflow: hidden;
  border-bottom: 1px solid rgba(226, 232, 240, 0.62);
}

.dd-media-grid {
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;
}

.dd-media-grid-single {
  display: block;
  padding: 0;
}

.dd-media-grid-row {
  grid-template-columns: repeat(var(--diary-image-count, 3), minmax(0, 1fr));
}

.dd-media-grid-row:has(.dd-media-image-button:nth-child(2):last-child) {
  --diary-image-count: 2;
}

.dd-media-grid-row:has(.dd-media-image-button:nth-child(3):last-child) {
  --diary-image-count: 3;
}

.dd-media-grid-four {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dd-media-grid-six,
.dd-media-grid-nine {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.dd-media-image-button {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 0;
  border-radius: 0.85rem;
  background: transparent;
  padding: 0;
  cursor: zoom-in;
}

.dd-media-grid-single .dd-media-image-button {
  border-radius: 0;
}

.dd-media-grid:not(.dd-media-grid-single) .dd-media-image-button {
  aspect-ratio: 1 / 1;
}

.dd-media-img {
  @apply w-full object-cover object-center;
  display: block;
  height: 100%;
  max-height: min(52vh, 560px);
  transition: transform 0.5s ease;
  will-change: transform;
}

.dd-media-grid-single .dd-media-img {
  height: auto;
}

.dd-media-video {
  @apply w-full bg-black object-cover;
  display: block;
  height: min(52vh, 560px);
}

// .dd-article-card .dd-media-img:hover {
//   transform: none;
// }

.dd-media-section .dd-media-img:hover {
  transform: scale(1.045);
}

.dd-content-section {
  @apply px-6 md:px-10 pb-8;
  background:
    radial-gradient(circle at 0 0, rgba(244, 63, 94, 0.055), transparent 16rem),
    linear-gradient(180deg, rgba(255, 241, 242, 0.48), rgba(255, 255, 255, 0.22) 14rem, transparent);
}

:deep(.md-editor),
:deep(.md-editor-preview-wrapper),
:deep(.md-editor-preview) {
  background: transparent;
  background-color: transparent;
  box-shadow: none;
  border: 0;
}

:deep(.md-editor-preview) {
  color: var(--color-text);
  line-height: 1.85;
  font-size: 1rem;
  max-width: none;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}

:deep(.md-editor-preview p) {
  margin: 0.9em 0;
}

:deep(.md-editor-preview ul),
:deep(.md-editor-preview ol) {
  padding-left: 1.35rem;
}

:deep(.md-editor-preview code) {
  border-radius: 0.45rem;
  background: rgba(244, 63, 94, 0.08);
  color: var(--color-primary);
}

:deep(.md-editor-preview pre code) {
  color: inherit;
  background: transparent;
}

:deep(.md-editor-preview a) {
  color: var(--color-primary);
}

:deep(.md-editor-preview blockquote) {
  border-left: 2px solid rgba(244, 63, 94, 0.52);
  color: var(--color-heading);
  background: rgba(244, 63, 94, 0.055);
  border-radius: 0 0.85rem 0.85rem 0;
}

:global(html.dark .dd-content-section .md-editor-preview),
:global(html.dark .dd-content-section .md-editor-preview p),
:global(html.dark .dd-content-section .md-editor-preview li),
:global(html.dark .dd-content-section .md-editor-preview span) {
  color: #cbd5e1;
}

:global(html.dark .dd-content-section) {
  background:
    radial-gradient(circle at 0 0, rgba(244, 63, 94, 0.12), transparent 16rem),
    linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.28) 14rem, transparent);
}

:global(html.dark .dd-content-section .md-editor-preview) {
  background: transparent;
  background-color: transparent;
  border: 0;
  box-shadow: none;
}

:global(html.dark .dd-content-section .md-editor),
:global(html.dark .dd-content-section .md-editor-preview-wrapper) {
  background: transparent;
  background-color: transparent;
  border: 0;
  box-shadow: none;
}

:global(html.dark .dd-content-section .md-editor-preview h1),
:global(html.dark .dd-content-section .md-editor-preview h2),
:global(html.dark .dd-content-section .md-editor-preview h3),
:global(html.dark .dd-content-section .md-editor-preview h4),
:global(html.dark .dd-content-section .md-editor-preview h5),
:global(html.dark .dd-content-section .md-editor-preview h6) {
  color: #f1f5f9;
}

.dd-interaction-footer {
  @apply flex items-center justify-between px-6 md:px-10 py-5 border-t;
  background: rgba(255, 255, 255, 0.24);
  border-color: rgba(226, 232, 240, 0.72);
}
:global(html.dark .dd-interaction-footer){
  background: rgba(255, 255, 255, 0.025);
  border-color: rgba(255, 255, 255, 0.08);
}

.dd-action-btn {
  @apply flex items-center gap-2 text-sm transition-colors;
  color: var(--color-text);
  &:hover {
    color: var(--color-primary);
  }
}

.dd-action-message {
  @apply px-6 md:px-10 pt-4 text-sm;
  color: var(--color-primary);
}

.dd-like-btn {
  @apply flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);

  &:hover {
    background-color: var(--color-secondary);
    color: var(--color-primary);
    border-color: var(--color-secondary);
  }

  &.is-liked {
    background-color: var(--color-secondary);
    color: var(--color-primary);
    border-color: var(--color-secondary);
  }
}

@media (max-width: 767px) {
  .dd-back-btn {
    min-height: 44px;
  }

  .dd-floating-back-btn {
    display: none;
  }

  .dd-interaction-footer {
    padding: 1rem;
  }

  .dd-interaction-footer > div {
    gap: 0.75rem;
  }

  .dd-like-btn,
  .dd-action-btn {
    min-height: 44px;
  }

  .dd-action-btn {
    min-width: 44px;
    justify-content: center;
    padding-inline: 0.75rem;
    border-radius: 9999px;
  }
}

@keyframes dd-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

.dd-empty-state {
  position: relative;
  min-height: clamp(18rem, 80vh, 30rem);
  // min-height: clamp(12rem, 28vh, 18rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  isolation: isolate;
  padding-top: 35vh;
}

.dd-empty-state::before {
  content: '';
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 10%;
  top: 45%;
  z-index: -1;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 38% 45%, rgba(244, 63, 94, 0.1), transparent 36%),
    radial-gradient(circle at 62% 46%, rgba(147, 197, 253, 0.16), transparent 34%);
  filter: blur(28px);
  opacity: 0.75;
}

.dd-empty-state::after {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 1rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.38;
}

.dd-empty-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-heading);
}

.dd-empty-desc {
  margin: 0.625rem 0 0;
  font-size: 0.9375rem;
  color: var(--color-text);
}

:global(html.dark .dd-empty-title) {
  color: #e2e8f0;
}

:global(html.dark .dd-empty-desc) {
  color: #94a3b8;
}


:global(html.dark .dd-empty-state::before){
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .dd-loading-back,
  .dd-loading-type,
  .dd-loading-meta,
  .dd-loading-media,
  .dd-loading-quote,
  .dd-loading-line,
  .dd-loading-action {
    background-color: transparent;
    animation: none;
  }
}
</style>
