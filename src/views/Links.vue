<script setup lang="ts">
import { ExternalLink, Github, Twitter, Globe, Link as LinkIcon } from 'lucide-vue-next'

const links = [
  {
    id: 1,
    name: 'Vue.js',
    desc: 'The Progressive JavaScript Framework',
    url: 'https://vuejs.org',
    icon: Globe,
    color: 'cl-text-emerald',
    tags: ['Framework', 'Frontend'],
  },
  {
    id: 2,
    name: 'Tailwind CSS',
    desc: 'A utility-first CSS framework for rapid UI development.',
    url: 'https://tailwindcss.com',
    icon: Globe,
    color: 'cl-text-sky',
    tags: ['CSS', 'Design'],
  },
  {
    id: 3,
    name: 'Evan You',
    desc: 'Creator of Vue & Vite',
    url: 'https://twitter.com/youyuxi',
    icon: Twitter,
    color: 'cl-text-blue',
    tags: [],
  },
  {
    id: 4,
    name: 'Anthony Fu',
    desc: 'Vue/Vite core team member',
    url: 'https://github.com/antfu',
    icon: Github,
    color: 'cl-text-slate',
    tags: [],
  },
  {
    id: 5,
    name: 'Vite',
    desc: 'Next Generation Frontend Tooling',
    url: 'https://vitejs.dev',
    icon: Globe,
    color: 'cl-text-purple',
    tags: ['Tooling', 'Build'],
  },
  {
    id: 6,
    name: 'Lucide',
    desc: 'Beautiful & consistent icon toolkit made by the community.',
    url: 'https://lucide.dev',
    icon: Globe,
    color: 'cl-text-rose',
    tags: ['Icons', 'Design'],
  },
]
</script>

<template>
  <div class="lk-page-container">
    <!-- Header -->
    <div class="lk-header-wrapper">
      <div class="lk-header-text">
        <h1
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="lk-title"
        >
          友情链接
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
          class="lk-subtitle"
        >
          那些有趣的人和他们创造的数字空间。
        </p>
      </div>
      <a
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
        href="#apply"
        class="lk-btn-apply"
      >
        <LinkIcon class="lk-btn-apply-icon" />
        申请互链
      </a>
    </div>

    <!-- Links Grid -->
    <div class="lk-grid">
      <a
        v-for="(link, index) in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
        class="lk-card group"
      >
        <!-- 网站缩略图 (Hover显示) -->
        <div
          class="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl overflow-hidden"
        >
          <img
            :src="`https://image.thum.io/get/width/1200/crop/800/${link.url}`"
            :alt="link.name + ' preview'"
            class="w-full h-full object-cover object-top scale-100 group-hover:scale-110 transition-transform duration-[4s] ease-out opacity-90 blur-[2px] group-hover:blur-0"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-white/20"></div>
        </div>

        <div class="lk-card-inner relative z-10">
          <div class="lk-card-content">
            <div class="lk-icon-wrap">
              <component :is="link.icon" class="lk-icon" :class="link.color" />
            </div>
            <div class="lk-info-wrap">
              <h2 class="lk-link-name">
                {{ link.name }}
                <ExternalLink class="lk-external-icon" />
              </h2>
              <p class="lk-link-desc">{{ link.desc }}</p>
              <!-- <div v-if="link.tags && link.tags.length > 0" class="lk-tags">
                <span v-for="tag in link.tags" :key="tag" class="lk-tag">{{ tag }}</span>
              </div> -->
            </div>
          </div>
        </div>
      </a>
    </div>

    <!-- Apply Section -->
    <div
      id="apply"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: 300 } }"
      class="lk-apply-section"
    >
      <h2 class="lk-apply-title">互链须知</h2>
      <ul class="lk-apply-list">
        <li class="lk-apply-item">
          <div class="lk-apply-dot"></div>
          <div>
            <p>请先在您的网站添加本站链接，信息如下：</p>
            <div class="lk-apply-info-box">
              <p>名称：QianShiBlog</p>
              <p>简介：一个极简主义的前端开发者博客。</p>
              <p>地址：https://QianShiBlog.dev</p>
            </div>
          </div>
        </li>
        <li class="lk-apply-item">
          <div class="lk-apply-dot"></div>
          <p>您的网站需要包含原创内容，且定期更新。</p>
        </li>
        <li class="lk-apply-item">
          <div class="lk-apply-dot"></div>
          <p>不接受包含违法、政治、商业推广等内容的网站。</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.lk-page-container {
  @apply min-h-[80vh] py-12 lg:py-20 lg:pt-32 pt-24 px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 mx-auto max-w-screen-2xl;
}

.lk-header-wrapper {
  @apply mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6;
  align-items: flex-end;
}

.lk-header-text {
  @apply flex flex-col;
}

.lk-btn-apply {
  @apply inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-50 text-rose-500 font-medium hover:bg-rose-100 hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-rose-500/20 self-start sm:self-auto shrink-0;
}

.lk-btn-apply-icon {
  @apply w-4 h-4;
}

.lk-title {
  @apply text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4;
}

.lk-subtitle {
  @apply text-lg text-slate-500 max-w-2xl;
}

.lk-grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20 auto-rows-fr;
}

.lk-card {
  @apply rounded-3xl transition-all duration-500 p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10 h-full flex flex-col justify-center relative overflow-hidden;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}

.lk-card:hover {
  background-color: var(--color-background);
  border-color: rgba(244, 63, 94, 0.2); /* rose-200 equivalent */
}

:global(html.dark) .lk-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.lk-card-inner {
  @apply flex items-center justify-between gap-4 h-full;
  align-items: flex-start;
}

.lk-card-content {
  @apply flex items-center gap-4 w-full;
  align-items: flex-start;
}

.lk-icon-wrap {
  @apply w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-rose-50 transition-colors;
}

.lk-icon {
  @apply w-6 h-6 transition-transform duration-300 group-hover:scale-110;
}

.lk-link-name {
  @apply font-bold text-slate-900 mb-1 group-hover:text-rose-500 transition-colors flex items-center gap-2;
}

.lk-link-name .lk-external-icon {
  @apply w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300;
}

.group:hover .lk-link-name .lk-external-icon {
  @apply opacity-100 translate-x-0;
}

.lk-link-desc {
  @apply text-sm text-slate-500 line-clamp-2 leading-relaxed;
}

.lk-tags {
  @apply flex flex-wrap gap-2 mt-4;
}

.lk-tag {
  @apply text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 text-slate-400;
}

.lk-apply-section {
  @apply rounded-3xl transition-all duration-300 p-8 md:p-12;
  width: 100%;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}
:global(html.dark) .lk-apply-section {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.lk-apply-title {
  @apply text-2xl font-bold text-slate-900 mb-8;
}

.lk-apply-list {
  @apply space-y-6 text-slate-500;
}

.lk-apply-item {
  @apply flex items-start gap-4;
}

.lk-apply-dot {
  @apply w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 shrink-0;
}

.lk-apply-info-box {
  @apply mt-3 space-y-1 text-slate-400;
}

/* Colors */
.cl-text-emerald {
  @apply text-emerald-500;
}
.cl-text-sky {
  @apply text-sky-500;
}
.cl-text-blue {
  @apply text-blue-500;
}
.cl-text-slate {
  @apply text-slate-700;
}
.cl-text-purple {
  @apply text-purple-500;
}
.cl-text-rose {
  @apply text-rose-500;
}
</style>
