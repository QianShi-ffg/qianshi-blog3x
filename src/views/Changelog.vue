<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { Component } from 'vue'
import { GitCommit, Star, Bug, Rocket } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { listChangelogs } from '@/api/changelog'
import type { Changelog } from '@/types/content'
import { registerRouteTransitionCleanup } from '@/utils/route-transition-cleanup'

const changelogRoot = ref<HTMLElement | null>(null)
let headerParallaxCtx: gsap.Context | undefined
let unregisterTransitionCleanup: (() => void) | undefined

interface ChangelogView extends Changelog {
  icon: Component
  iconColor: string
  bgColor: string
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const setupHeaderParallax = () => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()

  if (!changelogRoot.value || prefersReducedMotion()) return

  headerParallaxCtx = gsap.context(() => {
    const header = changelogRoot.value?.querySelector<HTMLElement>('.cl-header-wrapper')
    if (!header) return

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
  }, changelogRoot.value)

  unregisterTransitionCleanup = registerRouteTransitionCleanup(() => {
    headerParallaxCtx?.revert()
    headerParallaxCtx = undefined
    unregisterTransitionCleanup = undefined
  })

  ScrollTrigger.refresh()
}

const defaultTagMeta: Pick<ChangelogView, 'icon' | 'iconColor' | 'bgColor'> = {
  icon: Star,
  iconColor: 'cl-icon-amber',
  bgColor: 'cl-bg-amber',
}

const tagMetaMap: Record<string, Pick<ChangelogView, 'icon' | 'iconColor' | 'bgColor'>> = {
  MAJOR: {
    icon: Rocket,
    iconColor: 'cl-icon-rose',
    bgColor: 'cl-bg-rose',
  },
  FEATURE: {
    ...defaultTagMeta,
  },
  RELEASE: {
    icon: GitCommit,
    iconColor: 'cl-icon-blue',
    bgColor: 'cl-bg-blue',
  },
  FIX: {
    icon: Bug,
    iconColor: 'cl-icon-rose',
    bgColor: 'cl-bg-rose',
  },
}

const logs = ref<ChangelogView[]>([])

const decorateChangelog = (log: Changelog): ChangelogView => {
  const meta = tagMetaMap[log.tag] ?? defaultTagMeta

  return {
    ...log,
    icon: meta.icon,
    iconColor: meta.iconColor,
    bgColor: meta.bgColor,
  }
}

const loadChangelogs = async () => {
  const changelogs = await listChangelogs()
  logs.value = changelogs.map(decorateChangelog)
}

const getBadgeClass = (type: string) => {
  switch (type) {
    case 'feat': return 'cl-badge-emerald'
    case 'fix': return 'cl-badge-rose'
    case 'refactor': return 'cl-badge-blue'
    default: return 'cl-badge-slate'
  }
}

const getBadgeText = (type: string) => {
  switch (type) {
    case 'feat': return 'NEW'
    case 'fix': return 'FIX'
    case 'refactor': return 'UPDATE'
    default: return type.toUpperCase()
  }
}

onMounted(async () => {
  await loadChangelogs()
  setupHeaderParallax()
})

onUnmounted(() => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()
})
</script>

<template>
  <div ref="changelogRoot" class="cl-page-container">
    <!-- Header -->
    <div class="cl-header-wrapper">
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
        class="cl-title"
      >
        更新日志
      </h1>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
        class="cl-subtitle"
      >
        记录网站的每一次进化与成长。
      </p>
    </div>

    <!-- Timeline -->
    <div class="cl-timeline-wrapper">
      <!-- Vertical Line -->
      <div class="cl-timeline-line"></div>

      <div class="cl-logs-container">
        <div v-if="logs.length === 0" class="cl-empty-state">
          <p class="cl-empty-title">暂无更新日志</p>
          <p class="cl-empty-desc">后台发布后，这里会同步显示。</p>
        </div>
        <div
          v-else
          v-for="(log, index) in logs"
          :key="log.version"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, delay: index * 100 } }"
          class="cl-log-item"
        >
          <!-- Date (Desktop) -->
          <div class="cl-log-date-desktop">
            <span class="cl-log-date-text">{{ log.date }}</span>
          </div>

          <!-- Icon Node -->
          <div class="cl-log-icon-node">
            <div class="cl-log-icon-outer">
              <div class="cl-log-icon-inner" :class="[log.bgColor, log.iconColor]">
                <component :is="log.icon" class="cl-icon" />
              </div>
            </div>
          </div>

          <!-- Content Card -->
          <div class="cl-log-content-col">
            <div class="cl-glass-card interactive-card">
              <div class="cl-log-card-header">
                <div>
                  <div class="cl-log-version-wrap">
                    <h2 class="cl-log-version">{{ log.version }}</h2>
                    <span class="cl-log-tag">
                      {{ log.tag }}
                    </span>
                  </div>
                  <h3 class="cl-log-card-title">{{ log.title }}</h3>
                </div>
                <span class="cl-log-date-mobile">{{ log.date }}</span>
              </div>

              <ul class="cl-changes-list">
                <li
                  v-for="(change, cIndex) in log.changes"
                  :key="cIndex"
                  class="cl-change-item interactive-lift"
                >
                  <span
                    class="cl-change-badge"
                    :class="getBadgeClass(change.type)"
                  >
                    {{ getBadgeText(change.type) }}
                  </span>
                  <span class="cl-change-text">{{ change.text }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cl-page-container {
  @apply min-h-[80vh] py-12 lg:py-20 lg:pt-32 pt-24 px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 mx-auto max-w-screen-2xl;
}

.cl-header-wrapper {
  @apply mb-16;
  will-change: transform;
}

.cl-title {
  @apply text-4xl md:text-5xl font-bold tracking-tight mb-4;
  color: var(--color-heading);
}
:global(html.dark .cl-title){
  color: #e2e8f0;
}

.cl-subtitle {
  @apply text-lg max-w-2xl;
  color: var(--color-text);
}

.cl-timeline-wrapper {
  @apply relative max-w-4xl mx-auto md:mx-0;
}

.cl-timeline-line {
  @apply absolute left-[27px] md:left-[156px] top-0 bottom-0 w-px;
  background-color: var(--color-border);
}

.cl-logs-container {
  @apply space-y-16;
}

.cl-empty-state {
  @apply rounded-3xl px-6 py-10 text-center border;
  background-color: var(--color-card);
  border-color: var(--color-border);
}

.cl-empty-title {
  @apply text-lg font-semibold mb-2;
  color: var(--color-heading);
}

.cl-empty-desc {
  @apply text-sm;
  color: var(--color-text);
}

.cl-log-item {
  @apply relative flex flex-col md:flex-row gap-6 md:gap-12;
}

.cl-log-date-desktop {
  @apply hidden md:block w-20 flex-shrink-0 text-right pt-1.5;
}

.cl-log-date-text {
  @apply text-sm font-medium text-slate-400;
}

.cl-log-icon-node {
  @apply absolute left-0 md:relative md:left-auto flex-shrink-0 z-10;
}

.cl-log-icon-outer {
  @apply w-14 h-14 rounded-full shadow-sm flex items-center justify-center p-1 border;
  background-color: var(--color-card);
  border-color: var(--color-border);
}

.cl-log-icon-inner {
  @apply w-full h-full rounded-full flex items-center justify-center;
}

.cl-icon {
  @apply w-5 h-5;
}

.cl-log-content-col {
  @apply flex-grow pl-20 md:pl-0 pt-1;
}

.cl-glass-card {
  @apply rounded-3xl transition-all duration-300 p-6 md:p-8;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
}
:global(html.dark .cl-glass-card){
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.cl-log-card-header {
  @apply flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b;
  border-color: var(--color-border);
}

.cl-log-version-wrap {
  @apply flex items-center gap-3 mb-2;
}

.cl-log-version {
  @apply text-2xl font-bold;
  color: var(--color-heading);
}

.cl-log-tag {
  @apply px-2 py-0.5 rounded text-xs font-bold tracking-wider;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
:global(html.dark .cl-log-tag){
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.cl-log-card-title {
  @apply font-medium;
  color: var(--color-text);
}

.cl-log-date-mobile {
  @apply md:hidden text-sm font-medium text-slate-400;
}

.cl-changes-list {
  @apply space-y-4;
}

.cl-change-item {
  @apply flex items-start gap-3;
}

.cl-change-badge {
  @apply px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 tracking-wider shrink-0;
}

.cl-change-text {
  @apply text-sm leading-relaxed;
  color: var(--color-text);
}

@media (max-width: 767px) {
  .cl-page-container {
    overflow-x: clip;
  }

  .cl-header-wrapper {
    margin-bottom: 2rem;
  }

  .cl-subtitle,
  .cl-timeline-line,
  .cl-log-icon-node {
    display: none;
  }

  .cl-logs-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .cl-log-item {
    gap: 0;
  }

  .cl-timeline-line {
    left: 1.25rem;
  }

  .cl-log-icon-outer {
    width: 2.75rem;
    height: 2.75rem;
  }

  .cl-log-content-col {
    min-width: 0;
    padding-left: 0;
    padding-top: 0;
  }

  .cl-glass-card {
    padding: 1rem;
    border-radius: 1rem;
  }

  .cl-log-card-header,
  .cl-log-card-header > div,
  .cl-log-version-wrap {
    min-width: 0;
  }

  .cl-log-card-header {
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    gap: 0.5rem;
  }

  .cl-log-version-wrap {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .cl-log-version,
  .cl-log-card-title,
  .cl-change-text {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .cl-log-version {
    font-size: 1.25rem;
    line-height: 1.35;
  }

  .cl-change-item {
    gap: 0.5rem;
  }

  .cl-change-badge {
    display: none;
  }

  .cl-changes-list {
    display: grid;
    gap: 0.5rem;
  }
}

/* Colors */
.cl-icon-rose { @apply text-rose-500; }
.cl-bg-rose { background-color: var(--color-secondary); }

.cl-icon-amber { @apply text-amber-500; }
.cl-bg-amber { @apply bg-amber-100; }
:global(html.dark .cl-bg-amber){ background-color: rgba(245, 158, 11, 0.15); }

.cl-icon-blue { @apply text-blue-500; }
.cl-bg-blue { @apply bg-blue-100; }
:global(html.dark .cl-bg-blue){ background-color: rgba(59, 130, 246, 0.15); }

/* Badge Colors */
.cl-badge-emerald { @apply bg-emerald-50 text-emerald-600; }
:global(html.dark .cl-badge-emerald){ background-color: rgba(16, 185, 129, 0.15); color: #10b981; }

.cl-badge-rose { @apply bg-rose-50 text-rose-600; }
:global(html.dark .cl-badge-rose){ background-color: rgba(244, 63, 94, 0.15); color: var(--color-primary); }

.cl-badge-blue { @apply bg-blue-50 text-blue-600; }
:global(html.dark .cl-badge-blue){ background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }

.cl-badge-slate { @apply bg-slate-50 text-slate-600; }
:global(html.dark .cl-badge-slate){ background-color: rgba(255, 255, 255, 0.05); color: #cbd5e1; }
</style>
