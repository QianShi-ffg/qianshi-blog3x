<script setup lang="ts">
import { ref, reactive, computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { listArticles, getClassifyIdList } from '@/api/blog'
import type { ArticleSummary } from '@/types/content'
import { date } from "@/util/date";
import { useBlogStore } from '@/stores/blog'

const router = useRouter()
const blogStore = useBlogStore()
const activeFilter = ref('全部')
const filters = reactive({
  rows: [{ id: '全部', name: '全部', value: '0' }], // 默认添加一个“全部”分类
  total: 0,
});

const articles = ref<ArticleSummary[]>([])
const isArticlesLoading = ref(true)
const articleTotal = ref(0)
const pageSize = 6
const filterScroller = ref<HTMLElement | null>(null)
const canScrollFilterRight = ref(false)
const filterDrag = reactive({
  isDown: false,
  startX: 0,
  scrollLeft: 0,
  hasMoved: false,
})
let filterPreventClickUntil = 0

onMounted(async () => {
  await classify();
  await nextTick()
  updateFilterOverflow()
  await loadArticles(blogStore.currentPage)
  window.addEventListener('resize', updateFilterOverflow)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateFilterOverflow)
})


const classify = async () => {
  const res = await getClassifyIdList({}) as { rows: Array<{ id: string; name: string; value: string }>; total: number }
  const allFilter = filters.rows[0]
  if (allFilter) {
    allFilter.value = String(res.total)
  }
  filters.rows.push(...res.rows)
  filters.total = res.total
};


const filteredArticles = computed(() => {
  return pagedArticles.value
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(articleTotal.value / pageSize))
})

const paginationItems = computed(() => {
  const pages: Array<number | 'ellipsis'> = []
  const total = totalPages.value
  const current = blogStore.currentPage

  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  pages.push(1)

  if (current > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  pages.push(total)
  return pages
})

const readArticleList = (res: unknown) => {
  if (Array.isArray(res)) {
    return res as ArticleSummary[]
  }

  const payload = res as { rows?: ArticleSummary[] }
  return payload.rows ?? []
}

const getCurrentFilterTotal = () => {
  const filter = filters.rows.find((item) => item.id === activeFilter.value)
  if (!filter) return 0

  return Number(filter.value)
}

const updateArticleTotal = () => {
  articleTotal.value = activeFilter.value === '全部' ? filters.total : getCurrentFilterTotal()
}

const pagedArticles = computed(() => {
  if (articles.value.length <= pageSize) return articles.value

  const start = (blogStore.currentPage - 1) * pageSize
  return articles.value.slice(start, start + pageSize)
})

const getArticleRequestParams = (page: number) => {
  return {
    page,
    pageSize,
    ...(activeFilter.value === '全部' ? {} : { classifyId: activeFilter.value }),
  }
}

const loadArticles = async (page = blogStore.currentPage) => {
  blogStore.setPage(page)
  isArticlesLoading.value = true

  try {
    const res = await listArticles(getArticleRequestParams(page))
    const articleList = readArticleList(res)

    articles.value = articleList
    updateArticleTotal()

    if (blogStore.currentPage > totalPages.value) {
      await loadArticles(totalPages.value)
    }
  } finally {
    isArticlesLoading.value = false
  }
}

const changePage = async (page: number) => {
  const nextPage = Math.min(Math.max(page, 1), totalPages.value)
  if (nextPage === blogStore.currentPage) return

  await loadArticles(nextPage)
}

const updateFilterOverflow = () => {
  const scroller = filterScroller.value
  if (!scroller) {
    canScrollFilterRight.value = false
    return
  }

  canScrollFilterRight.value =
    scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 2
}

const scrollFilterForward = () => {
  const scroller = filterScroller.value
  if (!scroller) return

  scroller.scrollLeft += Math.min(scroller.clientWidth * 0.6, 360)
  window.setTimeout(updateFilterOverflow, 260)
}

const startFilterDrag = (event: PointerEvent) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  const scroller = filterScroller.value
  if (!scroller) return

  filterDrag.isDown = true
  filterDrag.startX = event.clientX
  filterDrag.scrollLeft = scroller.scrollLeft
  filterDrag.hasMoved = false
}

const moveFilterDrag = (event: PointerEvent) => {
  if (!filterDrag.isDown || !filterScroller.value) return

  const distance = event.clientX - filterDrag.startX
  if (Math.abs(distance) > 4) {
    filterDrag.hasMoved = true
    if (!filterScroller.value.hasPointerCapture(event.pointerId)) {
      filterScroller.value.setPointerCapture(event.pointerId)
    }
  }

  if (!filterDrag.hasMoved) return

  event.preventDefault()
  filterScroller.value.scrollLeft = filterDrag.scrollLeft - distance
  updateFilterOverflow()
}

const stopFilterDrag = (event: PointerEvent) => {
  if (!filterDrag.isDown) return

  const scroller = filterScroller.value
  const shouldSuppressClick = filterDrag.hasMoved
  filterDrag.isDown = false
  filterDrag.hasMoved = false

  if (scroller?.hasPointerCapture(event.pointerId)) {
    scroller.releasePointerCapture(event.pointerId)
  }

  if (shouldSuppressClick) {
    filterPreventClickUntil = Date.now() + 120
  }
  updateFilterOverflow()
}

const selectFilter = async (id: string) => {
  if (Date.now() < filterPreventClickUntil) return
  if (activeFilter.value === id) return

  activeFilter.value = id
  await loadArticles(1)
}

const openArticle = (article: ArticleSummary) => {
  blogStore.setCoverUrl(article.coverUrl || '')
  router.push({ path: `/blog/${article.id}` })
}
</script>

<template>
  <div class="blog-page-container">
    <!-- Header -->
    <div class="blog-header-wrapper">
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="blog-title"
      >
        技术与思考
      </h1>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
        class="blog-subtitle"
      >
        分享前端开发经验、设计灵感以及生活中的点滴感悟。
      </p>
    </div>

    <!-- Filters -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
      class="blog-filters-wrap"
    >
      <div
        ref="filterScroller"
        class="blog-filters-container"
        :class="{ 'blog-filters-dragging': filterDrag.hasMoved }"
        @scroll="updateFilterOverflow"
        @pointerdown="startFilterDrag"
        @pointermove="moveFilterDrag"
        @pointerup="stopFilterDrag"
        @pointercancel="stopFilterDrag"
        @pointerleave="stopFilterDrag"
      >
        <button
          v-for="item in filters.rows"
          :key="item.id"
          @click="selectFilter(item.id)"
          class="blog-filter-btn"
          :class="activeFilter === item.id ? 'blog-filter-active' : 'blog-filter-inactive'"
        >
          {{ item.name }}
        </button>
      </div>
      <button
        v-show="canScrollFilterRight"
        type="button"
        class="blog-filter-more"
        aria-label="查看更多分类"
        @click.stop="scrollFilterForward"
      >
        <span class="blog-filter-more-stack" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="blog-grid-wrapper">
      <div v-if="isArticlesLoading" class="blog-grid-container" aria-live="polite" aria-busy="true">
        <article v-for="item in pageSize" :key="item" class="blog-article-card blog-article-skeleton">
          <div class="blog-article-inner">
            <div class="blog-skeleton-meta">
              <span class="blog-skeleton-pill"></span>
              <span class="blog-skeleton-date"></span>
            </div>
            <span class="blog-skeleton-title"></span>
            <span class="blog-skeleton-text"></span>
            <span class="blog-skeleton-text blog-skeleton-text-short"></span>
            <div class="blog-skeleton-divider"></div>
            <span class="blog-skeleton-link"></span>
          </div>
        </article>
      </div>
      <TransitionGroup v-else name="list" tag="div" class="blog-grid-container">
        <article
          v-for="article in filteredArticles"
          :key="article.id"
          @click="openArticle(article)"
          class="blog-article-card interactive-card group"
        >
          <div class="blog-article-inner">
            <!-- Meta -->
            <div class="blog-article-meta">
              <span class="blog-article-category">
                {{ (filters.rows.find((ii: any) => ii.id === article.classifyId)?.name) ?? '' }}
              </span>
              <div class="blog-article-info">
                <span class="blog-article-info-item">
                  <Calendar class="blog-icon-sm" />
                  {{ date(article.createTime) }}
                </span>
                <span class="blog-article-info-item">
                  <Clock class="blog-icon-sm" />
                  {{ article.readTime }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="blog-article-content">
              <h2 class="blog-article-title">
                {{ article.title }}
              </h2>
              <p class="blog-article-desc">
                {{ article.describe }}
              </p>
            </div>

            <!-- Action -->
            <div class="blog-article-action">
              <span class="blog-read-more"> 阅读全文 </span>
              <div class="blog-action-icon-wrap">
                <ChevronRight class="blog-action-icon" />
              </div>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </div>

    <nav
      v-if="!isArticlesLoading && articleTotal > pageSize"
      v-motion
      :initial="{ opacity: 0, y: 16 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 520, delay: 120 } }"
      class="blog-pagination"
      aria-label="文章分页"
    >
      <button
        type="button"
        class="blog-pagination-arrow"
        :disabled="blogStore.currentPage === 1"
        aria-label="上一页"
        @click="changePage(blogStore.currentPage - 1)"
      >
        <ChevronLeft class="blog-pagination-icon" />
      </button>

      <div class="blog-pagination-pages">
        <template v-for="(item, index) in paginationItems" :key="`${item}-${index}`">
          <span v-if="item === 'ellipsis'" class="blog-pagination-ellipsis">...</span>
          <button
            v-else
            type="button"
            class="blog-pagination-page"
            :class="{ 'blog-pagination-page-active': blogStore.currentPage === item }"
            :aria-current="blogStore.currentPage === item ? 'page' : undefined"
            @click="changePage(item)"
          >
            {{ item }}
          </button>
        </template>
      </div>

      <button
        type="button"
        class="blog-pagination-arrow"
        :disabled="blogStore.currentPage === totalPages"
        aria-label="下一页"
        @click="changePage(blogStore.currentPage + 1)"
      >
        <ChevronRight class="blog-pagination-icon" />
      </button>
    </nav>
  </div>
</template>

<style scoped>
.blog-page-container {
  min-height: 80vh;
  padding-top: 3rem; /* py-12 */
  padding-bottom: 3rem;
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 1536px; /* max-w-screen-2xl */
}
@media (min-width: 640px) {
  .blog-page-container {
    padding-left: 3rem; /* sm:px-12 */
    padding-right: 3rem;
  }
}
@media (min-width: 768px) {
  .blog-page-container {
    padding-left: 5rem; /* md:px-20 */
    padding-right: 5rem;
  }
}
@media (min-width: 1024px) {
  .blog-page-container {
    padding-top: 5rem; /* lg:py-20 */
    padding-bottom: 5rem;
    padding-left: 8rem; /* lg:px-32 */
    padding-right: 8rem;
  }
}
@media (min-width: 1280px) {
  .blog-page-container {
    padding-left: 12rem; /* xl:px-48 */
    padding-right: 12rem;
  }
}

.blog-page-container {
  padding-top: 6rem; /* pt-24 overrides py-12/20 top padding */
}
@media (min-width: 1024px) {
  .blog-page-container {
    padding-top: 8rem; /* lg:pt-32 */
  }
}

.blog-header-wrapper {
  margin-bottom: 4rem; /* mb-16 */
}

.blog-title {
  font-size: 2.25rem; /* text-4xl */
  line-height: 2.5rem;
  font-weight: 700; /* font-bold */
  color: var(--color-heading); /* text-slate-900 */
  letter-spacing: -0.025em; /* tracking-tight */
  margin-bottom: 1rem; /* mb-4 */
}
@media (min-width: 768px) {
  .blog-title {
    font-size: 3rem; /* md:text-5xl */
    line-height: 1;
  }
}

.blog-subtitle {
  font-size: 1.125rem; /* text-lg */
  color: var(--color-text); /* text-slate-500 */
  max-width: 42rem; /* max-w-2xl */
}

.blog-filters-wrap {
  position: relative;
  margin-bottom: 3rem; /* mb-12 */
}

.blog-filters-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 2.75rem;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(252, 252, 252, 0), var(--color-background) 64%);
}

.blog-filters-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.75rem; /* gap-3 */
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.125rem 7rem 0.625rem 0;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  cursor: grab;
  user-select: none;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 7rem), transparent calc(100% - 2rem));
  mask-image: linear-gradient(to right, #000 calc(100% - 7rem), transparent calc(100% - 2rem));
}

.blog-filter-more {
  position: absolute;
  top: 0.3125rem;
  right: 0.25rem;
  z-index: 2;
  width: 2.25rem;
  height: 1.875rem;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  opacity: 0.72;
  transition:
    transform 220ms ease,
    opacity 180ms ease;
}

.blog-filter-more:hover {
  transform: translateX(0.125rem);
  opacity: 1;
}

.blog-filter-more-stack {
  position: relative;
  width: 1.35rem;
  height: 1.05rem;
  display: block;
}

.blog-filter-more-stack span {
  position: absolute;
  width: 0.9rem;
  height: 0.9rem;
  border: 1.5px solid rgba(244, 63, 94, 0.72);
  border-radius: 0.2rem;
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(45deg);
}

.blog-filter-more-stack span:nth-child(1) {
  left: 0;
  top: 0.15rem;
  opacity: 0.35;
}

.blog-filter-more-stack span:nth-child(2) {
  left: 0.3rem;
  top: 0.08rem;
  opacity: 0.58;
}

.blog-filter-more-stack span:nth-child(3) {
  left: 0.6rem;
  top: 0;
  opacity: 0.92;
}

:global(html.dark) .blog-filters-wrap::after {
  background: linear-gradient(90deg, rgba(11, 19, 32, 0), var(--color-background) 64%);
}

:global(html.dark) .blog-filter-more {
  opacity: 0.8;
}

:global(html.dark) .blog-filter-more-stack span {
  background: rgba(22, 32, 50, 0.55);
  border-color: rgba(244, 63, 94, 0.82);
}

.blog-filters-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
}

.blog-filters-dragging .blog-filter-btn {
  pointer-events: none;
}

.blog-filters-container::-webkit-scrollbar {
  height: 0;
}

.blog-filters-container::-webkit-scrollbar-track {
  background: transparent;
}

.blog-filters-container::-webkit-scrollbar-thumb {
  background-color: rgba(244, 63, 94, 0.28);
  border-radius: 9999px;
}

.blog-filter-btn {
  flex: 0 0 auto;
  padding-left: 1.25rem; /* px-5 */
  padding-right: 1.25rem;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
  border-radius: 9999px; /* rounded-full */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  white-space: nowrap;
  transition:
    color 220ms ease,
    background-color 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
  border: none;
  cursor: pointer;
}

.blog-filter-active {
  background-color: var(--color-primary); /* bg-rose-500 */
  color: #ffffff; /* text-white */
  box-shadow:
    0 4px 6px -1px rgba(244, 63, 94, 0.2),
    0 2px 4px -2px rgba(244, 63, 94, 0.2); /* shadow-md shadow-rose-500/20 */
}

.blog-filter-inactive {
  background-color: var(--color-card); /* bg-white */
  color: var(--color-text); /* text-slate-600 */
  border: 1px solid var(--color-border);
}
.blog-filter-inactive:hover {
  background-color: var(--color-secondary); /* hover:bg-rose-50 */
  color: var(--color-primary); /* hover:text-rose-500 */
  border-color: rgba(244, 63, 94, 0.18);
  box-shadow: 0 8px 18px -12px rgba(244, 63, 94, 0.35);
}
:global(html.dark) .blog-filter-inactive {
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}
:global(html.dark) .blog-filter-inactive:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.blog-grid-wrapper {
  position: relative;
  width: 100%;
}

.blog-grid-container {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem; /* gap-8 */
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}
@media (min-width: 768px) {
  .blog-grid-container {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .blog-grid-container {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.blog-article-card {
  background: var(--color-card); /* glass-card base */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  transition:
    transform 280ms ease,
    border-color 280ms ease,
    box-shadow 280ms ease,
    background-color 280ms ease;
  width: 100%;
  grid-column: span 1 / span 1;
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.02),
    0 0 rgb(0, 0, 0, 0.02),
    0 8px 30px rgb(0, 0, 0, 0.04);
}
:global(html.dark) .blog-article-card {
  background-color: #162032; /* matching the image dark navy slate */
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
.blog-article-card:hover {
  transform: translateY(-0.375rem);
  border-color: rgba(244, 63, 94, 0.18);
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.03),
    0 20px 25px -5px rgba(244, 63, 94, 0.1),
    0 8px 10px -6px rgba(244, 63, 94, 0.1);
}
:global(html.dark) .blog-article-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.blog-article-inner {
  padding: 1.5rem; /* p-6 */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
@media (min-width: 768px) {
  .blog-article-inner {
    padding: 2rem; /* md:p-8 */
  }
}

.blog-article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem; /* mb-6 */
}

.blog-article-category {
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem;
  border-radius: 9999px; /* rounded-full */
  background-color: var(--color-secondary); /* bg-rose-50 */
  color: var(--color-primary); /* text-rose-600 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
}
:global(html.dark) .blog-article-category {
  background-color: rgba(244, 63, 94, 0.15);
  color: var(--color-primary);
}

.blog-article-info {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  font-size: 0.75rem; /* text-xs */
  color: var(--color-text); /* text-slate-400 */
}

.blog-article-info-item {
  display: flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
}

.blog-icon-sm {
  width: 0.875rem; /* w-3.5 */
  height: 0.875rem; /* h-3.5 */
}

.blog-article-content {
  flex-grow: 1;
}

.blog-article-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
  color: var(--color-heading); /* text-slate-900 */
  margin-bottom: 0.75rem; /* mb-3 */
  transition-property: color;
  transition-duration: 150ms;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.375; /* leading-snug */
}
:global(html.dark) .blog-article-title {
  color: #e2e8f0; /* Brighter white for titles in dark mode */
}
.blog-article-card:hover .blog-article-title {
  color: var(--color-primary); /* group-hover:text-rose-500 */
}

.blog-article-desc {
  color: var(--color-text); /* text-slate-500 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.625; /* leading-relaxed */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
:global(html.dark) .blog-article-desc {
  color: #64748b; /* slate-500 for less contrast in dark mode excerpts */
}

.blog-article-action {
  margin-top: 1.5rem; /* mt-6 */
  padding-top: 1.5rem; /* pt-6 */
  border-top: 1px solid var(--color-border); /* border-slate-100 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:global(html.dark) .blog-article-action {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.blog-read-more {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: var(--color-primary); /* text-rose-500 */
  transition-property: color;
  transition-duration: 150ms;
}
.blog-article-card:hover .blog-read-more {
  color: #e11d48; /* group-hover:text-rose-600 */
}

.blog-action-icon-wrap {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  border-radius: 9999px; /* rounded-full */
  background-color: var(--color-background); /* bg-slate-50 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease;
}
.blog-article-card:hover .blog-action-icon-wrap {
  background-color: var(--color-secondary); /* group-hover:bg-rose-50 */
  box-shadow: 0 8px 18px -12px rgba(244, 63, 94, 0.45);
}
:global(html.dark) .blog-action-icon-wrap {
  background-color: var(--color-heading);
}
:global(html.dark) .blog-article-card:hover .blog-action-icon-wrap {
  background-color: var(--color-primary);
}

.blog-action-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  color: var(--color-text); /* text-slate-400 */
  transition:
    color 180ms ease,
    scale 180ms ease;
}
.blog-article-card:hover .blog-action-icon {
  color: var(--color-primary); /* group-hover:text-rose-500 */
  scale: 1.08;
}
:global(html.dark) .blog-action-icon {
  color: var(--color-background);
}
:global(html.dark) .blog-article-card:hover .blog-action-icon {
  color: #ffffff;
}

.blog-article-skeleton {
  cursor: default;
  pointer-events: none;
}

.blog-article-skeleton:hover {
  transform: none;
}

.blog-skeleton-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.blog-skeleton-pill,
.blog-skeleton-date,
.blog-skeleton-title,
.blog-skeleton-text,
.blog-skeleton-link {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.13), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: blog-skeleton-shimmer 1.5s ease-in-out infinite;
}

.blog-skeleton-pill {
  width: 4.5rem;
  height: 1.5rem;
}

.blog-skeleton-date {
  width: 8.25rem;
  height: 1rem;
}

.blog-skeleton-title {
  width: 86%;
  height: 1.5rem;
  margin-bottom: 1.25rem;
}

.blog-skeleton-text {
  width: 100%;
  height: 0.875rem;
  margin-bottom: 0.75rem;
}

.blog-skeleton-text-short {
  width: 68%;
}

.blog-skeleton-divider {
  width: 100%;
  height: 1px;
  margin: 2rem 0 1.5rem;
  background: var(--color-border);
}

.blog-skeleton-link {
  width: 5.75rem;
  height: 1rem;
}

.blog-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
  padding: 0.5rem;
}

.blog-pagination-pages {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.56);
  box-shadow:
    0 16px 40px -30px rgba(15, 23, 42, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.blog-pagination-arrow,
.blog-pagination-page {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    transform 200ms ease,
    color 200ms ease,
    border-color 200ms ease,
    background-color 200ms ease,
    box-shadow 200ms ease;
}

.blog-pagination-arrow:hover:not(:disabled),
.blog-pagination-page:hover {
  transform: translateY(-0.125rem);
  color: var(--color-primary);
  border-color: rgba(244, 63, 94, 0.2);
  background: rgba(255, 241, 242, 0.86);
  box-shadow: 0 14px 24px -18px rgba(244, 63, 94, 0.55);
}

.blog-pagination-page-active {
  color: #ffffff;
  border-color: transparent;
  background: var(--color-primary);
  box-shadow:
    0 14px 26px -16px rgba(244, 63, 94, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}

.blog-pagination-page-active:hover {
  color: #ffffff;
  background: var(--color-primary);
}

.blog-pagination-arrow:disabled {
  cursor: not-allowed;
  opacity: 0.38;
  transform: none;
}

.blog-pagination-icon {
  width: 1rem;
  height: 1rem;
}

.blog-pagination-ellipsis {
  min-width: 1.5rem;
  color: var(--color-text);
  text-align: center;
  font-weight: 600;
  opacity: 0.55;
}

:global(html.dark) .blog-pagination-pages {
  background: rgba(22, 32, 50, 0.62);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 16px 38px -30px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

:global(html.dark) .blog-pagination-arrow,
:global(html.dark) .blog-pagination-page {
  background: rgba(22, 32, 50, 0.7);
  border-color: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

:global(html.dark) .blog-pagination-arrow:hover:not(:disabled),
:global(html.dark) .blog-pagination-page:hover {
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(244, 63, 94, 0.24);
  color: var(--color-primary);
}

:global(html.dark) .blog-pagination-page-active,
:global(html.dark) .blog-pagination-page-active:hover {
  color: #ffffff;
  background: var(--color-primary);
  border-color: transparent;
}

@media (max-width: 640px) {
  .blog-pagination {
    gap: 0.5rem;
    margin-top: 2.25rem;
  }

  .blog-pagination-pages {
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .blog-pagination-arrow,
  .blog-pagination-page {
    width: 2.25rem;
    height: 2.25rem;
  }
}

/* Transition classes from previous version */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

.list-leave-active {
  display: none;
}

@keyframes blog-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-skeleton-pill,
  .blog-skeleton-date,
  .blog-skeleton-title,
  .blog-skeleton-text,
  .blog-skeleton-link {
    animation: none;
  }
}
</style>
