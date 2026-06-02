<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { listArticles, getClassifyIdList } from '@/api/blog'
import type { ArticleSummary } from '@/types/content'
import { date } from '@/utils/date'
import { useBlogStore } from '@/stores/blog'
import { registerRouteTransitionCleanup } from '@/utils/route-transition-cleanup'

const router = useRouter()
const blogStore = useBlogStore()
const blogRoot = ref<HTMLElement | null>(null)
const activeFilter = ref('全部')
const filters = reactive({
  rows: [{ id: '全部', name: '全部', value: '0' }], // 默认添加一个“全部”分类
  total: 0,
});

const articles = ref<ArticleSummary[]>([])
const isArticlesLoading = ref(true)
const hasLoadedArticles = ref(false)
const hasCheckedArticles = ref(false)
const articleTotal = ref(0)
const pageSize = 6
const filterScroller = ref<HTMLElement | null>(null)
const filterGlow = ref<HTMLElement | null>(null)
const canScrollFilterRight = ref(false)
const filterDrag = reactive({
  isDown: false,
  startX: 0,
  scrollLeft: 0,
  hasMoved: false,
})
let filterPreventClickUntil = 0
let scrollCtx: gsap.Context | undefined
let unregisterTransitionCleanup: (() => void) | undefined
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
const isMobileViewport = () => window.matchMedia?.('(max-width: 640px)').matches ?? false
const shouldAnimateBlogFilters = () => !prefersReducedMotion() && !isMobileViewport()

const blogFiltersMotionInitial = () => {
  if (!shouldAnimateBlogFilters()) return { opacity: 1, y: 0 }

  return { opacity: 0, y: 24 }
}

const blogFiltersMotionEnter = () => {
  if (!shouldAnimateBlogFilters()) {
    return { opacity: 1, y: 0, transition: { duration: 0 } }
  }

  return { opacity: 1, y: 0, transition: { duration: 820 } }
}

onMounted(async () => {
  await classify();
  await nextTick()
  updateFilterOverflow()
  updateFilterGlow(true)
  setupBlogParallax()
  if (filters.total > 0) {
    await loadArticles(blogStore.currentPage)
  } else {
    isArticlesLoading.value = false
    hasLoadedArticles.value = true
  }
  window.addEventListener('resize', updateFilterOverflow)
  window.addEventListener('resize', updateFilterGlowOnResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateFilterOverflow)
  window.removeEventListener('resize', updateFilterGlowOnResize)
  unregisterTransitionCleanup?.()
})


const classify = async () => {
  const res = await getClassifyIdList({}) as { rows: Array<{ id: string; name: string; value: string }>; total: number }
  const allFilter = filters.rows[0]
  if (allFilter) {
    allFilter.value = String(res.total)
  }
  filters.rows.push(...res.rows)
  filters.total = res.total
  articleTotal.value = res.total
  hasCheckedArticles.value = true
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
    ...(activeFilter.value === '全部' ? {} : { id: activeFilter.value }),
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
    hasLoadedArticles.value = true
    await nextTick()
    await playArticleListEnterAnimation()
    ScrollTrigger.refresh()
  }
}

const playArticleListEnterAnimation = () => {
  if (!blogRoot.value || prefersReducedMotion() || isMobileViewport()) return Promise.resolve()

  const grid = blogRoot.value.querySelector<HTMLElement>('.blog-grid-container')
  if (!grid) return Promise.resolve()

  return new Promise<void>((resolve) => {
    gsap.fromTo(
      grid,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        ease: 'power2.out',
        overwrite: true,
        onComplete: () => {
          gsap.set(grid, { clearProps: 'transform' })
          resolve()
        },
      },
    )
  })
}

const setupBlogParallax = () => {
  unregisterTransitionCleanup?.()
  scrollCtx?.revert()

  if (!blogRoot.value || prefersReducedMotion()) return

  scrollCtx = gsap.context(() => {
    const header = blogRoot.value?.querySelector('.blog-header-wrapper')
    const filters = blogRoot.value?.querySelector('.blog-filters-wrap')
    const grid = blogRoot.value?.querySelector('.blog-grid-wrapper')
    const depthGlowTop = blogRoot.value?.querySelector('.blog-depth-glow-top')
    const depthGlowBottom = blogRoot.value?.querySelector('.blog-depth-glow-bottom')

    if (header) {
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
    }

    if (filters) {
      gsap.fromTo(
        filters,
        { y: 0 },
        {
          y: -20,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: filters,
            start: 'top 20%',
            end: 'bottom 8%',
            scrub: 0.7,
          },
        },
      )
    }

    if (grid) {
      gsap.fromTo(
        grid,
        { y: 58 },
        {
          y: -44,
          ease: 'none',
          scrollTrigger: {
            trigger: grid,
            start: 'top 92%',
            end: 'top 24%',
            scrub: 0.72,
          },
        },
      )
    }

    if (depthGlowTop) {
      gsap.to(depthGlowTop, {
        y: 150,
        x: -36,
        scaleX: 1.18,
        scaleY: 1.18,
        ease: 'none',
        scrollTrigger: {
          trigger: blogRoot.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      })
    }

    if (depthGlowBottom) {
      gsap.to(depthGlowBottom, {
        y: -180,
        x: 48,
        scaleX: 0.86,
        scaleY: 0.86,
        ease: 'none',
        scrollTrigger: {
          trigger: blogRoot.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.15,
        },
      })
    }
  }, blogRoot.value)

  unregisterTransitionCleanup = registerRouteTransitionCleanup(() => {
    scrollCtx?.revert()
    scrollCtx = undefined
    unregisterTransitionCleanup = undefined
  })

  ScrollTrigger.refresh()
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
  updateFilterGlow()
}

const updateFilterGlow = (immediate = false) => {
  const scroller = filterScroller.value
  const glow = filterGlow.value
  if (!scroller || !glow) return

  const activeButton = scroller.querySelector<HTMLElement>('.blog-filter-active')
  if (!activeButton) return

  const x = activeButton.offsetLeft
  const width = activeButton.offsetWidth
  const height = activeButton.offsetHeight
  const y = activeButton.offsetTop

  gsap.to(glow, {
    x,
    y,
    width,
    height,
    autoAlpha: 1,
    duration: immediate || prefersReducedMotion() ? 0 : 0.36,
    ease: 'power3.out',
    overwrite: true,
  })
}

const updateFilterGlowOnResize = () => {
  updateFilterOverflow()
  updateFilterGlow(true)
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
  articles.value = []
  articleTotal.value = 0
  await nextTick()
  updateFilterGlow()
  await loadArticles(1)
}

const openArticle = (article: ArticleSummary) => {
  blogStore.setCoverUrl(article.coverUrl || '')
  router.push({ path: `/blog/${article.id}` })
}
</script>

<template>
  <div ref="blogRoot" class="blog-page-container">
    <div class="blog-depth-glow blog-depth-glow-top" aria-hidden="true"></div>
    <div class="blog-depth-glow blog-depth-glow-bottom" aria-hidden="true"></div>

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
      :initial="blogFiltersMotionInitial()"
      :enter="blogFiltersMotionEnter()"
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
        <span ref="filterGlow" class="blog-filter-glow" aria-hidden="true"></span>
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
      <div v-if="isArticlesLoading && !hasCheckedArticles" class="blog-checking-state" aria-live="polite" aria-busy="true" aria-label="加载内容">
        <span class="blog-checking-dot"></span>
      </div>
      <div v-else-if="isArticlesLoading && !hasLoadedArticles && articleTotal > 0" class="blog-grid-container" aria-live="polite" aria-busy="true">
        <article v-for="item in Math.min(articleTotal || pageSize, pageSize)" :key="item" class="blog-article-card blog-article-skeleton">
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
      <div v-else-if="isArticlesLoading" class="blog-empty-state blog-updating-state" aria-live="polite" aria-busy="true">
        <p class="blog-empty-title">正在更新</p>
        <p class="blog-empty-desc">新的内容马上就好。</p>
        <span class="blog-updating-dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </div>
      <div v-else-if="hasLoadedArticles && filteredArticles.length === 0" class="blog-empty-state" aria-live="polite">
        <p class="blog-empty-title">暂无文章</p>
        <p class="blog-empty-desc">新的内容整理好后会出现在这里。</p>
      </div>
      <TransitionGroup
        v-else
        :name="undefined"
        tag="div"
        class="blog-grid-container"
        :class="{ 'blog-grid-container-updating': isArticlesLoading }"
        :aria-busy="isArticlesLoading"
      >
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
                  <Eye class="blog-icon-sm" />
                  {{ article.Views ?? 0 }}
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
      v-if="hasLoadedArticles && articleTotal > pageSize"
      v-motion
      :initial="{ opacity: 0, y: 16 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 520, delay: 120 } }"
      class="blog-pagination"
      :class="{ 'blog-pagination-updating': isArticlesLoading }"
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
  position: relative;
  overflow: hidden;
  padding-top: 3rem; /* py-12 */
  padding-bottom: 3rem;
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 1536px; /* max-w-screen-2xl */
}

.blog-header-wrapper,
.blog-filters-wrap,
.blog-grid-wrapper,
.blog-depth-glow {
  will-change: transform;
}

.blog-depth-glow {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  border-radius: 9999px;
  filter: blur(90px);
  opacity: 0.48;
}

.blog-depth-glow-top {
  top: 2rem;
  right: 8%;
  width: min(36vw, 28rem);
  height: min(36vw, 28rem);
  background: rgba(244, 63, 94, 0.14);
}

.blog-depth-glow-bottom {
  top: 26rem;
  left: 5%;
  width: min(30vw, 23rem);
  height: min(30vw, 23rem);
  background: rgba(147, 197, 253, 0.22);
}

:global(html.dark .blog-depth-glow-top) {
  opacity: 0.2;
  background: rgba(244, 63, 94, 0.2);
}

:global(html.dark .blog-depth-glow-bottom) {
  opacity: 0.16;
  background: rgba(59, 130, 246, 0.2);
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
  margin-bottom: 3.5rem; /* mb-16 */
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
  width: 3.5rem;
  height: 2.75rem;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(252, 252, 252, 0), var(--color-background) 82%);
}

.blog-filters-container {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  gap: 0.75rem; /* gap-3 */
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.125rem 3.75rem 0.625rem 0;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
  cursor: grab;
  user-select: none;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  -webkit-mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 3.75rem), transparent 100%);
  mask-image: linear-gradient(to right, #000 0, #000 calc(100% - 3.75rem), transparent 100%);
}

.blog-filter-glow {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  border-radius: 9999px;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(135deg, #f43f5e, #fb3d66);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.22) inset;
  will-change: transform, width, height;
}

.blog-filter-more {
  position: absolute;
  top: 0.375rem;
  right: 0.5rem;
  z-index: 2;
  width: 1.625rem;
  height: 1.625rem;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  opacity: 0.52;
  transition:
    transform 220ms ease,
    opacity 180ms ease;
}

.blog-filter-more:hover {
  transform: translateX(0.1rem);
  opacity: 0.82;
}

.blog-filter-more-stack {
  width: 1.125rem;
  height: 0.875rem;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.1875rem;
}

.blog-filter-more-stack span {
  display: block;
  width: 100%;
  height: 0.125rem;
  border: 0;
  border-radius: 9999px;
  background: rgba(100, 116, 139, 0.58);
  transform-origin: center;
  transition:
    background-color 200ms ease,
    transform 220ms ease,
    opacity 200ms ease;
}

.blog-filter-more-stack span:nth-child(1) {
  opacity: 0.46;
}

.blog-filter-more-stack span:nth-child(2) {
  opacity: 0.72;
}

.blog-filter-more-stack span:nth-child(3) {
  opacity: 0.92;
}

.blog-filter-more:hover .blog-filter-more-stack span {
  background: rgba(244, 63, 94, 0.68);
}

.blog-filter-more:hover .blog-filter-more-stack span:nth-child(2) {
  transform: translateX(0.125rem);
}

:global(html.dark .blog-filters-wrap::after){
  background: linear-gradient(90deg, rgba(11, 19, 32, 0), var(--color-background) 82%);
}

:global(html.dark .blog-filter-more){
  color: #94a3b8;
  opacity: 0.58;
}

:global(html.dark .blog-filter-more-stack span){
  background: rgba(148, 163, 184, 0.62);
}

:global(html.dark .blog-filter-more:hover .blog-filter-more-stack span){
  background: rgba(244, 63, 94, 0.72);
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
  position: relative;
  z-index: 1;
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
    background-color 180ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
  border: none;
  cursor: pointer;
}

.blog-filter-btn:focus {
  outline: none;
}

.blog-filter-btn:focus-visible {
  outline: 1px solid rgba(244, 63, 94, 0.36);
  outline-offset: 2px;
}

.blog-filter-active {
  background-color: transparent; /* active background follows .blog-filter-glow */
  color: #ffffff;
  font-weight: 600;
  box-shadow: none;
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
:global(html.dark .blog-filter-inactive){
  background-color: rgba(255, 255, 255, 0.018);
  border-color: transparent;
  color: #cbd5e1;
}
:global(html.dark .blog-filter-inactive:hover){
  background-color: rgba(244, 63, 94, 0.055);
  border-color: rgba(244, 63, 94, 0.16);
}
:global(html.dark .blog-filter-btn:focus-visible){
  outline-color: rgba(244, 63, 94, 0.42);
}

.blog-grid-wrapper {
  position: relative;
  width: 100%;
  margin-top: 3rem;
}

.blog-grid-loading {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(244, 63, 94, 0.12);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 12px 24px -18px rgba(244, 63, 94, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  pointer-events: none;
}

.blog-grid-loading-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: var(--color-primary);
  animation: blog-loading-pulse 0.9s ease-in-out infinite alternate;
}

:global(html.dark .blog-grid-loading){
  background: rgba(22, 32, 50, 0.74);
  border-color: rgba(244, 63, 94, 0.18);
  box-shadow: 0 16px 28px -20px rgba(0, 0, 0, 0.7);
}

.blog-grid-container {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem; /* gap-8 */
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
}

.blog-empty-state {
  position: relative;
  min-height: clamp(12rem, 28vh, 18rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  isolation: isolate;
}

.blog-empty-state::before {
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

.blog-empty-state::after {
  content: '';
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 1rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.38;
}

.blog-updating-state::after {
  display: none;
}

.blog-updating-state {
  opacity: 0.62;
}

.blog-updating-state .blog-empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.blog-updating-state .blog-empty-desc {
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  opacity: 0.72;
}

.blog-updating-dots {
  margin-top: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.32rem;
}

.blog-updating-dots span {
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.42;
  animation: blog-updating-bounce 1.05s ease-in-out infinite;
}

.blog-updating-dots span:nth-child(2) {
  animation-delay: 0.12s;
}

.blog-updating-dots span:nth-child(3) {
  animation-delay: 0.24s;
}

.blog-checking-state {
  min-height: clamp(12rem, 28vh, 18rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-checking-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: var(--color-primary);
  opacity: 0.45;
  animation: blog-checking-pulse 0.9s ease-in-out infinite alternate;
}

.blog-empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-heading);
}

.blog-empty-desc {
  margin: 0.5rem 0 0;
  font-size: 0.9375rem;
  color: var(--color-text);
}

:global(html.dark .blog-empty-title){
  color: #e2e8f0;
}

:global(html.dark .blog-empty-state::before){
  opacity: 0.32;
}

.blog-grid-container-updating {
  opacity: 0.72;
  filter: saturate(0.92);
  transition:
    opacity 180ms ease,
    filter 180ms ease;
  pointer-events: none;
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
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 17.75rem;
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
:global(html.dark .blog-article-card) {
  background: rgba(218, 223, 230, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
.blog-article-card:hover {
  transform: translateY(-0.375rem);
  border-color: rgba(244, 63, 94, 0.18);
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.03),
    0 20px 25px -5px rgba(244, 63, 94, 0.1),
    0 8px 10px -6px rgba(244, 63, 94, 0.1);
}
:global(html.dark .blog-article-card:hover) {
  background: rgba(218, 223, 230, 0.07);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.36);
  border-color: rgba(255, 255, 255, 0.12);
}

.blog-article-inner {
  padding: 1.5rem; /* p-6 */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
@media (min-width: 768px) {
  .blog-article-inner {
    padding: 2rem 2rem 1.5rem; /* md:p-8 */
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
  background-color: var(--color-secondary);
  color: var(--color-primary);
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
  border: 1px solid rgba(244, 63, 94, 0.14);
  box-shadow: 0 8px 18px -16px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
:global(html.dark .blog-article-category){
  background-color: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.2);
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
  min-height: calc(1.25rem * 1.375 * 2);
}
:global(html.dark .blog-article-title){
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  min-height: calc(0.875rem * 1.625 * 2);
}
:global(html.dark .blog-article-desc){
  color: #64748b; /* slate-500 for less contrast in dark mode excerpts */
}

.blog-article-action {
  margin-top: 1rem; /* mt-6 */
  padding-top: 1rem; /* pt-6 */
  border-top: 1px solid var(--color-border); /* border-slate-100 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:global(html.dark .blog-article-action){
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
:global(html.dark .blog-action-icon-wrap){
  background-color: var(--color-heading);
}
:global(html.dark .blog-article-card:hover .blog-action-icon-wrap){
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
:global(html.dark .blog-action-icon){
  color: var(--color-background);
}
:global(html.dark .blog-article-card:hover .blog-action-icon){
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

.blog-pagination-updating {
  opacity: 0.58;
  pointer-events: none;
  transition: opacity 180ms ease;
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

:global(html.dark .blog-pagination-pages) {
  background: rgba(218, 223, 230, 0.045);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 16px 38px -30px rgba(0, 0, 0, 0.72),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

:global(html.dark .blog-pagination-arrow),
:global(html.dark .blog-pagination-page) {
  background: rgba(218, 223, 230, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
}

:global(html.dark .blog-pagination-arrow:hover:not(:disabled)),
:global(html.dark .blog-pagination-page:hover) {
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(244, 63, 94, 0.24);
  color: var(--color-primary);
  box-shadow: 0 14px 24px -18px rgba(244, 63, 94, 0.45);
}

:global(html.dark .blog-pagination-page-active),
:global(html.dark .blog-pagination-page-active:hover) {
  color: #ffffff;
  background: var(--color-primary);
  border-color: transparent;
  box-shadow:
    0 14px 26px -18px rgba(244, 63, 94, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

:global(html.dark .blog-pagination-arrow:disabled) {
  color: rgba(203, 213, 225, 0.42);
  background: rgba(218, 223, 230, 0.035);
}

:global(html.dark .blog-pagination-ellipsis) {
  color: rgba(203, 213, 225, 0.62);
}

@media (max-width: 640px) {
  .blog-grid-wrapper {
    margin-top: 2rem;
  }

  .blog-grid-container {
    gap: 0.75rem;
  }

  .blog-article-card {
    min-height: 0;
    border-radius: 1rem;
  }

  .blog-article-inner {
    padding: 1rem;
  }

  .blog-article-meta {
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .blog-article-info {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .blog-article-title,
  .blog-article-desc {
    min-height: 0;
  }

  .blog-article-title {
    margin-bottom: 0.45rem;
    font-size: 1rem;
    line-height: 1.45;
  }

  .blog-article-desc {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .blog-article-action {
    display: none;
  }

  .blog-article-skeleton .blog-skeleton-divider,
  .blog-article-skeleton .blog-skeleton-link {
    display: none;
  }

  .blog-filter-more {
    top: 0;
    right: 0;
    width: 44px;
    height: 44px;
  }

  .blog-filter-btn {
    min-height: 2.75rem;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
  }

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
    width: 2.75rem;
    height: 2.75rem;
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
}

.list-leave-to {
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

@keyframes blog-checking-pulse {
  0% {
    opacity: 0.28;
    transform: scale(0.78);
  }
  100% {
    opacity: 0.72;
    transform: scale(1);
  }
}

@keyframes blog-loading-pulse {
  0% {
    opacity: 0.42;
    transform: scale(0.78);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes blog-updating-bounce {
  0%,
  80%,
  100% {
    opacity: 0.36;
    transform: translateY(0) scale(0.9);
  }

  40% {
    opacity: 0.78;
    transform: translateY(-0.18rem) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .blog-skeleton-pill,
  .blog-skeleton-date,
  .blog-skeleton-title,
  .blog-skeleton-text,
  .blog-skeleton-link,
  .blog-checking-dot,
  .blog-grid-loading-dot,
  .blog-updating-dots span {
    animation: none;
  }
}
</style>
