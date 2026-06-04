<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { ArrowRight, Code2, Coffee, Sparkles } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { gsap } from 'gsap'
import { getLatestArticles } from '@/api/blog'
import { date } from '@/utils/date'
import type { ArticleSummary } from '@/types/content'

const homeRoot = ref<HTMLElement | null>(null)
const latestArticles = ref<ArticleSummary[]>([])
const latestLoaded = ref(false)
let ctx: gsap.Context | undefined
const cleanups: Array<() => void> = []
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
const isMobileViewport = () => window.matchMedia?.('(max-width: 767px)').matches ?? false
const shouldAnimateRecentPosts = () => !prefersReducedMotion() && !isMobileViewport()

const recentPostMotionInitial = () => {
  if (!shouldAnimateRecentPosts()) return { opacity: 1, y: 0 }

  return { opacity: 0, y: 24 }
}

const recentPostMotionEnter = () => {
  if (!shouldAnimateRecentPosts()) {
    return { opacity: 1, y: 0, transition: { duration: 0 } }
  }

  return {
    opacity: 1,
    y: 0,
    transition: { duration: 820 },
  }
}

onMounted(() => {
  void loadLatestArticles()

  if (!homeRoot.value) return

  const reduceMotion = prefersReducedMotion()

  ctx = gsap.context(() => {
    if (reduceMotion) {
      return
    }

    gsap
      .timeline({ delay: 0.18, defaults: { ease: 'power3.out' } })
      .from('.hero-badge, .hero-title, .hero-desc, .hero-actions', {
        autoAlpha: 0,
        y: 28,
        duration: 0.68,
        stagger: 0.08,
      })
      .from(
        '.hero-image-wrapper',
        {
          autoAlpha: 0,
          y: 0,
          rotation: 3,
          scaleX: 1,
          scaleY: 1,
          duration: 0.9,
          ease: 'power3.out',
        },
        '<0.18',
      )
      .from(
        '.floating-badge',
        {
          autoAlpha: 0,
          scaleX: 0.9,
          scaleY: 0.9,
          stagger: 0.12,
          duration: 0.62,
          ease: 'back.out(1.45)',
        },
        '<0.24',
      )

    gsap.to('.badge-1 .floating-badge', {
      y: -12,
      rotation: -2,
      repeat: -1,
      yoyo: true,
      duration: 2.7,
      ease: 'sine.inOut',
    })

    gsap.to('.badge-2 .floating-badge', {
      y: 10,
      rotation: 2,
      repeat: -1,
      yoyo: true,
      duration: 3.2,
      ease: 'sine.inOut',
    })

    gsap.from('.recent-header, .mobile-view-all', {
      autoAlpha: 0,
      y: 22,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.45,
    })

    gsap.to('.hero-image-wrapper', {
      y: 110,
      rotation: -4,
      scaleX: 1.04,
      scaleY: 1.04,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.1,
      },
    })

    gsap.to('.badge-1', {
      y: -82,
      x: -28,
      rotation: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    })

    gsap.to('.badge-2', {
      y: 76,
      x: 34,
      rotation: 9,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.85,
      },
    })

    gsap.to('.blob-1', {
      y: 150,
      x: -70,
      scaleX: 1.18,
      scaleY: 1.18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.4,
      },
    })

    gsap.to('.blob-2', {
      y: -120,
      x: 90,
      scaleX: 0.9,
      scaleY: 0.9,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })
  }, homeRoot.value)

  if (reduceMotion || !homeRoot.value) return

  const imageWrapper = homeRoot.value.querySelector<HTMLElement>('.hero-image-wrapper')
  if (imageWrapper) {
    const rotateTo = gsap.quickTo(imageWrapper, 'rotation', { duration: 0.45, ease: 'power3.out' })
    const scaleXTo = gsap.quickTo(imageWrapper, 'scaleX', { duration: 0.45, ease: 'power3.out' })
    const scaleYTo = gsap.quickTo(imageWrapper, 'scaleY', { duration: 0.45, ease: 'power3.out' })
    const enter = () => {
      rotateTo(0)
      scaleXTo(1.02)
      scaleYTo(1.02)
    }
    const leave = () => {
      rotateTo(3)
      scaleXTo(1)
      scaleYTo(1)
    }

    imageWrapper.addEventListener('mouseenter', enter)
    imageWrapper.addEventListener('mouseleave', leave)
    cleanups.push(() => {
      imageWrapper.removeEventListener('mouseenter', enter)
      imageWrapper.removeEventListener('mouseleave', leave)
    })
  }

  homeRoot.value.querySelectorAll<HTMLElement>('.post-card').forEach((card) => {
    const enter = () =>
      gsap.to(card, { y: -8, scaleX: 1.01, scaleY: 1.01, duration: 0.28, ease: 'power2.out' })
    const leave = () =>
      gsap.to(card, { y: 0, scaleX: 1, scaleY: 1, duration: 0.28, ease: 'power2.out' })

    card.addEventListener('mouseenter', enter)
    card.addEventListener('mouseleave', leave)
    cleanups.push(() => {
      card.removeEventListener('mouseenter', enter)
      card.removeEventListener('mouseleave', leave)
    })
  })
})

const loadLatestArticles = async () => {
  latestLoaded.value = false
  try {
    latestArticles.value = await getLatestArticles(3)
  } catch {
    latestArticles.value = []
  } finally {
    latestLoaded.value = true
    await nextTick()
    setupRecentPostsParallax()
  }
}

const setupRecentPostsParallax = () => {
  if (!homeRoot.value || prefersReducedMotion() || isMobileViewport()) return

  gsap.to(
    '.recent-posts-section',
    {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.recent-posts-section',
        start: 'top 65%',
        end: 'top 35%',
        scrub: 1,
      },
    },
  )
}

onUnmounted(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup())
  ctx?.revert()
})
</script>

<template>
  <div ref="homeRoot" class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Decorative Background Blobs -->
      <div class="blob-1"></div>
      <div class="blob-2"></div>

      <div class="hero-grid">
        <!-- Text Content -->
        <div class="hero-text-content">
          <div class="hero-badge">
            <Sparkles class="hero-badge-icon" />
            <span>欢迎来到我的数字花园</span>
          </div>

          <h1 class="hero-title">
            慢一点，<br />
            <span class="hero-title-highlight">也没关系</span>，<br />
            <span class="hero-title-line-long">生活本来就可以慢慢记录。</span>
          </h1>

          <p class="hero-desc">
            把日常里的微光、心情和小事，慢慢写给现在与以后的自己。
          </p>

          <div class="hero-actions">
            <RouterLink to="/blog" class="btn-primary group">
              阅读文章
              <ArrowRight class="btn-primary-icon" />
            </RouterLink>
            <RouterLink to="/diary" class="btn-secondary"> 翻翻日记 </RouterLink>
            <RouterLink to="/portfolio" class="btn-secondary"> 查看作品 </RouterLink>
          </div>
        </div>

        <!-- Image / Visual Content -->
        <div class="hero-visual">
          <div class="hero-image-wrapper">
            <img
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20and%20fresh%20workspace%2C%20bright%20lighting%2C%20a%20plant%2C%20soft%20colors&image_size=square"
              alt="Workspace"
              class="hero-image"
            />
            <!-- Floating badge 1 -->
            <div class="floating-badge-shell badge-1">
              <div class="floating-badge">
                <div class="badge-icon-wrap icon-rose">
                  <Code2 class="badge-icon" />
                </div>
                <div>
                  <p class="badge-title">HTML & CSS & JS</p>
                  <p class="badge-subtitle">Frontend</p>
                </div>
              </div>
            </div>
            <!-- Floating badge 2 -->
            <div class="floating-badge-shell badge-2">
              <div class="floating-badge">
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
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="recent-posts-section">
      <div class="recent-header">
        <div>
          <h2 class="recent-title">最新文章</h2>
          <p class="recent-desc">记录技术与生活的点滴。</p>
        </div>
        <RouterLink to="/blog" class="recent-view-all group">
          查看全部
          <ArrowRight class="view-all-icon" />
        </RouterLink>
      </div>

      <div
        v-if="latestArticles.length"
        v-motion
        :initial="recentPostMotionInitial()"
        :visible-once="recentPostMotionEnter()"
        class="recent-grid"
      >
        <RouterLink
          v-for="article in latestArticles"
          :key="article.id"
          :to="`/blog/${article.id}`"
          class="post-card group"
        >
          <div class="post-meta">
            <span class="post-tag">{{ article.tag || '文章' }}</span>
            <span class="post-date">{{ date(article.createTime) }}</span>
          </div>
          <h3 class="post-title">{{ article.title }}</h3>
          <p class="post-desc">
            {{ article.describe || '暂无简介' }}
          </p>
        </RouterLink>
      </div>

      <div v-else-if="latestLoaded" class="recent-empty">暂无文章</div>

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
  max-width: var(--site-page-max-width); /* max-w-screen-2xl */
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
    padding-left: var(--site-page-padding-wide); /* xl:px-48 */
    padding-right: var(--site-page-padding-wide);
  }
}

@media (min-width: 2561px) {
  .home-container {
    padding-left: clamp(7rem, 6vw, 9rem);
    padding-right: clamp(7rem, 6vw, 9rem);
  }
}

@media (min-width: 3840px) {
  .home-container {
    padding-left: clamp(8rem, 6vw, 12rem);
    padding-right: clamp(8rem, 6vw, 12rem);
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
    padding-bottom: 5.5rem;
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

:global(html.dark .blob-1) {
  background-color: rgba(255, 228, 230, 0.14);
  filter: blur(120px);
  opacity: 0.46;
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

:global(html.dark .blob-2) {
  background-color: rgba(219, 234, 254, 0.1);
  filter: blur(100px);
  opacity: 0.38;
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

.hero-badge,
.hero-title,
.hero-desc,
.hero-actions {
  will-change: transform, opacity;
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
  background-color: var(--color-secondary); /* bg-rose-50 */
  color: var(--color-primary); /* text-rose-600 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  align-self: flex-start;
}
:global(html.dark .hero-badge){
  background-color: rgba(244, 63, 94, 0.15);
}

.hero-badge-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
}

.hero-title {
  font-size: 3rem; /* text-5xl */
  font-weight: 700; /* font-bold */
  color: var(--color-heading); /* text-slate-900 */
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
  background-image: linear-gradient(
    to right,
    var(--color-primary),
    #fb7185
  ); /* from-rose-500 to-rose-400 */
}

.hero-title-line-long {
  display: inline-block;
  font-size: 0.82em;
  white-space: nowrap;
}

.hero-desc {
  font-size: 1.125rem; /* text-lg */
  color: var(--color-text); /* text-slate-500 */
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
  background-color: var(--color-card);
  border-radius: 1.5rem;
  will-change: transform;
  box-shadow:
    0 0 0 #000000,
    0 0px 0px 0px rgba(0, 0, 0, 0.03),
    0 8px 30px rgb(0, 0, 0, 0.04); /* shadow-md */
    pointer-events: none;
}



.hero-image {
  border-radius: 1rem; /* rounded-2xl */
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
}

.floating-badge-shell {
  position: absolute;
  will-change: transform;
}

.floating-badge {
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem;
  padding-top: 0.75rem; /* py-3 */
  padding-bottom: 0.75rem;
  border-radius: 1rem; /* rounded-2xl */
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  background-color: var(--color-card); /* bg-white/70 */
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  border: 1px solid var(--color-border); /* border border-slate-100/50 */
  box-shadow:
    0 4px 10px -1px rgba(0, 0, 0, 0.05),
    0 2px 6px -1px rgba(0, 0, 0, 0.03); /* shadow-md */
  will-change: transform;
}
:global(html.dark .floating-badge){
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.badge-1 {
  left: -3rem; /* -left-12 */
  top: 3rem; /* top-12 */
}

.badge-2 {
  right: -3rem; /* -right-12 */
  bottom: 3rem; /* bottom-12 */
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
  background-color: var(--color-secondary); /* bg-rose-100 */
  color: var(--color-primary); /* text-rose-500 */
}
:global(html.dark .icon-rose){
  background-color: rgba(244, 63, 94, 0.15);
}

.icon-blue {
  background-color: #dbeafe; /* bg-blue-100 */
  color: #3b82f6; /* text-blue-500 */
}
:global(html.dark .icon-blue){
  background-color: rgba(59, 130, 246, 0.15);
}

.badge-icon {
  width: 1.25rem; /* w-5 */
  height: 1.25rem; /* h-5 */
}

.badge-title {
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* font-bold */
  color: var(--color-heading); /* text-slate-900 */
  margin: 0;
}

.badge-subtitle {
  font-size: 0.75rem; /* text-xs */
  color: var(--color-text); /* text-slate-500 */
  margin: 0;
}

.recent-posts-section {
  padding-top: 5rem; /* py-20 */
  padding-bottom: 0.625rem;
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
  color: var(--color-heading); /* text-slate-900 */
  margin-bottom: 0.5rem; /* mb-2 */
}

.recent-desc {
  color: var(--color-text); /* text-slate-500 */
  margin: 0;
}

.recent-view-all {
  display: none; /* hidden */
  align-items: center;
  color: var(--color-primary);
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

.recent-empty {
  padding: 3rem 1.5rem;
  border-radius: 1.5rem;
  background-color: var(--color-card);
  color: var(--color-text);
  text-align: center;
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.02),
    0 8px 30px rgb(0, 0, 0, 0.04);
}

:global(html.dark .recent-empty){
  background-color: #162032;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
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

@media (min-width: 2561px) {
  .recent-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2.25rem;
  }
}

.post-card {
  padding: 1.5rem 2rem; /* p-8 */
  transition-property: transform, box-shadow, border-color, background-color;
  transition-duration: 300ms;
  text-decoration: none;
  display: block;
  background-color: var(--color-card); /* bg-white */
  border-radius: 1.5rem; /* rounded-3xl */
  /* box-shadow: 0 4px 6px -1px rgba(158, 158, 158, 0.05), 0 2px 4px -1px rgba(110, 110, 110, 0.05);  */
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.02),
    0 0 rgb(0, 0, 0, 0.02),
    0 8px 30px rgb(0, 0, 0, 0.04);
  border: 1px solid transparent;
  will-change: transform;
}
.post-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow:
    0 -1px 0 0 rgb(0, 0, 0, 0.03),
    0 20px 25px -5px rgb(244, 63, 94, 0.1),
    0 8px 10px -6px rgb(244, 63, 94, 0.1); /* hover:shadow-xl hover:shadow-rose-500/10 */
}

:global(html.dark .post-card){
  background-color: #162032;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.05);
}
:global(html.dark .post-card:hover){
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
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
  background-color: var(--color-secondary); /* bg-rose-50 */
  color: var(--color-primary); /* text-rose-600 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
}
:global(html.dark .post-tag){
  background-color: rgba(244, 63, 94, 0.15);
  color: var(--color-primary);
}

.post-date {
  font-size: 0.75rem; /* text-xs */
  color: var(--color-text); /* text-slate-400 */
}

.post-title {
  font-size: 1.25rem; /* text-xl */
  line-height: 1.75rem;
  font-weight: 700; /* font-bold */
  color: var(--color-heading); /* text-slate-900 */
  margin-bottom: 0.75rem; /* mb-3 */
  transition-property: color;
  transition-duration: 150ms;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
:global(html.dark .post-title){
  color: #e2e8f0;
}
.post-card:hover .post-title {
  color: var(--color-primary); /* group-hover:text-rose-500 */
}

.post-desc {
  color: var(--color-text); /* text-slate-500 */
  font-size: 0.875rem; /* text-sm */
  line-height: 1.625; /* leading-relaxed */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}
:global(html.dark .post-desc){
  color: #64748b;
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

@media (max-width: 767px) {
  .home-container,
  .hero-section,
  .hero-grid,
  .hero-visual {
    overflow-x: clip;
  }

  .home-container {
    padding-top: 5.5rem;
    padding-bottom: 2rem;
  }

  .hero-section {
    padding-top: 3rem;
    padding-bottom: 2rem;
  }

  .hero-grid {
    gap: 2rem;
  }

  .hero-text-content {
    gap: 1.35rem;
  }

  .hero-badge,
  .hero-visual {
    display: none;
  }

  .hero-title {
    font-size: 2.5rem;
    line-height: 1.16;
  }

  .hero-title-line-long {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  .hero-actions .btn-primary,
  .hero-actions .btn-secondary,
  .mobile-view-all .btn-secondary {
    min-height: 2.75rem;
  }

  .recent-posts-section {
    padding-top: 2rem;
  }

  .recent-header {
    margin-bottom: 1.25rem;
  }

  .recent-desc {
    display: none;
  }

  .recent-grid {
    gap: 0.75rem;
  }

  .post-card {
    padding: 1rem;
    border-radius: 1rem;
  }

  .post-meta {
    margin-bottom: 0.55rem;
  }

  .post-title {
    margin-bottom: 0.35rem;
    font-size: 1rem;
    line-height: 1.45rem;
  }

  .post-desc {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}
</style>
