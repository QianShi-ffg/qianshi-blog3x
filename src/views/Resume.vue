<script setup lang="ts">
import { Mail, MapPin, Briefcase, GraduationCap, Code2, Download } from 'lucide-vue-next'
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
              <a href="mailto:hello@example.com" class="resume-contact-link">hello@QianShiBlog.dev</a>
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
            <Code2 class="resume-section-icon" />
            <h3 class="resume-section-title">核心技能</h3>
          </div>

          <div class="resume-skills-list">
            <div>
              <div class="resume-skill-header">
                <span class="resume-skill-name">Vue.js / React</span>
                <span class="resume-skill-percent">90%</span>
              </div>
              <div class="resume-skill-bar-bg">
                <div class="resume-skill-bar-fill resume-skill-90"></div>
              </div>
            </div>
            <div>
              <div class="resume-skill-header">
                <span class="resume-skill-name">TypeScript</span>
                <span class="resume-skill-percent">85%</span>
              </div>
              <div class="resume-skill-bar-bg">
                <div class="resume-skill-bar-fill resume-skill-85"></div>
              </div>
            </div>
            <div>
              <div class="resume-skill-header">
                <span class="resume-skill-name">CSS / Tailwind</span>
                <span class="resume-skill-percent">95%</span>
              </div>
              <div class="resume-skill-bar-bg">
                <div class="resume-skill-bar-fill resume-skill-95"></div>
              </div>
            </div>
            <div>
              <div class="resume-skill-header">
                <span class="resume-skill-name">Node.js</span>
                <span class="resume-skill-percent">75%</span>
              </div>
              <div class="resume-skill-bar-bg">
                <div class="resume-skill-bar-fill resume-skill-75"></div>
              </div>
            </div>
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
              <p class="resume-timeline-desc-inline">主修软件工程、数据结构、算法设计。在校期间曾获得全国大学生编程竞赛二等奖。</p>
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
    @apply py-20 px-32;
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
  @apply inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-rose-500 text-white font-medium hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300;
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
  @apply p-8 text-center bg-white/70 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300;
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
  @apply p-8 bg-white/70 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300;
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
  @apply space-y-6;
}

.resume-skill-header {
  @apply flex justify-between text-sm mb-2;
}

.resume-skill-name {
  @apply font-medium text-slate-700;
}

.resume-skill-percent {
  @apply text-rose-500;
}

.resume-skill-bar-bg {
  @apply h-2 bg-slate-100 rounded-full overflow-hidden;
}

.resume-skill-bar-fill {
  @apply h-full bg-rose-500 rounded-full;
}

.resume-skill-90 { width: 90%; }
.resume-skill-85 { width: 85%; }
.resume-skill-95 { width: 95%; }
.resume-skill-75 { width: 75%; }

.resume-experience-card {
  @apply p-8 bg-white/70 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300;
}
@media (min-width: 768px) {
  .resume-experience-card {
    @apply p-10;
  }
}

.resume-education-card {
  @apply p-8 bg-white/70 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300;
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
  @apply relative border-l border-slate-200 ml-3 space-y-12;
}

.resume-timeline {
  @apply relative border-l border-slate-200 ml-3;
}

.resume-timeline-item {
  @apply relative pl-8;
}

.resume-timeline-dot-active {
  @apply absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-rose-500 ring-4 ring-rose-50;
}

.resume-timeline-dot {
  @apply absolute -left-[5px] top-1.5 w-[10px] h-[10px] rounded-full bg-slate-300 ring-4 ring-slate-50;
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
