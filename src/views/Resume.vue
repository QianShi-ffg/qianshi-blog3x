<script setup lang="ts">
import { Mail, MapPin, Briefcase, GraduationCap, FolderGit2, Download } from 'lucide-vue-next'
</script>

<template>
  <div class="resume-page-container">
    <!-- Header -->
    <div class="resume-header-wrapper">
      <div>
        <h1
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="resume-title"
        >
          关于我
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
          class="resume-subtitle"
        >
          热爱开源，追求极致的用户体验与代码质量。
        </p>
      </div>
      <button
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
        class="resume-download-btn"
      >
        下载简历 PDF
        <Download class="resume-download-icon" />
      </button>
    </div>

    <div class="resume-grid">
      <!-- Left Column (Profile & Skills) -->
      <div class="resume-left-column">
        <!-- Profile Card -->
        <div
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 100 } }"
          class="resume-profile-card"
        >
          <div class="resume-avatar-wrapper">
            <img
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20avatar%20illustration%2C%20flat%20design%2C%20soft%20colors%2C%20young%20developer&image_size=square"
              alt="Avatar"
              class="resume-avatar"
            />
          </div>
          <h2 class="resume-name">QianShiBlog</h2>
          <p class="resume-role">高级前端开发工程师</p>

          <div class="resume-contact-list">
            <div class="resume-contact-item">
              <MapPin class="resume-contact-icon" />
              <span>中国 · 杭州</span>
            </div>
            <div class="resume-contact-item">
              <Mail class="resume-contact-icon" />
              <a href="mailto:hello@example.com" class="resume-contact-link"
                >hello@QianShiBlog.dev</a
              >
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div
          v-motion
          :initial="{ opacity: 0, x: -30 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 200 } }"
          class="resume-skills-card"
        >
          <div class="resume-section-header">
            <!-- <span class="text-rose-500 font-mono font-bold">{"</>"}</span> -->
            <h3 class="resume-section-title">核心技能</h3>
          </div>

          <div class="resume-skills-list">
            <div class="resume-skill-item">
              <span class="resume-skill-name">Vue.js / React</span>
              <span class="resume-skill-tag cl-tag-rose">精通</span>
            </div>
            <div class="resume-skill-item">
              <span class="resume-skill-name">TypeScript</span>
              <span class="resume-skill-tag cl-tag-amber">掌握</span>
            </div>
            <div class="resume-skill-item">
              <span class="resume-skill-name">CSS / Tailwind</span>
              <span class="resume-skill-tag cl-tag-rose">精通</span>
            </div>
            <div class="resume-skill-item">
              <span class="resume-skill-name">Node.js</span>
              <span class="resume-skill-tag cl-tag-sky">熟悉</span>
            </div>
          </div>

          <div class="mt-6 text-xs text-slate-400 text-center border-t border-slate-100 pt-4">
            等级说明：了解 &lt; 熟悉 &lt; 掌握 &lt; 精通
          </div>
        </div>
      </div>

      <!-- Right Column (Experience & Education) -->
      <div class="resume-right-column">
        <!-- Experience -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 100 } }"
          class="resume-experience-card"
        >
          <div class="resume-section-header-large">
            <Briefcase class="resume-section-icon-large" />
            <h3 class="resume-section-title-large">工作经历</h3>
          </div>

          <div class="resume-timeline-spaced">
            <!-- Item 1 -->
            <div class="resume-timeline-item">
              <div class="resume-timeline-dot-active"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">高级前端开发工程师</h4>
                <span class="resume-timeline-date-active">2021 至今</span>
              </div>
              <p class="resume-timeline-company">Tech Innovators Inc.</p>
              <ul class="resume-timeline-desc">
                <li>• 主导公司核心 SaaS 产品的前端架构设计与开发，使用 Vue 3 和 TypeScript。</li>
                <li>• 搭建并维护企业级 UI 组件库，提升团队 30% 的开发效率。</li>
                <li>• 优化首屏加载时间，将核心指标 LCP 降低了 40%。</li>
              </ul>
            </div>

            <!-- Item 2 -->
            <div class="resume-timeline-item">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">前端开发工程师</h4>
                <span class="resume-timeline-date">2018 - 2021</span>
              </div>
              <p class="resume-timeline-company">Creative Digital Agency</p>
              <ul class="resume-timeline-desc">
                <li>• 为多个国际品牌开发响应式营销网站和交互式 Web 应用。</li>
                <li>• 引入并推广 Tailwind CSS，规范了团队的 CSS 编写标准。</li>
                <li>• 参与开发基于 React Native 的跨平台移动端应用。</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Education -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 200 } }"
          class="resume-education-card"
        >
          <div class="resume-section-header-large">
            <GraduationCap class="resume-section-icon-large" />
            <h3 class="resume-section-title-large">教育背景</h3>
          </div>

          <div class="resume-timeline">
            <div class="resume-timeline-item">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">计算机科学与技术 学士</h4>
                <span class="resume-timeline-date">2014 - 2018</span>
              </div>
              <p class="resume-timeline-company">某知名科技大学</p>
              <p class="resume-timeline-desc-inline">
                主修软件工程、数据结构、算法设计。在校期间曾获得全国大学生编程竞赛二等奖。
              </p>
            </div>
          </div>
        </div>

        <!-- Projects -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 30 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, delay: 300 } }"
          class="resume-education-card mt-8"
        >
          <div class="resume-section-header-large">
            <FolderGit2 class="resume-section-icon-large" />
            <h3 class="resume-section-title-large">项目经历</h3>
          </div>

          <div class="resume-timeline">
            <!-- Project 1 -->
            <div class="resume-timeline-item mb-8">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">企业级后台管理平台</h4>
                <span class="resume-timeline-date">2023.06 - 2024.03 | 前端开发</span>
              </div>
              <p class="resume-timeline-company">Vue3 + Vite + TypeScript + Tailwind + Pinia</p>
              <ul class="resume-timeline-desc mt-2">
                <li>• 搭建前端脚手架与组件库，形成 20+ 复用组件</li>
                <li>• 实现动态菜单与基于 RBAC 的路由权限</li>
                <li>• 引入 ECharts 与虚拟滚动，页面渲染性能提升约 35%</li>
              </ul>
            </div>

            <!-- Project 2 -->
            <div class="resume-timeline-item mb-8">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">营销落地页与表单系统</h4>
                <span class="resume-timeline-date">2022.10 - 2023.05 | 前端负责人</span>
              </div>
              <p class="resume-timeline-company">React + Next.js + Tailwind + Node.js</p>
              <ul class="resume-timeline-desc mt-2">
                <li>• 搭建可视化表单生成器，支持 15+ 常用字段组件</li>
                <li>• SSR 与图片懒加载，TTFB 降低 40%，转化率提升约 18%</li>
                <li>• Node 服务编排与缓存，接口 P95 响应从 420ms 降至 210ms</li>
              </ul>
            </div>

            <!-- Project 3 -->
            <div class="resume-timeline-item">
              <div class="resume-timeline-dot"></div>
              <div class="resume-timeline-header">
                <h4 class="resume-timeline-title">组件库与工程化优化</h4>
                <span class="resume-timeline-date">2021.08 - 2022.08 | 工程实践</span>
              </div>
              <p class="resume-timeline-company">Rollup + Storybook + Vitest</p>
              <ul class="resume-timeline-desc mt-2">
                <li>• 沉淀 UI 组件库并接入 Storybook，覆盖 90% UI 需求</li>
                <li>• 引入单元测试与 CI，关键模块用例覆盖率 85%+</li>
                <li>• 包体积按需构建与 Tree-shaking，体积下降 45%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resume-page-container {
  @apply min-h-[80vh] py-12 pt-24 px-6 mx-auto max-w-screen-2xl;
}
@media (min-width: 640px) {
  .resume-page-container {
    @apply px-12;
  }
}
@media (min-width: 768px) {
  .resume-page-container {
    @apply px-20;
  }
}
@media (min-width: 1024px) {
  .resume-page-container {
    @apply py-20 pt-32 px-32;
  }
}
@media (min-width: 1280px) {
  .resume-page-container {
    @apply px-48;
  }
}

.resume-header-wrapper {
  @apply mb-16 flex flex-col items-start gap-8;
}
@media (min-width: 768px) {
  .resume-header-wrapper {
    @apply flex-row justify-between items-end;
  }
}

.resume-title {
  @apply text-4xl font-bold text-slate-900 tracking-tight mb-4;
}
@media (min-width: 768px) {
  .resume-title {
    @apply text-5xl;
  }
}

.resume-subtitle {
  @apply text-lg text-slate-500 max-w-2xl;
}

.resume-download-btn {
  @apply inline-flex items-center justify-center px-6 py-2.5 rounded-full font-medium hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300;
  background-color: var(--color-primary);
  color: white;
}
.resume-download-btn:hover {
  background-color: #e11d48;
  box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.3);
}

.resume-download-icon {
  @apply w-4 h-4 ml-2 transition-transform;
}

.resume-download-btn:hover .resume-download-icon {
  @apply translate-y-0.5;
}

.resume-grid {
  @apply grid grid-cols-1 gap-12;
}
@media (min-width: 1024px) {
  .resume-grid {
    @apply grid-cols-12;
  }
}

.resume-left-column {
  @apply space-y-8;
}
@media (min-width: 1024px) {
  .resume-left-column {
    @apply col-span-4;
  }
}

.resume-right-column {
  @apply space-y-8;
}
@media (min-width: 1024px) {
  .resume-right-column {
    @apply col-span-8;
  }
}

.resume-profile-card {
  @apply p-8 text-center rounded-3xl transition-all duration-300;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}
:global(html.dark) .resume-profile-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.resume-avatar-wrapper {
  @apply w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg;
}

.resume-avatar {
  @apply w-full h-full object-cover;
}

.resume-name {
  @apply text-2xl font-bold text-slate-900 mb-2;
}

.resume-role {
  @apply text-rose-500 font-medium mb-6;
}

.resume-contact-list {
  @apply space-y-4 text-sm text-slate-500 text-left;
}

.resume-contact-item {
  @apply flex items-center gap-3;
}

.resume-contact-icon {
  @apply w-4 h-4 text-slate-400;
}

.resume-contact-link {
  @apply hover:text-rose-500 transition-colors;
}

.resume-skills-card {
  @apply p-8 rounded-3xl transition-all duration-300;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}
:global(html.dark) .resume-skills-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.resume-section-header {
  @apply flex items-center gap-2 mb-6 text-slate-900;
}

.resume-section-icon {
  @apply w-5 h-5 text-rose-500;
}

.resume-section-title {
  @apply font-bold text-lg;
}

.resume-skills-list {
  @apply space-y-4;
}

.resume-skill-item {
  @apply flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-300;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
}
.resume-skill-item:hover {
  background-color: var(--color-card);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.resume-skill-name {
  @apply font-medium text-slate-700;
}

.resume-skill-tag {
  @apply rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide border;
}

.cl-tag-rose {
  @apply bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_8px_rgba(244,63,94,0.1)];
}

.cl-tag-amber {
  @apply bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_8px_rgba(245,158,11,0.1)];
}

.cl-tag-sky {
  @apply bg-sky-50 text-sky-600 border-sky-100 shadow-[0_0_8px_rgba(14,165,233,0.1)];
}

.resume-experience-card {
  @apply p-8 rounded-3xl transition-all duration-300;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}
:global(html.dark) .resume-experience-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
@media (min-width: 768px) {
  .resume-experience-card {
    @apply p-10;
  }
}

.resume-education-card {
  @apply p-8 rounded-3xl transition-all duration-300;
  background-color: var(--color-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
}
:global(html.dark) .resume-education-card {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}
@media (min-width: 768px) {
  .resume-education-card {
    @apply p-10;
  }
}

.resume-section-header-large {
  @apply flex items-center gap-2 mb-8 text-slate-900;
}

.resume-section-icon-large {
  @apply w-6 h-6 text-rose-500;
}

.resume-section-title-large {
  @apply font-bold text-xl;
}

.resume-timeline-spaced {
  @apply relative border-l ml-3 space-y-12;
  border-color: var(--color-border);
}

.resume-timeline {
  @apply relative border-l ml-3;
  border-color: var(--color-border);
}

.resume-timeline-item {
  @apply relative pl-8;
}

.resume-timeline-dot-active {
  @apply absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-rose-500 ring-4;
  --tw-ring-color: var(--color-secondary);
}

.resume-timeline-dot {
  @apply absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full ring-4;
  background-color: var(--color-text);
  --tw-ring-color: var(--color-background);
}

.resume-timeline-header {
  @apply flex flex-col mb-2;
}
@media (min-width: 768px) {
  .resume-timeline-header {
    @apply flex-row items-center justify-between;
  }
}

.resume-timeline-title {
  @apply text-lg font-bold text-slate-900;
}

.resume-timeline-date-active {
  @apply text-sm font-medium text-rose-500 bg-rose-50 px-3 py-1 rounded-full w-fit mt-2;
}
@media (min-width: 768px) {
  .resume-timeline-date-active {
    @apply mt-0;
  }
}

.resume-timeline-date {
  @apply text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit mt-2;
}
@media (min-width: 768px) {
  .resume-timeline-date {
    @apply mt-0;
  }
}

.resume-timeline-company {
  @apply text-slate-900 font-medium mb-4;
}

.resume-timeline-desc {
  @apply space-y-2 text-slate-500 text-sm leading-relaxed;
}

.resume-timeline-desc-inline {
  @apply text-slate-500 text-sm;
}
</style>
