<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Calendar, Clock, ChevronRight } from 'lucide-vue-next'

const router = useRouter()
const activeFilter = ref('全部')
const filters = ['全部', '前端', '设计', '生活']

const articles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践与性能优化',
    date: '2024-03-15',
    readTime: '8 min',
    category: '前端',
    desc: '在现代前端开发中，保持代码的简洁与可维护性至关重要。本文将分享在实际项目中总结的一些经验和技巧，帮助你写出更优雅的 Vue 3 代码。',
  },
  {
    id: 2,
    title: '如何构建一个现代化的博客系统',
    date: '2024-02-28',
    readTime: '12 min',
    category: '前端',
    desc: '从零开始，使用 Vue 3、Vite 和 Tailwind CSS 搭建一个高性能、响应式且具有极佳交互体验的个人博客。',
  },
  {
    id: 3,
    title: '极简主义在数字产品设计中的应用',
    date: '2024-01-10',
    readTime: '6 min',
    category: '设计',
    desc: '探讨"少即是多"的设计理念，以及如何通过合理的留白、克制的色彩和精致的排版来提升用户体验。',
  },
  {
    id: 4,
    title: '保持热爱的同时避免职业倦怠',
    date: '2023-12-05',
    readTime: '5 min',
    category: '生活',
    desc: '在快节奏的互联网行业中，如何找到工作与生活的平衡点，保持持续的创造力和学习热情。',
  },
  {
    id: 5,
    title: '深入理解 Tailwind CSS 架构哲学',
    date: '2023-11-20',
    readTime: '10 min',
    category: '前端',
    desc: '原子化 CSS 为什么会流行？Tailwind CSS 是如何解决传统 CSS 维护痛点的？本文带你一探究竟。',
  },
]

const filteredArticles = computed(() => {
  if (activeFilter.value === '全部') return articles
  return articles.filter((a) => a.category === activeFilter.value)
})
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
      class="blog-filters-container"
    >
      <button
        v-for="filter in filters"
        :key="filter"
        @click="activeFilter = filter"
        class="blog-filter-btn"
        :class="activeFilter === filter ? 'blog-filter-active' : 'blog-filter-inactive'"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="blog-grid-wrapper">
      <TransitionGroup name="list" tag="div" class="blog-grid-container">
        <article
          v-for="article in filteredArticles"
          :key="article.id"
          @click="router.push(`/blog/${article.id}`)"
          class="blog-article-card group"
        >
          <div class="blog-article-inner">
            <!-- Meta -->
            <div class="blog-article-meta">
              <span class="blog-article-category">
                {{ article.category }}
              </span>
              <div class="blog-article-info">
                <span class="blog-article-info-item">
                  <Calendar class="blog-icon-sm" />
                  {{ article.date }}
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
                {{ article.desc }}
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

.blog-filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* gap-3 */
  margin-bottom: 3rem; /* mb-12 */
}

.blog-filter-btn {
  padding-left: 1.25rem; /* px-5 */
  padding-right: 1.25rem;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
  border-radius: 9999px; /* rounded-full */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  transition-property: all;
  transition-duration: 300ms;
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
  transition-property: all;
  transition-duration: 300ms;
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
  transform: translateY(-0.5rem);
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.03),
    0 20px 25px -5px rgb(244, 63, 94, 0.1),
    0 8px 10px -6px rgb(244, 63, 94, 0.1);
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
  background-color: var(--color-primary);
  color: #ffffff;
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
  transition-property: background-color;
  transition-duration: 150ms;
}
.blog-article-card:hover .blog-action-icon-wrap {
  background-color: var(--color-secondary); /* group-hover:bg-rose-50 */
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
  transition-property: color;
  transition-duration: 150ms;
}
.blog-article-card:hover .blog-action-icon {
  color: var(--color-primary); /* group-hover:text-rose-500 */
}
:global(html.dark) .blog-action-icon {
  color: var(--color-background);
}
:global(html.dark) .blog-article-card:hover .blog-action-icon {
  color: #ffffff;
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
</style>
