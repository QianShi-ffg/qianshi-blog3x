<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import { useBlogStore } from '@/stores/blog'
import { Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-vue-next'
import { getArticleDetail, getClassifyIdList } from '@/api/blog'
import type { ArticleDetail } from '@/types/content'
import thumb from '@/assets/img/thumb.png'
import { MdPreview, config } from 'md-editor-v3';
 import 'md-editor-v3/lib/style.css';

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const colorMode = useColorMode()
const articleId = route.params.id
const article = ref<ArticleDetail | null>(null)
const isLoading = ref(true)
const isCoverRevealed = ref(false)
const filters = reactive({
  rows: [{ id: '全部', name: '全部' }], // 默认添加一个“全部”分类
  total: 0,
});

const id = "preview-only";

const coverSrc = computed(() => article.value?.coverUrl || blogStore.coverUrl || thumb)

const preloadImage = (src: string) => {
  return new Promise<void>((resolve) => {
    const image = new Image()

    const finish = () => resolve()

    image.onload = async () => {
      try {
        await image.decode?.()
      } catch {
        // Keep rendering even when the browser cannot decode ahead of paint.
      }
      finish()
    }
    image.onerror = finish
    image.src = src
  })
}

onMounted(async () => {
  isLoading.value = true
  isCoverRevealed.value = false
  try {
    await classify();
    const articleDetail = (await getArticleDetail({ id: articleId })) as ArticleDetail | null
    article.value = articleDetail
    if (articleDetail) {
      void preloadImage(articleDetail.coverUrl || thumb)
    }
  } finally {
    isLoading.value = false
  }
})

const classify = async () => {
  const res: any = await getClassifyIdList({});
  filters.rows.push(...res.rows);
  filters.total = res.total;
  // 文章总数
  // total.value = res.total;
  // 当前分类文章总数
  // conditionTotal.value = filters.total;
};

const goBack = () => {
  router.push({ path: '/blog' })
}
</script>

<template>
  <div class="blog-post-page" aria-live="polite" :aria-busy="isLoading">
    <!-- Hero Header - Full Width, Partial Height -->
    <header class="post-hero-header">
      <!-- Cover Image -->
      <div
        class="post-cover-stage"
        :class="{ 'post-cover-stage-ready': isCoverRevealed }"
        :style="{ '--post-cover-image-url': `url(${coverSrc})` }"
      >
        <div class="post-cover-soft" aria-hidden="true"></div>
        <img
          :src="coverSrc"
          alt="Cover"
          class="post-cover-image"
          @load="isCoverRevealed = true"
          @error="isCoverRevealed = true"
        />
      </div>
      <!-- Gradient Overlay (Darker at bottom for text readability) -->
      <div class="post-gradient-overlay"></div>

      <!-- Back Button -->
      <div class="post-back-btn-wrap">
        <button @click="goBack" class="post-back-btn interactive-lift">
          <ArrowLeft class="post-icon-sm" />
          返回文章列表
        </button>
      </div>

      <!-- Title & Meta -->
      <div class="post-header-content">
        <div v-if="article" class="post-header-inner">
          <span class="post-category-badge">
             {{ (filters.rows.find((ii: any) => ii.id === article?.classifyId)?.name) ?? '' }}
          </span>
          <h1 class="post-main-title">
            {{ article.title }}
          </h1>

          <div class="post-meta-info">
            <span class="post-meta-item">
              <Calendar class="post-meta-icon" />
              {{ article.createTime }}
            </span>
            <span class="post-meta-item">
              <Clock class="post-meta-icon" />
              {{ article.readTime }}
            </span>
          </div>
        </div>
        <div v-else class="post-header-inner post-header-skeleton">
          <span class="post-loading-chip"></span>
          <span class="post-loading-title post-loading-line"></span>
          <span class="post-loading-title-sm post-loading-line"></span>
          <div class="post-loading-meta">
            <span class="post-loading-meta-item post-loading-line"></span>
            <span class="post-loading-meta-item post-loading-line"></span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area - Optimal Reading Width -->
    <main class="post-main-area">
      <!-- Main content container -->
      <article
        v-if="article"
        class="post-article-container"
      >
        <!-- Markdown Content (Simulated with raw HTML for now, would normally use a markdown parser) -->
        <!-- <div class="prose" v-html="article.articleContent"></div> -->
        <MdPreview
          :editorId="id"
          :modelValue="article.articleContent"
          :theme="colorMode === 'dark' ? 'dark' : 'light'"
        />
      </article>

      <div v-else class="post-loading-card">
        <span class="post-loading-paragraph post-loading-line"></span>
        <span class="post-loading-paragraph post-loading-line"></span>
        <span class="post-loading-paragraph-short post-loading-line"></span>
        <div class="post-loading-divider"></div>
        <span class="post-loading-paragraph post-loading-line"></span>
        <span class="post-loading-paragraph post-loading-line"></span>
        <span class="post-loading-paragraph-mid post-loading-line"></span>
      </div>

      <!-- Bottom Navigation / Share (Optional) -->
      <div class="post-nav-bottom">
        <button class="post-nav-btn interactive-lift">
          <ChevronLeft class="post-icon-sm" />
          上一篇
        </button>
        <button class="post-nav-btn interactive-lift">
          下一篇
          <ChevronRight class="post-icon-sm" />
        </button>
      </div>
    </main>

    <div v-if="!article && !isLoading" class="post-not-found">
      <h2>找不到该文章</h2>
      <button @click="goBack" class="post-nav-btn interactive-lift">返回文章列表</button>
    </div>
  </div>
</template>

<style scoped>
.blog-post-page {
  @apply min-h-screen bg-transparent pb-20;
  position: relative;
}

.post-not-found {
  @apply min-h-screen flex flex-col items-center justify-center gap-4 py-32;
  color: var(--color-heading);
}

.post-loading-chip {
  display: block;
  width: 5.75rem;
  height: 2rem;
  margin-bottom: 1.5rem;
  border-radius: 9999px;
  background: rgba(244, 63, 94, 0.72);
  box-shadow: 0 12px 28px -18px rgba(244, 63, 94, 0.8);
}

.post-loading-line {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.48));
  background-size: 220% 100%;
  animation: post-loading-shimmer 1.6s ease-in-out infinite;
}

.post-loading-title {
  width: min(52rem, 86%);
  height: 3.25rem;
  margin-bottom: 1rem;
}

.post-loading-title-sm {
  width: min(34rem, 62%);
  height: 2rem;
  margin-bottom: 2rem;
}

.post-loading-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.post-loading-meta-item {
  width: 8rem;
  height: 1.25rem;
  opacity: 0.68;
}

.post-loading-main {
  width: 100%;
  max-width: 1200px;
  margin: -4rem auto 0;
  position: relative;
  z-index: 2;
  padding: 0 1rem;
}
@media (min-width: 640px) {
  .post-loading-main {
    padding: 0 1.5rem;
  }
}
@media (min-width: 768px) {
  .post-loading-main {
    padding: 0 2rem;
  }
}
@media (min-width: 1280px) {
  .post-loading-main {
    padding: 0;
  }
}

.post-loading-card {
  width: 100%;
  min-height: 28rem;
  padding: 2rem;
  border-radius: 1.5rem;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
@media (min-width: 768px) {
  .post-loading-card {
    padding: 4rem;
    border-radius: 2.5rem;
  }
}

.post-loading-card .post-loading-line {
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
}

.post-loading-paragraph,
.post-loading-paragraph-short,
.post-loading-paragraph-mid {
  height: 1rem;
  margin-bottom: 1rem;
}

.post-loading-paragraph {
  width: 100%;
}

.post-loading-paragraph-short {
  width: 54%;
}

.post-loading-paragraph-mid {
  width: 76%;
}

.post-loading-divider {
  width: 100%;
  height: 1px;
  margin: 2.5rem 0;
  background: var(--color-border);
}

:global(html.dark .post-loading-card){
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, var(--color-card) 200px);
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

@keyframes post-loading-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

.post-hero-header {
  @apply relative w-full h-[50vh] md:h-[60vh] min-h-[400px] overflow-hidden;
}

.post-cover-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.post-cover-soft {
  position: absolute;
  inset: -1.25rem;
  background:
    linear-gradient(to top, rgba(15, 23, 42, 0.42), rgba(15, 23, 42, 0.1)),
    var(--post-cover-image-url, none);
  background-position: center;
  background-size: cover;
  filter: blur(18px) saturate(0.9);
  transform: scale(1.04);
  transform-origin: center;
}

.post-cover-image {
  @apply absolute inset-0 w-full h-full object-cover object-center;
  opacity: 0.98;
  clip-path: inset(0 0 0 0 round 0);
  mask-image: radial-gradient(circle at 50% 48%, #000 0%, #000 32%, transparent 34%);
  mask-size: 0% 0%;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: radial-gradient(circle at 50% 48%, #000 0%, #000 32%, transparent 34%);
  -webkit-mask-size: 0% 0%;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  filter: saturate(0.94);
  transform: scale(1.012);
  transition:
    mask-size 920ms cubic-bezier(0.22, 1, 0.36, 1),
    -webkit-mask-size 920ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 720ms ease,
    transform 920ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: mask-size, -webkit-mask-size, filter, transform;
  animation: post-cover-drift 18s ease-in-out infinite alternate;
}

.post-cover-stage-ready .post-cover-image {
  mask-size: 320% 320%;
  -webkit-mask-size: 320% 320%;
  filter: saturate(1);
  transform: scale(1);
}

.post-gradient-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/10;
}

.post-back-btn-wrap {
  @apply absolute top-24 md:top-32 left-4 md:left-8 z-10;
}

.post-back-btn {
  @apply flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg;
}

.post-icon-sm {
  @apply w-4 h-4;
}

.post-header-content {
  @apply absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-24 lg:pb-24;
}

.post-header-inner {
  @apply container mx-auto max-w-[1200px];
}

.post-category-badge {
  @apply inline-block px-4 py-1.5 mb-6 rounded-full bg-rose-500/90 backdrop-blur-sm border border-rose-400/30 text-white text-sm font-bold tracking-widest shadow-lg shadow-rose-500/20;
}

.post-main-title {
  @apply text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg;
}

.post-meta-info {
  @apply flex items-center gap-6 text-slate-200 text-sm md:text-base font-medium;
}

.post-meta-item {
  @apply flex items-center gap-2;
}

.post-meta-icon {
  @apply w-4 h-4 md:w-5 md:h-5 text-rose-400;
}

.post-main-area {
  @apply w-full max-w-[1200px] mx-auto -mt-16 relative z-20 px-4 sm:px-6 md:px-8 xl:px-0 flex flex-col;
}

.post-article-container {
  @apply rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-16 w-full relative z-10;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
:global(html.dark .post-article-container){
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, var(--color-card) 200px);
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.post-nav-bottom {
  @apply mt-12 flex items-center justify-between;
}

.post-nav-btn {
  @apply flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.post-nav-btn:hover {
  background-color: var(--color-secondary);
  color: var(--color-primary);
  border-color: var(--color-secondary);
}

@media (max-width: 767px) {
  .post-hero-header {
    height: auto;
    min-height: 0;
    overflow: visible;
    padding: 6.5rem 1rem 1.5rem;
  }

  .post-cover-stage,
  .post-gradient-overlay {
    display: none;
  }

  .post-back-btn-wrap {
    position: relative;
    top: auto;
    left: auto;
    z-index: 1;
    margin-bottom: 1.5rem;
  }

  .post-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 1rem 0.375rem 0.5rem;
    background-color: var(--color-background);
    border-color: var(--color-border);
    color: var(--color-text);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  .post-back-btn .post-icon-sm {
    width: 1.5rem;
    height: 1.5rem;
    padding: 0.25rem;
    border-radius: 9999px;
    background-color: var(--color-border);
  }

  .post-back-btn:hover {
    color: var(--color-primary);
    border-color: var(--color-secondary);
  }

  .post-header-content {
    position: relative;
    inset: auto;
    padding: 0;
  }

  .post-category-badge {
    margin-bottom: 1rem;
    box-shadow: none;
  }

  .post-main-title {
    color: var(--color-heading);
    font-size: 2.25rem;
    line-height: 1.2;
    margin-bottom: 1rem;
    text-shadow: none;
  }

  .post-meta-info {
    flex-wrap: wrap;
    gap: 0.75rem;
    color: var(--color-text);
  }

  .post-main-area {
    margin-top: 0;
    padding-inline: 1rem;
  }
}

@keyframes post-cover-drift {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.045) translateY(-0.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .post-cover-image {
    mask-image: none;
    -webkit-mask-image: none;
    filter: none;
    transform: none;
    transition: none;
    animation: none;
  }

  .post-loading-cover,
  .post-loading-line {
    animation: none;
  }
}

/*
  Tailwind Typography (@tailwindcss/typography) 插件的替代样式
  如果没有安装该插件，这些基础样式可以保证排版的优雅。
  由于项目中没有安装 @tailwindcss/typography，这里手写核心的 prose 样式以保证"简约清新"的阅读体验。
*/
.prose {
  color: var(--color-text);
  line-height: 1.8;
  max-width: none;
}
.prose h2 {
  font-size: 1.875rem;
  margin-top: 2.5em;
  margin-bottom: 1em;
  font-weight: 700;
  color: var(--color-heading);
}
.prose h3 {
  font-size: 1.25rem;
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 600;
  color: var(--color-heading);
}
.prose p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}
.prose a {
  color: var(--color-primary);
  text-decoration: underline;
  font-weight: 500;
}
.prose a:hover {
  text-decoration: underline;
}
.prose strong {
  font-weight: 600;
  color: var(--color-heading);
}
.prose ul,
.prose ol {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.625em;
}
.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
.prose ol {
  list-style-type: decimal;
}
.prose ul {
  list-style-type: disc;
}
.prose hr {
  border-color: var(--color-border);
  margin-top: 3em;
  margin-bottom: 3em;
}
.prose blockquote {
  font-style: italic;
  color: var(--color-text);
  border-left-width: 0.25rem;
  border-left-color: var(--color-border);
  quotes: '"\201C"' '"\201D"' '"\2018"' '"\2019"';
  margin-top: 1.6em;
  margin-bottom: 1.6em;
  padding-left: 1em;
}
.prose pre {
  background-color: #0f172a;
  color: #f8fafc;
  overflow-x: auto;
  border-radius: 0.75rem;
  padding: 1.25em 1.5em;
  margin-top: 1.7142857em;
  margin-bottom: 1.7142857em;
  font-size: 0.875em;
  line-height: 1.7142857;
}
.prose code {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.875em;
  background-color: var(--color-secondary);
  padding: 0.25rem 0.375rem;
  border-radius: 0.375rem;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
.prose pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

#preview-only {
  background: unset;
  color: var(--color-text);
}

:global(html.dark #preview-only),
:global(html.dark #preview-only .md-editor-preview),
:global(html.dark #preview-only .md-editor-preview-wrapper) {
  background: transparent;
  color: #cbd5e1;
}

:global(html.dark #preview-only h1),
:global(html.dark #preview-only h2),
:global(html.dark #preview-only h3),
:global(html.dark #preview-only h4),
:global(html.dark #preview-only h5),
:global(html.dark #preview-only h6) {
  color: #f1f5f9;
}

:global(html.dark #preview-only p),
:global(html.dark #preview-only li),
:global(html.dark #preview-only blockquote),
:global(html.dark #preview-only table),
:global(html.dark #preview-only span) {
  color: #cbd5e1;
}

:global(html.dark #preview-only a) {
  color: #fb7185;
}

:global(html.dark #preview-only code:not(pre code)) {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.14);
}

:global(html.dark #preview-only pre) {
  background: rgba(2, 6, 23, 0.72);
  color: #e2e8f0;
}

:global(html.dark #preview-only img) {
  opacity: 0.96;
}
</style>
