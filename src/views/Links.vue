<script setup lang="ts">
import { ExternalLink, Github, Twitter, Globe, Link as LinkIcon } from 'lucide-vue-next'
import { applyFriendShip, getFriendShipList } from '@/api/friendShip';
import { onMounted, onUnmounted, ref } from 'vue';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerRouteTransitionCleanup } from '@/utils/route-transition-cleanup'


const links = ref<any[]>([]);
const isLinksLoading = ref(true)
const isApplyDialogOpen = ref(false)
const isSubmittingApply = ref(false)
const applyMessage = ref('')
const applyForm = ref({
  name: '',
  blogUrl: '',
  icon: '',
  desc: '',
  contact: '',
  hasBacklink: true,
})
const linksRoot = ref<HTMLElement | null>(null)
let headerParallaxCtx: gsap.Context | undefined
let unregisterTransitionCleanup: (() => void) | undefined
let previousBodyOverflow = ''
let previousBodyPaddingRight = ''

const lockBodyScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  previousBodyOverflow = document.body.style.overflow
  previousBodyPaddingRight = document.body.style.paddingRight
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }
  document.body.style.setProperty('--lk-scrollbar-compensation', `${scrollbarWidth}px`)
  document.body.classList.add('lk-scroll-locked')
}

const unlockBodyScroll = () => {
  document.body.style.overflow = previousBodyOverflow
  document.body.style.paddingRight = previousBodyPaddingRight
  document.body.style.removeProperty('--lk-scrollbar-compensation')
  document.body.classList.remove('lk-scroll-locked')
}

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

const setupHeaderParallax = () => {
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()

  if (!linksRoot.value || prefersReducedMotion()) return

  headerParallaxCtx = gsap.context(() => {
    const header = linksRoot.value?.querySelector<HTMLElement>('.lk-header-wrapper')
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
  }, linksRoot.value)

  unregisterTransitionCleanup = registerRouteTransitionCleanup(() => {
    headerParallaxCtx?.revert()
    headerParallaxCtx = undefined
    unregisterTransitionCleanup = undefined
  })

  ScrollTrigger.refresh()
}

onMounted(async() => {
  isLinksLoading.value = true
  try {
    const res = await getFriendShipList({page: 1, pageSize: 1000, sort: 'ASC', status: 'approved'})
    links.value = (res as any).map((item: any) => {
      item.screenShot = item.screenShot ? `${import.meta.env.VITE_API_BASE_URL}${item.screenShot}` : ''
      return item
    })
  } finally {
    isLinksLoading.value = false
    setupHeaderParallax()
  }
})

const openApplyDialog = () => {
  applyMessage.value = ''
  lockBodyScroll()
  isApplyDialogOpen.value = true
}

const closeApplyDialog = () => {
  if (isSubmittingApply.value) return
  isApplyDialogOpen.value = false
}

const submitApply = async () => {
  applyMessage.value = ''
  if (!applyForm.value.name.trim() || !applyForm.value.blogUrl.trim() || !applyForm.value.icon.trim()) {
    applyMessage.value = '请填写站点名称、站点地址和头像/图标地址。'
    return
  }
  if (!applyForm.value.hasBacklink) {
    applyMessage.value = '请先确认已添加本站链接。'
    return
  }

  isSubmittingApply.value = true
  try {
    await applyFriendShip({
      name: applyForm.value.name.trim(),
      blogUrl: applyForm.value.blogUrl.trim(),
      icon: applyForm.value.icon.trim(),
      desc: applyForm.value.desc.trim(),
      contact: applyForm.value.contact.trim(),
      hasBacklink: applyForm.value.hasBacklink,
    })
    applyMessage.value = '申请已提交，审核通过后会展示在这里。'
    applyForm.value = {
      name: '',
      blogUrl: '',
      icon: '',
      desc: '',
      contact: '',
      hasBacklink: false,
    }
  } catch (error) {
    applyMessage.value = error instanceof Error ? error.message : '提交失败，请稍后再试。'
  } finally {
    isSubmittingApply.value = false
  }
}

onUnmounted(() => {
  unlockBodyScroll()
  unregisterTransitionCleanup?.()
  headerParallaxCtx?.revert()
})

</script>

<template>
  <div ref="linksRoot" class="lk-page-container">
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
      <button
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
        type="button"
        @click="openApplyDialog"
        class="lk-btn-apply"
      >
        <LinkIcon class="lk-btn-apply-icon" />
        申请互链
      </button>
    </div>

    <!-- Links Grid -->
    <div v-if="isLinksLoading" class="lk-grid" aria-live="polite" aria-busy="true">
      <div v-for="item in 6" :key="item" class="lk-card lk-card-skeleton">
        <div class="lk-card-inner relative z-10">
          <div class="lk-card-content">
            <div class="lk-skeleton-icon"></div>
            <div class="lk-skeleton-info">
              <span class="lk-skeleton-title"></span>
              <span class="lk-skeleton-text"></span>
              <span class="lk-skeleton-text lk-skeleton-text-short"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="lk-grid">
      <a
        v-for="(link, index) in links"
        :key="link.id"
        :href="link.blogUrl"
        target="_blank"
        rel="noopener noreferrer"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
        class="lk-card interactive-card group"
      >
        <!-- 网站缩略图 (Hover显示) -->
        <div
          v-if="link.screenShot"
          class="lk-card-preview interactive-media"
        >
          <img
            :src="`${link.screenShot}`"
            class="lk-card-preview-img"
            loading="lazy"
          />
          <div class="lk-card-preview-mask"></div>
        </div>

        <div class="lk-card-inner relative z-10">
          <div class="lk-card-content">
            <div class="lk-icon-wrap">
              <!-- <component :is="link.icon" class="lk-icon" :class="link.color" /> -->
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

    <Teleport to="body">
      <Transition name="lk-dialog-fade" @after-leave="unlockBodyScroll">
        <div v-if="isApplyDialogOpen" class="lk-dialog-backdrop" @click.self="closeApplyDialog">
          <div class="lk-apply-dialog" role="dialog" aria-modal="true" aria-labelledby="friend-link-apply-title">
            <div class="lk-dialog-header">
              <div>
                <p class="lk-dialog-kicker">Friend Link</p>
                <h2 id="friend-link-apply-title" class="lk-dialog-title">申请互链</h2>
              </div>
              <button type="button" class="lk-dialog-close" aria-label="关闭" @click="closeApplyDialog">×</button>
            </div>

            <div class="lk-dialog-form">
              <label class="lk-field">
                <span>站点名称</span>
                <input v-model="applyForm.name" type="text" placeholder="例如：QianShiBlog" />
              </label>
              <label class="lk-field">
                <span>站点地址</span>
                <input v-model="applyForm.blogUrl" type="url" placeholder="https://example.com" />
              </label>
              <label class="lk-field">
                <span>头像/图标地址</span>
                <input v-model="applyForm.icon" type="url" placeholder="https://example.com/avatar.png" />
              </label>
              <label class="lk-field">
                <span>站长昵称/联系方式</span>
                <input v-model="applyForm.contact" type="text" placeholder="昵称、邮箱或其他联系方式" />
              </label>
              <label class="lk-field lk-field-full">
                <span>简介</span>
                <textarea v-model="applyForm.desc" rows="4" placeholder="简单介绍一下你的网站"></textarea>
              </label>
              <!-- <label class="lk-check lk-field-full">
                <input v-model="applyForm.hasBacklink" type="checkbox" />
                <span>我已在自己的网站添加本站链接</span>
              </label> -->
              <p v-if="applyMessage" class="lk-apply-message">{{ applyMessage }}</p>
            </div>

            <div class="lk-dialog-actions">
              <button type="button" class="lk-dialog-secondary" @click="closeApplyDialog">取消</button>
              <button type="button" class="lk-dialog-primary" :disabled="isSubmittingApply" @click="submitApply">
                {{ isSubmittingApply ? '提交中' : '提交申请' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.lk-page-container {
  @apply min-h-[80vh] py-12 lg:py-20 lg:pt-32 pt-24 px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 mx-auto max-w-screen-2xl;
}

.lk-header-wrapper {
  @apply mb-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6;
  align-items: flex-end;
  will-change: transform;
}

.lk-header-text {
  @apply flex flex-col;
}

.lk-btn-apply {
  @apply inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-rose-50 text-rose-500 font-medium hover:bg-rose-100 transition-all duration-300 shadow-sm hover:shadow-rose-500/20 self-start sm:self-auto shrink-0;
  border: 0;
  cursor: pointer;
}

.lk-btn-apply-icon {
  @apply w-4 h-4;
}

.lk-title {
  @apply text-4xl md:text-5xl font-bold tracking-tight mb-4;
  color: var(--color-heading);
}
:global(html.dark .lk-title){
  color: #e2e8f0;
}

.lk-subtitle {
  @apply text-lg max-w-2xl;
  color: var(--color-text);
}

.lk-grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20 auto-rows-fr;
}

.lk-card {
  @apply rounded-3xl p-6 h-full flex flex-col justify-center relative overflow-hidden;
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

:global(html.dark .lk-card:hover) {
  background-color: rgba(15, 23, 42, 0.86);
  border-color: rgba(244, 63, 94, 0.18);
}

.lk-card-skeleton {
  min-height: 8.75rem;
  pointer-events: none;
}

.lk-card-skeleton:hover {
  background-color: var(--color-card);
  border-color: var(--color-border);
}

:global(html.dark .lk-card){
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.lk-card-preview {
  @apply absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl overflow-hidden;
}

.lk-card-preview-img {
  @apply w-full h-full object-cover object-top scale-100 group-hover:scale-110 transition-transform duration-[4s] ease-out opacity-90 blur-[2px] group-hover:blur-0;
}

.lk-card-preview-mask {
  @apply absolute inset-0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.24));
}

:global(html.dark .lk-card-preview-img) {
  opacity: 0.38;
}

:global(html.dark .lk-card-preview-mask) {
  background: linear-gradient(to top, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.28));
}

.lk-card-inner {
  @apply flex items-center justify-between gap-4 h-full;
  align-items: flex-start;
}

.lk-card-content {
  @apply flex items-center gap-4 w-full;
  align-items: flex-start;
}

.lk-skeleton-icon,
.lk-skeleton-title,
.lk-skeleton-text {
  display: block;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.14), rgba(244, 63, 94, 0.12), rgba(148, 163, 184, 0.14));
  background-size: 220% 100%;
  animation: lk-skeleton-shimmer 1.5s ease-in-out infinite;
}

.lk-skeleton-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  flex-shrink: 0;
}

.lk-skeleton-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

.lk-skeleton-title {
  width: 48%;
  height: 1.125rem;
}

.lk-skeleton-text {
  width: 100%;
  height: 0.875rem;
}

.lk-skeleton-text-short {
  width: 68%;
}

.lk-icon-wrap {
  @apply w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-rose-50 transition-colors;
}

:global(html.dark .lk-icon-wrap) {
  background-color: rgba(15, 23, 42, 0.58);
}

:global(html.dark .group:hover .lk-icon-wrap) {
  background-color: rgba(244, 63, 94, 0.14);
}

.lk-icon {
  @apply w-6 h-6 transition-transform duration-300 group-hover:scale-110;
}

.lk-link-name {
  @apply font-bold mb-1 transition-colors flex items-center gap-2;
  color: var(--color-heading);
}
.group:hover .lk-link-name {
  color: var(--color-primary);
}

.lk-link-name .lk-external-icon {
  @apply w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300;
}

.group:hover .lk-link-name .lk-external-icon {
  @apply opacity-100 translate-x-0;
}

.lk-link-desc {
  @apply text-sm line-clamp-2 leading-relaxed;
  color: var(--color-text);
}

.lk-tags {
  @apply flex flex-wrap gap-2 mt-4;
}

.lk-tag {
  @apply text-xs font-medium px-2.5 py-1 rounded-md;
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
:global(html.dark .lk-tag){
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
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
:global(html.dark .lk-apply-section){
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.lk-apply-title {
  @apply text-2xl font-bold mb-8;
  color: var(--color-heading);
}

.lk-apply-list {
  @apply space-y-6;
  color: var(--color-text);
}

.lk-apply-item {
  @apply flex items-start gap-4;
}

.lk-apply-dot {
  @apply w-1.5 h-1.5 rounded-full bg-rose-500 mt-2.5 shrink-0;
}

.lk-apply-info-box {
  @apply mt-3 space-y-1;
  color: var(--color-text);
  opacity: 0.8;
}

.lk-dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vh, 2rem);
  background: rgba(15, 23, 42, 0.28);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;
}

.lk-apply-dialog {
  width: min(42rem, 100%);
  max-height: calc(100dvh - clamp(2rem, 8vh, 4rem));
  overflow: hidden;
  border-radius: 1.75rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.76), rgba(255, 247, 250, 0.52)),
    var(--color-card);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow:
    0 28px 70px rgba(15, 23, 42, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.64);
  transform-origin: 50% 54%;
  display: flex;
  flex-direction: column;
}

.lk-dialog-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(1rem, 2.5vh, 1.25rem);
  flex: 0 0 auto;
}

.lk-dialog-kicker {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
}

.lk-dialog-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-heading);
}

.lk-dialog-close {
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: 9999px;
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition:
    color 0.22s ease,
    background-color 0.22s ease,
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.lk-dialog-close:hover {
  color: var(--color-primary);
  background: rgba(244, 63, 94, 0.1);
  box-shadow: 0 8px 18px rgba(244, 63, 94, 0.12);
  transform: rotate(90deg);
}

.lk-dialog-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  /* overflow-y: auto; */
  /* overflow-x: hidden; */
  overscroll-behavior: contain;
  padding: 0.1rem 0.25rem 0.1rem 0;
  min-height: 0;
  scrollbar-width: none;
}

.lk-dialog-form::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.lk-field,
.lk-check {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  font-size: 0.875rem;
  color: var(--color-text);
}

.lk-field-full {
  grid-column: 1 / -1;
}

.lk-field span,
.lk-check span {
  font-weight: 600;
  color: var(--color-heading);
}

.lk-field input,
.lk-field textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.875rem;
  padding: 0.75rem 0.875rem;
  background: var(--color-background);
  color: var(--color-text);
  outline: none;
  transition:
    border-color 0.24s ease,
    background-color 0.24s ease,
    box-shadow 0.24s ease,
    transform 0.24s ease;
  will-change: border-color, box-shadow, transform;
}

.lk-field textarea {
  min-height: clamp(6.25rem, 18vh, 8.75rem);
  resize: vertical;
}

.lk-field input:focus,
.lk-field textarea:focus,
.lk-field:focus-within input,
.lk-field:focus-within textarea {
  border-color: var(--color-primary);
  background: rgba(255, 255, 255, 0.82);
  box-shadow:
    0 0 0 4px rgba(244, 63, 94, 0.08),
    0 10px 24px rgba(244, 63, 94, 0.08);
  transform: translateY(-1px);
}

.lk-check {
  flex-direction: row;
  align-items: center;
}

.lk-check input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary);
  transition: transform 0.2s ease;
}

.lk-check input:focus-visible {
  outline: 3px solid rgba(244, 63, 94, 0.14);
  outline-offset: 3px;
}

.lk-check input:checked {
  transform: scale(1.04);
}

.lk-apply-message {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--color-primary);
  font-size: 0.875rem;
}

.lk-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex: 0 0 auto;
}

.lk-dialog-secondary,
.lk-dialog-primary {
  min-width: 5.5rem;
  border: 0;
  border-radius: 9999px;
  padding: 0.7rem 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease,
    opacity 0.22s ease;
}

.lk-dialog-secondary {
  color: var(--color-text);
  background: var(--color-background);
}

.lk-dialog-secondary:hover {
  color: var(--color-primary);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  transform: translateY(-1px);
}

.lk-dialog-primary {
  color: #fff;
  background: var(--color-primary);
}

.lk-dialog-primary:hover:not(:disabled) {
  background: #e11d48;
  box-shadow: 0 10px 24px rgba(244, 63, 94, 0.18);
  transform: translateY(-1px);
}

.lk-dialog-primary:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.lk-dialog-fade-enter-active,
.lk-dialog-fade-leave-active {
  transition:
    opacity 0.34s ease,
    backdrop-filter 0.34s ease,
    background-color 0.34s ease;
}

.lk-dialog-fade-enter-active .lk-apply-dialog,
.lk-dialog-fade-leave-active .lk-apply-dialog {
  transition:
    opacity 0.38s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}

.lk-dialog-fade-leave-active .lk-apply-dialog {
  transition:
    opacity 0.26s ease,
    transform 0.26s ease;
}

.lk-dialog-fade-enter-from,
.lk-dialog-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.lk-dialog-fade-enter-from .lk-apply-dialog,
.lk-dialog-fade-leave-to .lk-apply-dialog {
  opacity: 0;
  transform: translateY(1.35rem) scale(0.94);
}

.lk-dialog-fade-enter-to .lk-apply-dialog,
.lk-dialog-fade-leave-from .lk-apply-dialog {
  opacity: 1;
  transform: translateY(0) scale(1);
}

:global(body.lk-scroll-locked .navbar-header) {
  right: var(--lk-scrollbar-compensation, 0px);
}

:global(html.dark .lk-apply-dialog) {
  background:
    linear-gradient(145deg, rgba(30, 41, 59, 0.84), rgba(15, 23, 42, 0.72)),
    var(--color-card);
  border-color: rgba(148, 163, 184, 0.18);
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

:global(html.dark .lk-field input),
:global(html.dark .lk-field textarea) {
  background: rgba(15, 23, 42, 0.44);
  border-color: rgba(148, 163, 184, 0.2);
}

:global(html.dark .lk-field input:focus),
:global(html.dark .lk-field textarea:focus),
:global(html.dark .lk-field:focus-within input),
:global(html.dark .lk-field:focus-within textarea) {
  background: rgba(15, 23, 42, 0.64);
  border-color: rgba(251, 113, 133, 0.4);
}

@media (max-width: 640px) {
  .lk-header-wrapper {
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .lk-btn-apply {
    min-height: 48px;
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
    line-height: 1.4;
  }

  .lk-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 0;
  }

  .lk-card {
    min-height: 0;
    padding: 0.875rem 1rem;
    border-radius: 1.125rem;
    justify-content: flex-start;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.035);
  }

  .lk-card-preview,
  .lk-card-preview-img,
  .lk-card-preview-mask {
    display: none;
  }

  .lk-card-inner,
  .lk-card-content {
    min-height: 0;
    height: auto;
    gap: 0.75rem;
    align-items: center;
  }

  .lk-icon-wrap {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.875rem;
  }

  .lk-info-wrap {
    min-width: 0;
    flex: 1;
  }

  .lk-link-name {
    margin-bottom: 0.125rem;
    font-size: 0.95rem;
    line-height: 1.35;
  }

  .lk-link-name .lk-external-icon {
    opacity: 0.46;
    transform: none;
  }

  .lk-link-desc {
    font-size: 0.8125rem;
    line-height: 1.5;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .lk-card-skeleton {
    min-height: 4rem;
  }

  .lk-skeleton-icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.875rem;
  }

  .lk-skeleton-info {
    gap: 0.5rem;
    padding-top: 0;
  }

  .lk-apply-section {
    display: none;
  }

  .lk-dialog-form {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  .lk-dialog-backdrop {
    align-items: flex-start;
    padding: 0.75rem;
  }

  .lk-apply-dialog {
    width: 100%;
    max-height: calc(100dvh - 2rem);
    border-radius: 1.25rem;
    padding: 1rem;
  }

  .lk-dialog-close {
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
  }

  .lk-field input,
  .lk-field textarea {
    min-height: 44px;
  }

  .lk-field textarea {
    min-height: 7rem;
  }

  .lk-dialog-actions {
    justify-content: stretch;
    margin-top: 1rem;
  }

  .lk-dialog-secondary,
  .lk-dialog-primary {
    flex: 1;
    min-height: 44px;
  }
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

@keyframes lk-skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lk-skeleton-icon,
  .lk-skeleton-title,
  .lk-skeleton-text {
    animation: none;
  }

  .lk-dialog-fade-enter-active,
  .lk-dialog-fade-leave-active,
  .lk-dialog-fade-enter-active .lk-apply-dialog,
  .lk-dialog-fade-leave-active .lk-apply-dialog,
  .lk-field input,
  .lk-field textarea,
  .lk-dialog-close,
  .lk-dialog-secondary,
  .lk-dialog-primary {
    transition: none;
  }
}
</style>
