<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calendar, Clock, ChevronLeft, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const articleId = route.params.id

// Simulated article data fetching based on ID
const article = ref({
  title: 'Vue 3 组合式 API 最佳实践与性能优化',
  date: '2024-03-15',
  readTime: '8 min',
  category: '前端',
  coverImage:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20workspace%20with%20code%20on%20a%20screen%2C%20soft%20morning%20light%2C%20clean%20aesthetic&image_size=landscape_16_9',
  content: `
## 引言

在现代前端开发中，保持代码的简洁与可维护性至关重要。Vue 3 的组合式 API（Composition API）为我们提供了一种全新的代码组织方式，它不仅打破了 Vue 2 选项式 API（Options API）在逻辑复用上的局限，还在 TypeScript 支持和性能优化上带来了显著的提升。

本文将分享在实际项目中总结的一些经验和技巧，帮助你写出更优雅、更高性能的 Vue 3 代码。

---

## 1. 逻辑复用：自定义 Hook 的艺术

组合式 API 最大的魅力在于提取和复用逻辑。通过编写自定义 Hook（或称为 Composables），我们可以将复杂的业务逻辑从组件中剥离出来。

### 为什么需要自定义 Hook？

在 Vue 2 中，我们通常使用 Mixins 来复用逻辑，但 Mixins 存在命名冲突、来源不清晰等问题。自定义 Hook 通过闭包和函数调用的方式，完美解决了这些痛点。

\`\`\`typescript
// useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}
\`\`\`

---

## 2. 响应式系统：ref vs reactive

在 Vue 3 中，\`ref\` 和 \`reactive\` 是创建响应式状态的两个核心 API。初学者经常会纠结在什么时候该用哪一个。

### 最佳实践建议

1. **基础类型**（如 \`string\`, \`number\`, \`boolean\`）必须使用 \`ref\`。
2. **引用类型**（如 \`object\`, \`array\`）建议统一使用 \`ref\`，通过 \`.value\` 重新赋值不会丢失响应式。
3. 只有当你非常明确需要一个深层响应式的对象，且不需要重新赋值整个对象时，才使用 \`reactive\`。

> **提示**：在 Vue 3.2 引入 \`<script setup>\` 之后，\`ref\` 的 \`.value\` 拆包已经变得非常智能和便捷，统一使用 \`ref\` 可以降低心智负担。

---

## 3. 性能优化：避免不必要的计算

### 巧用 computed

\`computed\` 具有缓存特性，只有当其依赖的响应式源发生变化时才会重新求值。

\`\`\`typescript
const filteredList = computed(() => {
  // 这里的高开销计算只会在 list 或 filterText 变化时执行
  return list.value.filter(item => item.name.includes(filterText.value))
})
\`\`\`

### 谨慎使用 watch

\`watch\` 应该主要用于处理**副作用**（如 API 请求、DOM 操作等）。如果是基于现有状态派生出新的状态，应该优先考虑 \`computed\`。

---

## 结语

Vue 3 的组合式 API 为我们打开了前端架构的新世界大门。"少即是多"（Less is More），掌握这些核心 API 的最佳实践，能够让我们的代码更加健壮、易读和高效。

希望这篇文章能对你的日常开发有所启发。持续学习，持续重构，代码不止！
  `,
})

const goBack = () => {
  router.push('/blog')
}
</script>

<template>
  <div class="blog-post-page">
    <!-- Hero Header - Full Width, Partial Height -->
    <header class="post-hero-header">
      <!-- Cover Image -->
      <img :src="article.coverImage" alt="Cover" class="post-cover-image" />
      <!-- Gradient Overlay (Darker at bottom for text readability) -->
      <div class="post-gradient-overlay"></div>

      <!-- Back Button -->
      <div class="post-back-btn-wrap">
        <button @click="goBack" class="post-back-btn">
          <ArrowLeft class="post-icon-sm" />
          返回文章列表
        </button>
      </div>

      <!-- Title & Meta -->
      <div class="post-header-content">
        <div class="post-header-inner">
          <span
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            class="post-category-badge"
          >
            {{ article.category }}
          </span>
          <h1
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
            class="post-main-title"
          >
            {{ article.title }}
          </h1>

          <div
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { duration: 800, delay: 300 } }"
            class="post-meta-info"
          >
            <span class="post-meta-item">
              <Calendar class="post-meta-icon" />
              {{ article.date }}
            </span>
            <span class="post-meta-item">
              <Clock class="post-meta-icon" />
              {{ article.readTime }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area - Optimal Reading Width -->
    <main class="post-main-area">
      <!-- Top decorative gradient panel spanning article width -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 400 } }"
        class="post-top-gradient-panel"
      ></div>

      <!-- Main content container -->
      <article
        v-motion
        :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 500 } }"
        class="post-article-container"
      >
        <!-- Markdown Content (Simulated with raw HTML for now, would normally use a markdown parser) -->
        <div class="prose">
          <h2 id="introduction">引言</h2>
          <p>
            在现代前端开发中，保持代码的简洁与可维护性至关重要。Vue 3 的组合式 API（Composition
            API）为我们提供了一种全新的代码组织方式，它不仅打破了 Vue 2 选项式 API（Options
            API）在逻辑复用上的局限，还在 TypeScript 支持和性能优化上带来了显著的提升。
          </p>
          <p>
            本文将分享在实际项目中总结的一些经验和技巧，帮助你写出更优雅、更高性能的 Vue 3 代码。
          </p>
          <hr />

          <h2 id="section-1">1. 逻辑复用：自定义 Hook 的艺术</h2>
          <p>
            组合式 API 最大的魅力在于提取和复用逻辑。通过编写自定义 Hook（或称为
            Composables），我们可以将复杂的业务逻辑从组件中剥离出来。
          </p>

          <h3>为什么需要自定义 Hook？</h3>
          <p>
            在 Vue 2 中，我们通常使用 Mixins 来复用逻辑，但 Mixins
            存在命名冲突、来源不清晰等问题。自定义 Hook
            通过闭包和函数调用的方式，完美解决了这些痛点。
          </p>

          <pre><code class="language-typescript">// useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}
</code></pre>

          <hr />
          <h2 id="section-2">2. 响应式系统：ref vs reactive</h2>
          <p>
            在 Vue 3 中，<code>ref</code> 和 <code>reactive</code> 是创建响应式状态的两个核心
            API。初学者经常会纠结在什么时候该用哪一个。
          </p>

          <h3>最佳实践建议</h3>
          <ol>
            <li>
              <strong>基础类型</strong>（如 <code>string</code>, <code>number</code>,
              <code>boolean</code>）必须使用 <code>ref</code>。
            </li>
            <li>
              <strong>引用类型</strong>（如 <code>object</code>, <code>array</code>）建议统一使用
              <code>ref</code>，通过 <code>.value</code> 重新赋值不会丢失响应式。
            </li>
            <li>
              只有当你非常明确需要一个深层响应式的对象，且不需要重新赋值整个对象时，才使用
              <code>reactive</code>。
            </li>
          </ol>

          <blockquote>
            <p>
              <strong>提示</strong>：在 Vue 3.2 引入 <code>&lt;script setup&gt;</code> 之后，<code
                >ref</code
              >
              的 <code>.value</code> 拆包已经变得非常智能和便捷，统一使用
              <code>ref</code> 可以降低心智负担。
            </p>
          </blockquote>

          <hr />
          <h2 id="section-3">3. 性能优化：避免不必要的计算</h2>

          <h3>巧用 computed</h3>
          <p><code>computed</code> 具有缓存特性，只有当其依赖的响应式源发生变化时才会重新求值。</p>
          <pre><code class="language-typescript">const filteredList = computed(() => {
  // 这里的高开销计算只会在 list 或 filterText 变化时执行
  return list.value.filter(item => item.name.includes(filterText.value))
})
</code></pre>

          <h3>谨慎使用 watch</h3>
          <p>
            <code>watch</code> 应该主要用于处理<strong>副作用</strong>（如 API 请求、DOM
            操作等）。如果是基于现有状态派生出新的状态，应该优先考虑 <code>computed</code>。
          </p>

          <hr />
          <h2 id="conclusion">结语</h2>
          <p>
            Vue 3 的组合式 API 为我们打开了前端架构的新世界大门。"少即是多"（Less is
            More），掌握这些核心 API 的最佳实践，能够让我们的代码更加健壮、易读和高效。
          </p>
          <p>希望这篇文章能对你的日常开发有所启发。持续学习，持续重构，代码不止！</p>
        </div>
      </article>

      <!-- Bottom Navigation / Share (Optional) -->
      <div class="post-nav-bottom">
        <button class="post-nav-btn">
          <ChevronLeft class="post-icon-sm" />
          上一篇
        </button>
        <button class="post-nav-btn">
          下一篇
          <ChevronRight class="post-icon-sm" />
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.blog-post-page {
  @apply min-h-screen bg-transparent pb-20;
}

.post-hero-header {
  @apply relative w-full h-[50vh] md:h-[60vh] min-h-[400px] overflow-hidden;
}

.post-cover-image {
  @apply absolute inset-0 w-full h-full object-cover object-center;
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

.post-top-gradient-panel {
  @apply w-full h-16 sm:h-24 md:h-32 rounded-t-[2rem] md:rounded-t-[2.5rem] relative overflow-hidden shrink-0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, var(--color-card) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--color-border);
  border-bottom: none;
  /* box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05); */
}
:global(html.dark) .post-top-gradient-panel {
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, var(--color-card) 100%);
  border-color: rgba(255, 255, 255, 0.05);
  /* box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3); */
}

.post-article-container {
  @apply rounded-b-[2rem] md:rounded-b-[2.5rem] p-6 sm:p-10 md:p-16 w-full -mt-[1px] relative z-10;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-top: none;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
:global(html.dark) .post-article-container {
  background: var(--color-card);
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
</style>
