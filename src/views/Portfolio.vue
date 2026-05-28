<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-vue-next'
import { listProjects } from '@/api/portfolio'
import type { Project } from '@/types/content'

const projects = ref<Project[]>([])
const isProjectsLoading = ref(true)

onMounted(async () => {
  isProjectsLoading.value = true
  try {
    projects.value = await listProjects()
  } finally {
    isProjectsLoading.value = false
  }
})

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
    <div v-if="isProjectsLoading" class="portfolio-grid" aria-live="polite" aria-busy="true">
      <div v-for="item in 4" :key="item" class="portfolio-card portfolio-card-skeleton">
        <div class="portfolio-image-wrapper portfolio-skeleton-image"></div>
        <div class="portfolio-skeleton-chip"></div>
        <div class="portfolio-skeleton-title"></div>
        <div class="portfolio-skeleton-text"></div>
        <div class="portfolio-skeleton-text portfolio-skeleton-text-short"></div>
        <div class="portfolio-skeleton-tags">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div v-else class="portfolio-grid">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 100 } }"
        class="portfolio-card"
      >
        <!-- Project Image -->
        <div class="portfolio-image-wrapper interactive-media">
          <img :src="project.image" :alt="project.title" class="portfolio-image" />
          <div class="portfolio-overlay">
            <a :href="project.github" target="_blank" class="portfolio-action-btn interactive-lift">
              <Github class="portfolio-icon" />
            </a>
            <a :href="project.demo" target="_blank" class="portfolio-action-btn delayed interactive-lift">
              <ExternalLink class="portfolio-icon" />
            </a>
          </div>
        </div>

        <!-- Project Info -->
        <router-link :to="`/portfolio/${project.id}`" class="portfolio-content-link block cursor-pointer">
          <div class="portfolio-category-wrapper">
            <span class="portfolio-category-badge">
              {{ project.category }}
            </span>
          </div>

          <h2 class="portfolio-project-title">
            {{ project.title }}
            <ArrowUpRight class="portfolio-arrow-icon interactive-arrow" />
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
  @apply text-4xl font-bold tracking-tight mb-4;
  color: var(--color-heading);
}
:global(html.dark) .portfolio-title {
  color: #e2e8f0;
}
@media (min-width: 768px) {
  .portfolio-title {
    @apply text-5xl;
  }
}

.portfolio-subtitle {
  @apply text-lg max-w-2xl;
  color: var(--color-text);
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
  border-radius: 1.5rem;
  padding-bottom: 0.25rem;
  transition: filter 0.3s ease;
}

.portfolio-card:hover {
  filter: drop-shadow(0 18px 30px rgba(244, 63, 94, 0.09));
}

:global(html.dark) .portfolio-card:hover {
  filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.28));
}

.portfolio-card-skeleton {
  pointer-events: none;
}

.portfolio-skeleton-image,
.portfolio-skeleton-chip,
.portfolio-skeleton-title,
.portfolio-skeleton-text,
.portfolio-skeleton-tags span {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: portfolio-skeleton-shimmer 1.5s ease-in-out infinite;
}

.portfolio-skeleton-image {
  border-radius: 1.5rem;
}

.portfolio-skeleton-chip {
  width: 5.5rem;
  height: 1.5rem;
  margin-bottom: 0.75rem;
}

.portfolio-skeleton-title {
  width: 72%;
  height: 1.75rem;
  margin-bottom: 0.875rem;
}

.portfolio-skeleton-text {
  width: 100%;
  height: 0.875rem;
  margin-bottom: 0.625rem;
}

.portfolio-skeleton-text-short {
  width: 64%;
  margin-bottom: 1.25rem;
}

.portfolio-skeleton-tags {
  display: flex;
  gap: 0.5rem;
}

.portfolio-skeleton-tags span {
  width: 4rem;
  height: 1.625rem;
}

.portfolio-image-wrapper {
  @apply relative overflow-hidden rounded-3xl aspect-[16/10] transition-all duration-300;
  margin-bottom: 1rem;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.portfolio-content-link {
  padding: 0 20px;
}

.portfolio-image {
  @apply w-full h-full object-cover;
}

.portfolio-overlay {
  @apply absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 flex items-center justify-center gap-4;
}

.portfolio-card:hover .portfolio-overlay {
  @apply opacity-100;
}

.portfolio-action-btn {
  @apply w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 translate-y-4;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--color-heading);
}
.portfolio-action-btn:hover {
  color: var(--color-primary);
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
  @apply px-3 py-1 rounded-full text-xs font-medium;
  background-color: var(--color-secondary);
  color: var(--color-primary);
}
:global(html.dark) .portfolio-category-badge {
  background-color: rgba(244, 63, 94, 0.15);
  color: var(--color-primary);
}

.portfolio-project-title {
  @apply text-2xl font-bold mb-3 flex items-center gap-2 transition-colors;
  color: var(--color-heading);
}

.portfolio-card:hover .portfolio-project-title {
  color: var(--color-primary);
}

.portfolio-arrow-icon {
  @apply w-5 h-5 opacity-0 -translate-x-2 transition-all duration-300;
}

.portfolio-card:hover .portfolio-arrow-icon {
  @apply opacity-100 translate-x-0;
}

.portfolio-project-desc {
  @apply leading-relaxed mb-6;
  color: var(--color-text);
}

.portfolio-tags-wrapper {
  @apply flex flex-wrap gap-2;
}

.portfolio-tag-badge {
  @apply px-3 py-1 rounded-md text-xs font-medium;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
:global(html.dark) .portfolio-tag-badge {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

@keyframes portfolio-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .portfolio-skeleton-image,
  .portfolio-skeleton-chip,
  .portfolio-skeleton-title,
  .portfolio-skeleton-text,
  .portfolio-skeleton-tags span {
    animation: none;
  }
}
</style>
