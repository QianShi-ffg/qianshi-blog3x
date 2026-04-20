<script setup lang="ts">
import { ArrowRight, Code2, Coffee, Sparkles } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Decorative Background Blobs -->
      <div class="blob-1"></div>
      <div class="blob-2"></div>

      <div class="hero-grid">
        <!-- Text Content -->
        <div class="hero-text-content">
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
            class="hero-badge"
          >
            <Sparkles class="hero-badge-icon" />
            <span>欢迎来到我的数字花园</span>
          </div>

          <h1
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
            class="hero-title"
          >
            用代码 <br />
            <span class="hero-title-highlight">构建世界</span>，<br />
            用文字记录生活。
          </h1>

          <p
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
            class="hero-desc"
          >
            一位热衷于创建简洁、易用且交互丰富的界面的前端开发人员。
          </p>

          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 300 } }"
            class="hero-actions"
          >
            <RouterLink to="/blog" class="btn-primary group">
              阅读文章
              <ArrowRight class="btn-primary-icon" />
            </RouterLink>
            <RouterLink to="/portfolio" class="btn-secondary"> 查看作品 </RouterLink>
          </div>
        </div>

        <!-- Image / Visual Content -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 1000, delay: 200 } }"
          class="hero-visual"
        >
          <div class="hero-image-wrapper">
            <img
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20and%20fresh%20workspace%2C%20bright%20lighting%2C%20a%20plant%2C%20soft%20colors&image_size=square"
              alt="Workspace"
              class="hero-image"
            />
            <!-- Floating badge 1 -->
            <div class="floating-badge badge-1">
              <div class="badge-icon-wrap icon-rose">
                <Code2 class="badge-icon" />
              </div>
              <div>
                <p class="badge-title">HTML & CSS & JS</p>
                <p class="badge-subtitle">Frontend</p>
              </div>
            </div>
            <!-- Floating badge 2 -->
            <div class="floating-badge badge-2">
              <div class="badge-icon-wrap icon-blue">
                <Coffee class="badge-icon" />
              </div>
              <div>
                <p class="badge-title">生活碎片</p>
                <p class="badge-subtitle">Life Diary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="recent-posts-section">
      <div class="recent-header">
        <div>
          <h2 class="recent-title">最新文章</h2>
          <p class="recent-desc">记录技术与生活的点滴</p>
        </div>
        <RouterLink to="/blog" class="recent-view-all group">
          查看全部
          <ArrowRight class="view-all-icon" />
        </RouterLink>
      </div>

      <div class="recent-grid">
        <RouterLink v-for="i in 3" :key="i" :to="`/blog/${i}`" class="post-card group">
          <div class="post-meta">
            <span class="post-tag">精选开发</span>
            <span class="post-date">2024-03-{{ 10 + i }}</span>
          </div>
          <h3 class="post-title">
            {{
              i === 1
                ? 'Vue 3 组合式 API 最佳实践'
                : i === 2
                  ? '如何构建一个现代化的博客系统'
                  : 'Tailwind CSS 高级技巧分享'
            }}
          </h3>
          <p class="post-desc">
            在现代前端开发中，保持代码的简洁与可维护性至关重要。本文将分享在实际项目中总结的一些经验和技巧，帮助你写出更优雅的代码。
          </p>
        </RouterLink>
      </div>

      <div class="mobile-view-all">
        <RouterLink to="/blog" class="btn-secondary w-full-btn"> 查看全部文章 </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 6rem; /* pt-24 */
  padding-bottom: 3rem; /* pb-12 */
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 1536px; /* max-w-screen-2xl */
}
@media (min-width: 640px) {
  .home-container {
    padding-left: 3rem; /* sm:px-12 */
    padding-right: 3rem;
  }
}
@media (min-width: 768px) {
  .home-container {
    padding-left: 5rem; /* md:px-20 */
    padding-right: 5rem;
  }
}
@media (min-width: 1024px) {
  .home-container {
    padding-left: 8rem; /* lg:px-32 */
    padding-right: 8rem;
  }
}
@media (min-width: 1280px) {
  .home-container {
    padding-left: 12rem; /* xl:px-48 */
    padding-right: 12rem;
  }
}

.hero-section {
  padding-top: 5rem; /* py-20 */
  padding-bottom: 5rem;
  position: relative;
}
@media (min-width: 1024px) {
  .hero-section {
    padding-top: 10rem; /* lg:pt-40 lg:pb-32 */
    padding-bottom: 8rem;
  }
}

.blob-1 {
  position: absolute;
  top: 0;
  right: 0;
  width: 600px;
  height: 600px;
  background-color: rgba(255, 228, 230, 0.5); /* rose-100/50 */
  border-radius: 9999px;
  filter: blur(100px);
  z-index: -10;
  transform: translateX(33.333333%) translateY(-25%);
}

.blob-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 400px;
  background-color: rgba(239, 246, 255, 0.5); /* blue-50/50 */
  border-radius: 9999px;
  filter: blur(80px);
  z-index: -10;
  transform: translateX(-33.333333%) translateY(25%);
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 4rem; /* gap-16 */
  align-items: center;
}
@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.hero-text-content {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* space-y-8 */
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem;
  border-radius: 9999px; /* rounded-full */
  background-color: #fff1f2; /* bg-rose-50 */
  color: #e11d48; /* text-rose-600 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  align-self: flex-start;
}

.hero-badge-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}

.hero-title {
  font-size: 3rem; /* text-5xl */
  line-height: 1;
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  letter-spacing: -0.025em; /* tracking-tight */
  line-height: 1.2; /* leading-[1.2] */
}
@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.75rem; /* text-6xl */
  }
}

.hero-title-highlight {
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  background-image: linear-gradient(to right, #f43f5e, #fb7185); /* from-rose-500 to-rose-400 */
}

.hero-desc {
  font-size: 1.125rem; /* text-lg */
  color: #64748b; /* text-slate-500 */
  max-width: 32rem; /* max-w-lg */
  line-height: 1.625; /* leading-relaxed */
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem; /* gap-4 */
  padding-top: 1rem; /* pt-4 */
}

.btn-primary-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  margin-left: 0.5rem; /* ml-2 */
  transition-property: transform;
  transition-duration: 150ms;
}

.group:hover .btn-primary-icon {
  transform: translateX(0.25rem); /* group-hover:translate-x-1 */
}

.hero-visual {
  position: relative;
}
@media (min-width: 1024px) {
  .hero-visual {
    margin-left: auto; /* lg:ml-auto */
  }
}

.hero-image-wrapper {
  padding: 1rem; /* p-4 */
  position: relative;
  z-index: 10;
  max-width: 28rem; /* max-w-md */
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  transform: rotate(3deg);
  transition-property: transform;
  transition-duration: 500ms;
  background-color: #fff;
  border-radius: 1.5rem;
  box-shadow:
    0 0 0 #000000,
    0 0px 0px 0px rgba(0, 0, 0, 0.03),
    0 8px 30px rgb(0, 0, 0, 0.04); /* shadow-md */
}
.hero-image-wrapper:hover {
  transform: rotate(0deg);
}

.hero-image {
  border-radius: 1rem; /* rounded-2xl */
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
}

.floating-badge {
  position: absolute;
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  padding-top: 0.75rem; /* py-3 */
  padding-bottom: 0.75rem;
  border-radius: 1rem; /* rounded-2xl */
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  background-color: rgba(255, 255, 255, 0.7); /* bg-white/70 */
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  border: 1px solid rgba(241, 245, 249, 0.5); /* border border-slate-100/50 */
  box-shadow:
    0 4px 10px -1px rgba(0, 0, 0, 0.05),
    0 2px 6px -1px rgba(0, 0, 0, 0.03); /* shadow-md */
}

.badge-1 {
  left: -3rem; /* -left-12 */
  top: 3rem; /* top-12 */
  animation: bounce 4s infinite;
}

.badge-2 {
  right: -3rem; /* -right-12 */
  bottom: 3rem; /* bottom-12 */
  animation: bounce 5s infinite;
}

.badge-icon-wrap {
  width: 2.5rem; /* w-10 */
  height: 2.5rem; /* h-10 */
  border-radius: 9999px; /* rounded-full */
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-rose {
  background-color: #ffe4e6; /* bg-rose-100 */
  color: #f43f5e; /* text-rose-500 */
}

.icon-blue {
  background-color: #dbeafe; /* bg-blue-100 */
  color: #3b82f6; /* text-blue-500 */
}

.badge-icon {
  width: 1.25rem; /* w-5 */
  height: 1.25rem; /* h-5 */
}

.badge-title {
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  margin: 0;
}

.badge-subtitle {
  font-size: 0.75rem; /* text-xs */
  color: #64748b; /* text-slate-500 */
  margin: 0;
}

.recent-posts-section {
  padding-top: 5rem; /* py-20 */
  padding-bottom: 5rem;
}

.recent-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3rem; /* mb-12 */
}

.recent-title {
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem;
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  margin-bottom: 0.5rem; /* mb-2 */
}

.recent-desc {
  color: #64748b; /* text-slate-500 */
  margin: 0;
}

.recent-view-all {
  display: none; /* hidden */
  align-items: center;
  color: #f43f5e; /* text-rose-500 */
  font-weight: 500; /* font-medium */
  transition-property: color;
  transition-duration: 150ms;
  text-decoration: none;
}
.recent-view-all:hover {
  color: #e11d48; /* hover:text-rose-600 */
}
@media (min-width: 640px) {
  .recent-view-all {
    display: flex; /* sm:flex */
  }
}

.view-all-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  margin-left: 0.25rem; /* ml-1 */
  transition-property: transform;
  transition-duration: 150ms;
}
.group:hover .view-all-icon {
  transform: translateX(0.25rem); /* group-hover:translate-x-1 */
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem; /* gap-8 */
}
@media (min-width: 768px) {
  .recent-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .recent-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.post-card {
  padding: 1.5rem 2rem; /* p-8 */
  transition-property: all;
  transition-duration: 300ms;
  text-decoration: none;
  display: block;
  background-color: white; /* bg-white */
  border-radius: 1.5rem; /* rounded-3xl */
  /* box-shadow: 0 4px 6px -1px rgba(158, 158, 158, 0.05), 0 2px 4px -1px rgba(110, 110, 110, 0.05);  */
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.02),
    0 0 rgb(0, 0, 0, 0.02),
    0 8px 30px rgb(0, 0, 0, 0.04);
}
.post-card:hover {
  transform: translateY(-0.5rem); /* hover:-translate-y-2 */
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.03),
    0 20px 25px -5px rgb(244, 63, 94, 0.1),
    0 8px 10px -6px rgb(244, 63, 94, 0.1); /* hover:shadow-xl hover:shadow-rose-500/10 */
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 1rem; /* gap-4 */
  margin-bottom: 1rem; /* mb-4 */
}

.post-tag {
  padding-left: 0.75rem; /* px-3 */
  padding-right: 0.75rem;
  padding-top: 0.25rem; /* py-1 */
  padding-bottom: 0.25rem;
  border-radius: 9999px; /* rounded-full */
  background-color: #fff1f2; /* bg-rose-50 */
  color: #e11d48; /* text-rose-600 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
}

.post-date {
  font-size: 0.75rem; /* text-xs */
  color: #94a3b8; /* text-slate-400 */
}

.post-title {
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  margin-bottom: 0.75rem; /* mb-3 */
  transition-property: color;
  transition-duration: 150ms;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-card:hover .post-title {
  color: #f43f5e; /* group-hover:text-rose-500 */
}

.post-desc {
  color: #64748b; /* text-slate-500 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.625; /* leading-relaxed */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.mobile-view-all {
  margin-top: 2rem; /* mt-8 */
  text-align: center;
}
@media (min-width: 640px) {
  .mobile-view-all {
    display: none; /* sm:hidden */
  }
}

.w-full-btn {
  width: 100%;
}
</style>
