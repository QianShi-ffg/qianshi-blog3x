<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Github, ExternalLink, Calendar, User, LayoutGrid } from 'lucide-vue-next'
import { getProjectById } from '@/api/portfolio'
import type { Project } from '@/types/content'
import { lockBodyScroll, unlockBodyScroll } from '@/utils/body-scroll-lock'
import VueEasyLightbox from 'vue-easy-lightbox'

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)
const project = ref<Project | null>(null)
const isLoading = ref(true)
const backButtonAnchor = ref<HTMLElement | null>(null)
const showFloatingBack = ref(false)
const mainImageLoadFailed = ref(false)
const previewVisible = ref(false)
const previewIndex = ref(0)

onMounted(async () => {
  isLoading.value = true
  try {
    project.value = await getProjectById(projectId)
    mainImageLoadFailed.value = false
  } catch {
    project.value = null
  } finally {
    isLoading.value = false
    requestAnimationFrame(setupFloatingBackButton)
  }
})

onUnmounted(() => {
  backButtonObserver?.disconnect()
  unlockBodyScroll()
})

const hasProjectContent = computed(() => {
  if (!project.value) return false

  return Boolean(
    project.value.longDesc?.trim()
    || project.value.videoUrl?.trim()
    || project.value.images?.length,
  )
})

const projectCategory = computed(() => project.value?.category?.trim() || '暂无')
const projectImage = computed(() => project.value?.image?.trim() || '')
const hasMainImage = computed(() => Boolean(projectImage.value) && !mainImageLoadFailed.value)
const hasGithubLink = computed(() => Boolean(project.value?.github?.trim()))
const hasDemoLink = computed(() => Boolean(project.value?.demo?.trim()))
const hasProjectActions = computed(() => hasGithubLink.value || hasDemoLink.value)
const galleryImages = computed(() => project.value?.images || [])

const handleMainImageError = () => {
  mainImageLoadFailed.value = true
}

const openGalleryPreview = (index: number) => {
  previewIndex.value = index
  lockBodyScroll()
  previewVisible.value = true
}

const closeGalleryPreview = () => {
  previewVisible.value = false
  window.setTimeout(unlockBodyScroll, 300)
}

const goBack = () => {
  router.push('/portfolio')
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
</script>


<template>
  <div class="pd-page-root">
  <div v-if="isLoading" class="pd-container" aria-live="polite" aria-busy="true">
    <div class="pd-back-wrapper">
      <div class="pd-loading-back"></div>
    </div>
    <header class="pd-hero pd-loading-hero">
      <span class="pd-loading-chip"></span>
      <span class="pd-loading-title"></span>
      <span class="pd-loading-desc"></span>
      <span class="pd-loading-desc pd-loading-desc-short"></span>
      <div class="pd-info-grid pd-loading-info-grid">
        <div v-for="item in 3" :key="item" class="pd-loading-info-item">
          <span class="pd-loading-info-icon"></span>
          <span class="pd-loading-info-lines">
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </header>
    <div class="pd-main-media pd-loading-media"></div>
    <div class="pd-content-section pd-loading-content">
      <span class="pd-loading-section-title"></span>
      <span class="pd-loading-line"></span>
      <span class="pd-loading-line"></span>
      <span class="pd-loading-line pd-loading-line-short"></span>
    </div>
  </div>

  <div class="pd-container" v-else-if="project">
    <!-- Back Button -->
    <div ref="backButtonAnchor" class="pd-back-wrapper">
      <button @click="goBack" class="pd-back-btn group">
        <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        返回作品列表
      </button>
    </div>

    <Transition name="floating-back">
      <button
        v-if="showFloatingBack"
        type="button"
        class="pd-floating-back-btn"
        aria-label="返回作品列表"
        @click="goBack"
      >
        <ArrowLeft class="pd-floating-back-icon" />
      </button>
    </Transition>

    <!-- Hero Section -->
    <header class="pd-hero" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <div class="pd-hero-layout">
        <div class="pd-hero-copy">
          <div class="pd-hero-meta">
            <span class="pd-category">{{ projectCategory }}</span>
          </div>
          <h1 class="pd-title">{{ project.title }}</h1>
          <p class="pd-desc">{{ project.desc }}</p>

          <div v-if="hasProjectActions" class="pd-actions">
            <a v-if="hasGithubLink" :href="project.github" target="_blank" class="pd-btn pd-btn-outline">
              <Github class="w-5 h-5" />
              查看源码
            </a>
            <a v-if="hasDemoLink" :href="project.demo" target="_blank" class="pd-btn pd-btn-primary">
              <ExternalLink class="w-5 h-5" />
              访问演示
            </a>
          </div>
        </div>

        <aside class="pd-project-brief" aria-label="项目概览">
          <div class="pd-brief-head">
            <span class="pd-brief-kicker">Project Brief</span>
            <span class="pd-brief-title">项目概览</span>
          </div>

          <div class="pd-brief-list">
            <div class="pd-brief-row">
              <User class="pd-brief-icon" />
              <div>
                <span class="pd-brief-label">我的角色</span>
                <span class="pd-brief-value">{{ project.role }}</span>
              </div>
            </div>
            <div class="pd-brief-row">
              <Calendar class="pd-brief-icon" />
              <div>
                <span class="pd-brief-label">开发周期</span>
                <span class="pd-brief-value">{{ project.date }}</span>
              </div>
            </div>
            <div class="pd-brief-row pd-brief-row-tech">
              <LayoutGrid class="pd-brief-icon" />
              <div>
                <span class="pd-brief-label">技术栈</span>
                <div class="pd-tech-tags">
                  <span v-for="tag in project.tags" :key="tag" class="pd-tech-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </header>

    <!-- Main Cover Image -->
    <div class="pd-main-media interactive-media" v-motion :initial="{ opacity: 0, y: 40 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }">
      <img
        v-if="hasMainImage"
        :src="projectImage"
        :alt="project.title"
        class="pd-main-img"
        @error="handleMainImageError"
      />
      <div v-else class="pd-main-image-empty" aria-live="polite">
        <p class="pd-empty-title">暂无图片</p>
        <p class="pd-empty-desc">作品封面还没有上传。</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="pd-content-section" v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 300 } }">
      <template v-if="hasProjectContent">
        <div v-if="project.longDesc?.trim()" class="pd-detail-block">
          <h2 class="pd-section-title">项目介绍</h2>
          <p class="pd-text-paragraph">{{ project.longDesc }}</p>
        </div>

        <!-- Video Section (If exists) -->
        <div v-if="project.videoUrl" class="pd-video-wrapper mt-12">
          <h2 class="pd-section-title">功能演示 (视频)</h2>
          <div class="pd-video-container">
            <video controls class="pd-video" :poster="project.image">
              <source :src="project.videoUrl" type="video/mp4">
              您的浏览器不支持 HTML5 视频。
            </video>
          </div>
        </div>

        <!-- Additional Images Gallery -->
        <div v-if="project.images && project.images.length > 0" class="pd-gallery mt-12">
          <h2 class="pd-section-title">项目截图</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              v-for="(img, index) in project.images"
              :key="index"
              type="button"
              class="pd-gallery-item interactive-media"
              :aria-label="`预览项目截图 ${index + 1}`"
              @click="openGalleryPreview(index)"
            >
              <img :src="img" alt="Gallery image" class="pd-gallery-img" />
            </button>
          </div>
        </div>
      </template>

      <div v-else class="pd-content-empty-state" aria-live="polite">
        <p class="pd-empty-title">暂无作品内容</p>
        <p class="pd-empty-desc">这个作品的介绍、视频和截图还没有整理好。</p>
      </div>
    </div>
  </div>
  
  <!-- 404 Fallback -->
  <div v-else class="pd-container">
    <div class="pd-back-wrapper">
      <button @click="goBack" class="pd-back-btn group">
        <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        返回作品列表
      </button>
    </div>

    <div class="pd-detail-empty-state" aria-live="polite">
      <p class="pd-empty-title">暂无作品详情</p>
      <p class="pd-empty-desc">这个作品可能已经下架，或还没有发布完整内容。</p>
    </div>
  </div>

  <VueEasyLightbox
    :visible="previewVisible"
    :imgs="galleryImages"
    :index="previewIndex"
    :scroll-disabled="false"
    @hide="closeGalleryPreview"
  />
  </div>
</template>

<style scoped lang="scss">
.pd-container {
  @apply min-h-screen py-12 pt-24 px-6 mx-auto;
  max-width: min(1280px, var(--site-page-max-width));

  @media (min-width: 768px) {
    @apply px-12 pt-32;
  }
  
  @media (min-width: 1024px) {
    @apply pt-40;
  }

  @media (min-width: 2561px) {
    max-width: 1440px;
    padding-top: 11rem;
    padding-bottom: 6rem;
  }

  @media (min-width: 3840px) {
    max-width: 1520px;
  }
}

.pd-back-wrapper {
  @apply mb-12;
}

.pd-back-btn {
  @apply flex items-center gap-2 text-slate-500 font-medium hover:text-rose-500 transition-colors bg-white/70 px-4 py-2 rounded-full border border-slate-200/60 shadow-sm;
}

@media (max-width: 767px) {
  .pd-back-btn {
    min-height: 44px;
  }

  .pd-container {
    padding-inline: 1rem;
  }

  .pd-back-wrapper {
    margin-bottom: 2rem;
  }

  .pd-floating-back-btn {
    display: none;
  }
}

.pd-back-btn svg {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.pd-floating-back-btn {
  position: fixed;
  left: max(1.25rem, calc((100vw - 1440px) / 2 - 5rem));
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

.pd-floating-back-btn:hover {
  transform: translateX(-0.1875rem);
  color: var(--color-primary);
  border-color: rgba(244, 63, 94, 0.22);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 22px 42px -28px rgba(244, 63, 94, 0.45);
}

.pd-floating-back-icon {
  width: 1.2rem;
  height: 1.2rem;
}

:global(html.dark .pd-floating-back-btn) {
  background: rgba(15, 23, 42, 0.68);
  border-color: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

:global(html.dark .pd-floating-back-btn:hover) {
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

.pd-loading-back,
.pd-loading-chip,
.pd-loading-title,
.pd-loading-desc,
.pd-loading-info-icon,
.pd-loading-info-lines span,
.pd-loading-media,
.pd-loading-section-title,
.pd-loading-line {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: pd-skeleton-shimmer 1.5s ease-in-out infinite;
}

.pd-loading-back {
  width: 8.75rem;
  height: 2.5rem;
}

.pd-loading-chip {
  width: 6rem;
  height: 2rem;
  margin-bottom: 1.5rem;
}

.pd-loading-title {
  width: min(44rem, 86%);
  height: 3.25rem;
  margin-bottom: 1.5rem;
}

.pd-loading-desc {
  width: min(42rem, 92%);
  height: 1.25rem;
  margin-bottom: 1rem;
}

.pd-loading-desc-short {
  width: min(28rem, 62%);
  margin-bottom: 2.5rem;
}

.pd-loading-info-grid {
  pointer-events: none;
}

.pd-loading-info-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.pd-loading-info-icon {
  width: 2.5rem;
  height: 2.5rem;
}

.pd-loading-info-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pd-loading-info-lines span {
  width: 70%;
  height: 0.875rem;
}

.pd-loading-info-lines span:first-child {
  width: 42%;
}

.pd-loading-media {
  border-radius: 1rem;
}

.pd-loading-content {
  pointer-events: none;
}

.pd-loading-section-title {
  width: 9rem;
  height: 1.75rem;
  margin-bottom: 2rem;
}

.pd-loading-line {
  width: 100%;
  height: 1rem;
  margin-bottom: 1rem;
}

.pd-loading-line-short {
  width: 64%;
}

.pd-hero {
  @apply mb-16;

  .pd-hero-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    align-items: end;

    @media (min-width: 960px) {
      grid-template-columns: minmax(0, 1fr) minmax(21rem, 25rem);
      gap: 4rem;
    }
  }

  .pd-hero-copy {
    min-width: 0;
  }

  .pd-hero-meta {
    @apply flex items-center gap-3 mb-6;
  }

  .pd-category {
    @apply px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide;
    max-width: 100%;
    overflow-wrap: anywhere;
    background-color: var(--color-primary);
    color: #fff;
  }

  .pd-title {
    @apply text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .pd-desc {
    @apply text-xl text-slate-500 leading-relaxed mb-8 max-w-3xl;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .pd-project-brief {
    min-width: 0;
    border-radius: 1rem;
    border: 1px solid rgba(226, 232, 240, 0.46);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.58), rgba(255, 247, 250, 0.24)),
      var(--color-card);
    box-shadow: 0 12px 34px rgba(15, 23, 42, 0.024);
    padding: 1.5rem;
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      border-color: rgba(244, 63, 94, 0.1);
      box-shadow: 0 14px 36px rgba(244, 63, 94, 0.034);
    }
  }

  .pd-brief-head {
    @apply mb-3;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }

  .pd-brief-kicker {
    @apply text-xs font-semibold uppercase tracking-wider text-rose-500;
  }

  .pd-brief-title {
    @apply text-sm font-semibold text-slate-600;
  }

  .pd-brief-list {
    display: grid;
  }

  .pd-brief-row {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-height: 4.5rem;
    padding: 0.875rem 0;
    border-top: 1px solid rgba(226, 232, 240, 0.42);
    transition:
      background-color 0.3s ease,
      padding-left 0.3s ease;

    &:hover {
      padding-left: 0.375rem;
      background: linear-gradient(90deg, rgba(244, 63, 94, 0.055), rgba(244, 63, 94, 0));
    }

    > div {
      min-width: 0;
      flex: 1;
    }
  }

  .pd-brief-row-tech {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }

  .pd-brief-icon {
    @apply mt-0.5 w-8 h-8 p-2 rounded-full bg-rose-50 text-rose-500 shrink-0;
  }

  .pd-brief-label {
    @apply text-xs font-semibold text-slate-400 uppercase tracking-wider;
    display: block;
    margin-bottom: 0.2rem;
    overflow-wrap: anywhere;
  }

  .pd-brief-value {
    @apply text-sm font-medium text-slate-800;
    display: block;
    overflow-wrap: anywhere;
  }

  .pd-actions {
    @apply flex flex-wrap gap-4;

    .pd-btn {
      @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300;
      transform: none;

      svg {
        transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }

      &:hover svg {
        transform: translateX(0.125rem);
      }

      &-outline {
        @apply border;
        background-color: var(--color-secondary);
        color: var(--color-primary);
        border-color: var(--color-border);

        &:hover {
          background-color: rgba(244, 63, 94, 0.1);
          box-shadow: inset 0 0 0 1px rgba(244, 63, 94, 0.08);
        }
      }

      &-primary {
        @apply text-white;
        background-color: var(--color-primary);

        &:hover {
          background-color: #e11d48;
          box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.14);
        }
      }
    }
  }
}

.pd-main-media {
  @apply w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-16 relative;
  border-radius: 1rem;
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);
  background-color: var(--color-background);

  .pd-main-img {
    @apply w-full h-full object-cover;
  }
}

.pd-main-image-empty {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  isolation: isolate;
  background:
    radial-gradient(circle at 46% 35%, rgba(244, 63, 94, 0.08), transparent 34%),
    linear-gradient(135deg, rgba(248, 250, 252, 0.88), rgba(255, 241, 242, 0.42));
}

.pd-main-image-empty::before {
  content: '';
  position: absolute;
  inset: 18% 24%;
  z-index: -1;
  border-radius: 999px;
  background:
    radial-gradient(circle at 38% 45%, rgba(244, 63, 94, 0.1), transparent 36%),
    radial-gradient(circle at 62% 46%, rgba(147, 197, 253, 0.14), transparent 34%);
  filter: blur(28px);
  opacity: 0.72;
}

.pd-main-image-empty::after {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 1rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.38;
}

.pd-content-section {
  @apply p-8 md:p-12;
  border-radius: 1rem;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    border-color: rgba(244, 63, 94, 0.14);
    box-shadow: 0 12px 34px rgba(244, 63, 94, 0.06);
  }

  .pd-section-title {
    @apply text-2xl font-bold mb-6 flex items-center gap-3;
    color: var(--color-heading);

    &::before {
      content: '';
      @apply block w-1.5 h-6 bg-rose-500 rounded-full;
    }
  }

  .pd-text-paragraph {
    @apply text-lg text-slate-600 leading-relaxed space-y-4;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
}

.pd-detail-block {
  min-width: 0;
}

.pd-content-empty-state,
.pd-detail-empty-state {
  position: relative;
  min-height: clamp(13rem, 30vh, 19rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  isolation: isolate;
}

.pd-detail-empty-state {
  border-radius: 1rem;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}

.pd-content-empty-state::before,
.pd-detail-empty-state::before {
  content: '';
  position: absolute;
  inset: 12% 18%;
  z-index: -1;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 38% 45%, rgba(244, 63, 94, 0.1), transparent 36%),
    radial-gradient(circle at 62% 46%, rgba(147, 197, 253, 0.14), transparent 34%);
  filter: blur(28px);
  opacity: 0.72;
}

.pd-content-empty-state::after,
.pd-detail-empty-state::after {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 1rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.38;
}

.pd-empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
}

.pd-empty-desc {
  margin: 0.5rem 0 0;
  font-size: 0.9375rem;
  color: var(--color-text);
}

.pd-video-wrapper {
  @apply w-full;

  .pd-video-container {
    @apply relative w-full overflow-hidden shadow-lg border border-slate-100 bg-black aspect-video;
    border-radius: 1rem;

    .pd-video {
      @apply w-full h-full object-contain;
    }
  }
}

.pd-gallery-item {
  @apply overflow-hidden shadow-md border border-slate-100;
  display: block;
  width: 100%;
  padding: 0;
  border-radius: 1rem;
  background: transparent;
  cursor: zoom-in;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    border-color: rgba(244, 63, 94, 0.16);
    box-shadow: 0 12px 28px rgba(244, 63, 94, 0.08);
  }

  /* Use nested CSS instead of Tailwind group utility */
  .pd-gallery-img {
    @apply w-full h-full object-cover aspect-video;
  }
}

.pd-tech-tag {
  @apply px-3 py-1 rounded-full text-sm font-medium;
  flex: 0 0 auto;
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
  background-color: rgba(255, 255, 255, 0.62);
  color: var(--color-text);
  border: 1px solid rgba(226, 232, 240, 0.76);
}

.pd-tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
  align-items: center;
}

@media (max-width: 767px) {
  .pd-hero {
    margin-bottom: 1.5rem;

    .pd-hero-layout {
      gap: 1rem;
    }

    .pd-hero-meta {
      margin-bottom: 1rem;
    }

    .pd-title {
      margin-bottom: 0.75rem;
      font-size: 2rem;
      line-height: 1.2;
    }

    .pd-desc {
      margin-bottom: 1rem;
      font-size: 1rem;
      line-height: 1.65;
    }

    .pd-project-brief {
      display: none;
    }

    .pd-actions {
      gap: 0.75rem;

      .pd-btn {
        min-height: 44px;
        padding-inline: 1rem;
      }
    }
  }

  .pd-main-media {
    margin-bottom: 1.25rem;
    border-radius: 1rem;
  }

  .pd-content-section {
    padding: 1rem;
    border-radius: 1rem;

    .pd-section-title {
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }

    .pd-text-paragraph {
      font-size: 0.95rem;
      line-height: 1.7;
    }
  }

  .pd-content-empty-state,
  .pd-detail-empty-state {
    min-height: 10rem;
    padding: 1rem;
    border-radius: 1rem;
  }
}

:global(html.dark .pd-container .pd-back-btn) {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.44);
  border-color: rgba(148, 163, 184, 0.26);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
}

:global(html.dark .pd-container .pd-back-btn:hover) {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.28);
}

:global(html.dark .pd-container .pd-category) {
  background-color: var(--color-primary);
  color: #fff;
}

:global(html.dark .pd-container .pd-main-image-empty) {
  background:
    radial-gradient(circle at 46% 35%, rgba(244, 63, 94, 0.12), transparent 34%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(30, 41, 59, 0.44));
}

:global(html.dark .pd-container .pd-main-image-empty::before) {
  opacity: 0.32;
}

:global(html.dark .pd-container .pd-project-brief) {
  background:
    linear-gradient(135deg, rgba(30, 41, 59, 0.58), rgba(15, 23, 42, 0.76)),
    var(--color-card);
  border-color: rgba(148, 163, 184, 0.16);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
}

:global(html.dark .pd-container .pd-project-brief:hover) {
  border-color: rgba(244, 63, 94, 0.2);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.26);
}

:global(html.dark .pd-container .pd-brief-title) {
  color: #cbd5e1;
}

:global(html.dark .pd-container .pd-brief-row) {
  border-top-color: rgba(148, 163, 184, 0.18);
}

:global(html.dark .pd-container .pd-brief-row:hover) {
  background: linear-gradient(90deg, rgba(244, 63, 94, 0.1), rgba(244, 63, 94, 0));
}

:global(html.dark .pd-container .pd-brief-icon) {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.12);
}

:global(html.dark .pd-container .pd-brief-label) {
  color: #94a3b8;
}

:global(html.dark .pd-container .pd-brief-value) {
  color: #f1f5f9;
}

:global(html.dark .pd-container .pd-tech-tag) {
  color: #cbd5e1;
  background: rgba(148, 163, 184, 0.12);
  border-color: rgba(148, 163, 184, 0.2);
}

:global(html.dark .pd-container .pd-detail-empty-state) {
  background: var(--color-card);
  border-color: rgba(148, 163, 184, 0.16);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
}

:global(html.dark .pd-container .pd-empty-title) {
  color: #e2e8f0;
}

:global(html.dark .pd-container .pd-empty-desc) {
  color: #94a3b8;
}

:global(html.dark .pd-container .pd-content-empty-state::before),
:global(html.dark .pd-container .pd-detail-empty-state::before) {
  opacity: 0.32;
}

@keyframes pd-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pd-loading-back,
  .pd-loading-chip,
  .pd-loading-title,
  .pd-loading-desc,
  .pd-loading-info-icon,
  .pd-loading-info-lines span,
  .pd-loading-media,
  .pd-loading-section-title,
  .pd-loading-line {
    animation: none;
  }
}
</style>
