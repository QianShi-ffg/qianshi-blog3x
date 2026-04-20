<script setup lang="ts">
import { ArrowUpRight, Github, ExternalLink } from 'lucide-vue-next'

const projects = [
  {
    id: 1,
    title: 'QianShiBlog Space',
    category: '个人网站',
    desc: '基于 Vue 3 + Tailwind CSS 的现代极简主义个人博客，具有出色的动画和交互体验。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20clean%20website%20mockup%2C%20light%20theme%2C%20minimalist%2C%20soft%20red%20accents&image_size=landscape_16_9',
    tags: ['Vue 3', 'Tailwind', 'Vite', 'Motion'],
    github: '#',
    demo: '#',
  },
  {
    id: 2,
    title: 'Design System Pro',
    category: '组件库',
    desc: '一套为企业级应用打造的高质量 UI 组件库，包含 50+ 常用组件，支持深度定制。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20collection%20of%20UI%20components%20floating%20in%203D%20space%2C%20clean%2C%20white%20background&image_size=landscape_16_9',
    tags: ['React', 'TypeScript', 'Storybook'],
    github: '#',
    demo: '#',
  },
  {
    id: 3,
    title: 'Weather Minimal',
    category: '移动端应用',
    desc: '一款极简风格的天气应用，提供精准的实时天气和未来天气预报，界面清新优雅。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20weather%20app%20UI%20on%20a%20smartphone%20screen%2C%20pastel%20colors&image_size=landscape_16_9',
    tags: ['React Native', 'Weather API'],
    github: '#',
    demo: '#',
  },
  {
    id: 4,
    title: 'TaskFlow',
    category: '效率工具',
    desc: '面向小团队的敏捷任务管理工具，支持看板、日历和甘特图视图。',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20kanban%20board%20dashboard%20UI%2C%20clean%2C%20modern%2C%20soft%20shadows&image_size=landscape_16_9',
    tags: ['Vue 3', 'Supabase', 'Pinia'],
    github: '#',
    demo: '#',
  },
]
</script>

<template>
  <div class="portfolio-page-container">
    <!-- Header -->
    <div class="portfolio-header-container">
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="portfolio-title"
      >
        精选作品
      </h1>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
        class="portfolio-subtitle"
      >
        将想法转化为现实。以下是我参与开发的一些开源项目和个人作品。
      </p>
    </div>

    <!-- Projects Grid -->
    <div class="portfolio-grid">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 100 } }"
        class="portfolio-card"
      >
        <!-- Project Image -->
        <div class="portfolio-image-wrapper">
          <img :src="project.image" :alt="project.title" class="portfolio-image" />
          <div class="portfolio-overlay">
            <a :href="project.github" target="_blank" class="portfolio-action-btn">
              <Github class="portfolio-icon" />
            </a>
            <a :href="project.demo" target="_blank" class="portfolio-action-btn delayed">
              <ExternalLink class="portfolio-icon" />
            </a>
          </div>
        </div>

        <!-- Project Info -->
        <router-link :to="`/portfolio/${project.id}`" class="block cursor-pointer">
          <div class="portfolio-category-wrapper">
            <span class="portfolio-category-badge">
              {{ project.category }}
            </span>
          </div>

          <h2 class="portfolio-project-title">
            {{ project.title }}
            <ArrowUpRight class="portfolio-arrow-icon" />
          </h2>

          <p class="portfolio-project-desc">
            {{ project.desc }}
          </p>

          <div class="portfolio-tags-wrapper">
            <span v-for="tag in project.tags" :key="tag" class="portfolio-tag-badge">
              {{ tag }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.portfolio-page-container {
  @apply min-h-[80vh] py-12 pt-24 px-6 mx-auto max-w-screen-2xl;
}
@media (min-width: 640px) {
  .portfolio-page-container {
    @apply px-12;
  }
}
@media (min-width: 768px) {
  .portfolio-page-container {
    @apply px-20;
  }
}
@media (min-width: 1024px) {
  .portfolio-page-container {
    @apply py-20 pt-32 px-32;
  }
}
@media (min-width: 1280px) {
  .portfolio-page-container {
    @apply px-48;
  }
}

.portfolio-header-container {
  @apply mb-16;
}

.portfolio-title {
  @apply text-4xl font-bold text-slate-900 tracking-tight mb-4;
}
@media (min-width: 768px) {
  .portfolio-title {
    @apply text-5xl;
  }
}

.portfolio-subtitle {
  @apply text-lg text-slate-500 max-w-2xl;
}

.portfolio-grid {
  @apply grid grid-cols-1 gap-12;
}
@media (min-width: 1024px) {
  .portfolio-grid {
    @apply grid-cols-2 gap-16;
  }
}

.portfolio-card {
}

.portfolio-image-wrapper {
  @apply relative overflow-hidden rounded-3xl aspect-[16/10] mb-8 bg-white/70 backdrop-blur-lg border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300;
}

.portfolio-image {
  @apply w-full h-full object-cover transition-transform duration-700;
}

.portfolio-card:hover .portfolio-image {
  @apply scale-105;
}

.portfolio-overlay {
  @apply absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 flex items-center justify-center gap-4;
}

.portfolio-card:hover .portfolio-overlay {
  @apply opacity-100;
}

.portfolio-action-btn {
  @apply w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-900 transition-all duration-300 translate-y-4 hover:text-rose-500 hover:scale-110;
}

.portfolio-card:hover .portfolio-action-btn {
  @apply translate-y-0;
}

.portfolio-action-btn.delayed {
  @apply delay-75;
}

.portfolio-icon {
  @apply w-5 h-5;
}

.portfolio-category-wrapper {
  @apply flex items-center gap-3 mb-3;
}

.portfolio-category-badge {
  @apply px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-medium;
}

.portfolio-project-title {
  @apply text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2 transition-colors;
}

.portfolio-card:hover .portfolio-project-title {
  @apply text-rose-500;
}

.portfolio-arrow-icon {
  @apply w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300;
}

.portfolio-card:hover .portfolio-arrow-icon {
  @apply opacity-100 translate-x-0;
}

.portfolio-project-desc {
  @apply text-slate-500 leading-relaxed mb-6;
}

.portfolio-tags-wrapper {
  @apply flex flex-wrap gap-2;
}

.portfolio-tag-badge {
  @apply px-3 py-1 rounded-md bg-slate-50 text-slate-500 text-xs font-medium;
}
</style>
