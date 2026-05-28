<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import { getMomentById } from '@/api/diary'
import type { DiaryMoment } from '@/types/content'

const route = useRoute()
const router = useRouter()
const momentId = Number(route.params.id)
const moment = ref<DiaryMoment | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    moment.value = await getMomentById(momentId)
  } finally {
    isLoading.value = false
  }
})

const getTypeIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Video
  return FileText
}

const goBack = () => {
  router.push('/diary')
}
</script>


<template>
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
          <span class="font-medium dd-meta-text">{{ moment.date }}</span>
        </div>
        <div class="flex items-center gap-4 dd-meta-text">
          <div class="dd-meta-item">
            <span>{{ moment.weather }}</span>
          </div>
          <div class="dd-meta-item dd-meta-location">
            <MapPin class="w-3.5 h-3.5" />
            <span class="text-sm">{{ moment.location }}</span>
          </div>
        </div>
      </header>

      <!-- Media Section -->
      <div v-if="moment.type === 'image' && moment.media" class="dd-media-section interactive-media">
        <img :src="moment.media" alt="Diary cover" class="dd-media-img" />
      </div>

      <div v-else-if="moment.type === 'video' && moment.media" class="dd-media-section">
        <video :src="moment.media" :poster="moment.poster" controls class="dd-media-video"></video>
      </div>

      <!-- Text Content -->
      <div
        class="dd-content-section"
        :class="{ 'pt-8 md:pt-12': !moment.media, 'pt-8': moment.media }"
      >
        <!-- Quote style for short content -->
        <blockquote class="dd-quote">
          {{ moment.content }}
        </blockquote>

        <!-- Detailed Long Content -->
        <div class="dd-long-content">
          <p v-for="(paragraph, index) in moment.longContent.split('\n\n')" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- Interaction Footer -->
      <footer class="dd-interaction-footer">
        <div class="flex items-center gap-6">
          <button class="dd-like-btn">
            <Heart class="w-5 h-5" />
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

      <!-- Comments Module -->
      <div class="px-6 md:px-10 pb-10">
        <Comments />
      </div>
    </article>
  </div>

  <!-- 404 Fallback -->
  <div v-else class="min-h-screen flex flex-col items-center justify-center py-32">
    <h2 class="text-2xl font-bold text-slate-800 mb-4">找不到该日记</h2>
    <button
      @click="goBack"
      class="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
    >
      返回列表
    </button>
  </div>
</template>

<style scoped lang="scss">
.dd-page-container {
  @apply mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28;
  max-width: 1120px;
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
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: dd-skeleton-shimmer 1.5s ease-in-out infinite;
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
  @apply rounded-[1.5rem] overflow-hidden relative;
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

.dd-media-img {
  @apply w-full h-auto object-cover object-center;
  max-height: min(52vh, 560px);
  transition: transform 0.7s ease;
  will-change: transform;
}

.dd-media-video {
  @apply w-full bg-black object-cover;
  display: block;
  height: min(52vh, 560px);
}

.dd-article-card:hover .dd-media-img {
  transform: none;
}

.dd-media-section:hover .dd-media-img {
  transform: scale(1.045);
}

.dd-content-section {
  @apply px-6 md:px-10 pb-8;
  background:
    radial-gradient(circle at 0 0, rgba(244, 63, 94, 0.055), transparent 16rem),
    linear-gradient(180deg, rgba(255, 241, 242, 0.48), rgba(255, 255, 255, 0.22) 14rem, transparent);
}

.dd-quote {
  @apply text-lg md:text-xl font-semibold leading-relaxed mb-8 pl-5 relative;
  color: var(--color-heading);
  max-width: 56rem;
  border-left: 2px solid rgba(244, 63, 94, 0.52);

  &::before {
    content: '';
    position: absolute;
    left: -0.125rem;
    top: 0.35rem;
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    box-shadow: 0 0 0 0.375rem rgba(244, 63, 94, 0.1);
    background-color: var(--color-primary);
  }

  &::after {
    content: '"';
    position: absolute;
    left: 0.875rem;
    top: -0.8rem;
    font-family: Georgia, serif;
    font-size: 2.75rem;
    line-height: 1;
    opacity: 0.12;
    color: var(--color-primary);
  }
}
:global(html.dark .dd-quote){
  color: #e2e8f0;
}

.dd-long-content {
  @apply space-y-5 text-base leading-relaxed;
  color: var(--color-text);
  max-width: 58rem;
}
:global(html.dark .dd-long-content){
  color: #94a3b8;
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
}

@keyframes dd-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dd-loading-back,
  .dd-loading-type,
  .dd-loading-meta,
  .dd-loading-media,
  .dd-loading-quote,
  .dd-loading-line,
  .dd-loading-action {
    animation: none;
  }
}
</style>
