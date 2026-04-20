<script setup lang="ts">
import { GitCommit, Star, Bug, Rocket } from 'lucide-vue-next'

const logs = [
  {
    version: 'v2.0.0',
    date: '2024-04-17',
    tag: 'MAJOR',
    icon: Rocket,
    iconColor: 'cl-icon-rose',
    bgColor: 'cl-bg-rose',
    title: '极简清新风格重构',
    changes: [
      { type: 'feat', text: '全新设计的极简清新 UI 界面，采用明亮主题与玻璃拟态效果' },
      { type: 'feat', text: '重构导航栏与页脚，提升空间感与呼吸感' },
      { type: 'feat', text: '优化所有页面的动画效果，使其更加丝滑自然' },
      { type: 'refactor', text: '全面移除原有 Brutalism (粗野主义) 设计元素' }
    ]
  },
  {
    version: 'v1.1.0',
    date: '2024-02-10',
    tag: 'FEATURE',
    icon: Star,
    iconColor: 'cl-icon-amber',
    bgColor: 'cl-bg-amber',
    title: '功能完善与体验优化',
    changes: [
      { type: 'feat', text: '新增「生活碎片」瀑布流布局视图' },
      { type: 'feat', text: '文章列表添加分类筛选功能' },
      { type: 'fix', text: '修复移动端导航菜单点击穿透的问题' }
    ]
  },
  {
    version: 'v1.0.0',
    date: '2023-10-01',
    tag: 'RELEASE',
    icon: GitCommit,
    iconColor: 'cl-icon-blue',
    bgColor: 'cl-bg-blue',
    title: '项目初始化',
    changes: [
      { type: 'feat', text: '基于 Vue 3 + Tailwind CSS 搭建项目基础架构' },
      { type: 'feat', text: '集成 vue-router 并在全局配置页面切换动画' },
      { type: 'feat', text: '完成首页、文章、作品、关于等核心页面的开发' }
    ]
  }
]

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
</script>

<template>
  <div class="cl-page-container">
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
        <div
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
            <div class="cl-glass-card">
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
                  class="cl-change-item"
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
}

.cl-title {
  @apply text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4;
}

.cl-subtitle {
  @apply text-lg text-slate-500 max-w-2xl;
}

.cl-timeline-wrapper {
  @apply relative max-w-4xl mx-auto md:mx-0;
}

.cl-timeline-line {
  @apply absolute left-[27px] md:left-[120px] top-0 bottom-0 w-px bg-slate-200;
}

.cl-logs-container {
  @apply space-y-16;
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
  @apply w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1;
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
  @apply bg-white/70 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 p-6 md:p-8;
}

.cl-log-card-header {
  @apply flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100;
}

.cl-log-version-wrap {
  @apply flex items-center gap-3 mb-2;
}

.cl-log-version {
  @apply text-2xl font-bold text-slate-900;
}

.cl-log-tag {
  @apply px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500 tracking-wider;
}

.cl-log-card-title {
  @apply text-slate-600 font-medium;
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
  @apply text-slate-600 text-sm leading-relaxed;
}

/* Colors */
.cl-icon-rose { @apply text-rose-500; }
.cl-bg-rose { @apply bg-rose-100; }

.cl-icon-amber { @apply text-amber-500; }
.cl-bg-amber { @apply bg-amber-100; }

.cl-icon-blue { @apply text-blue-500; }
.cl-bg-blue { @apply bg-blue-100; }

/* Badge Colors */
.cl-badge-emerald { @apply bg-emerald-50 text-emerald-600; }
.cl-badge-rose { @apply bg-rose-50 text-rose-600; }
.cl-badge-blue { @apply bg-blue-50 text-blue-600; }
.cl-badge-slate { @apply bg-slate-50 text-slate-600; }
</style>
