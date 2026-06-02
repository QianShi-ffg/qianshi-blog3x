<script setup lang="ts">
import { ArrowUpRight, Heart } from 'lucide-vue-next'

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="footer-wrapper">
    <div class="footer-container">

      <div class="footer-grid mb-16">
        <!-- Brand -->
        <div class="footer-brand">
          <router-link to="/" class="footer-logo-link group">
            <div class="footer-logo-icon">
              R
            </div>
            <span class="footer-logo-text">QianShiBlog</span>
          </router-link>
          <p class="footer-desc">
            一个记录生活、分享技术、展示作品的个人空间。保持热爱，奔赴山海。
          </p>
        </div>

        <!-- Links -->
        <div class="footer-links-col">
          <h3 class="footer-heading">快速导航</h3>
          <ul class="footer-list">
            <li><router-link to="/blog" class="footer-link">编程文章</router-link></li>
            <li><router-link to="/diary" class="footer-link">生活日记</router-link></li>
            <li><router-link to="/portfolio" class="footer-link">作品展示</router-link></li>
            <li><router-link to="/resume" class="footer-link">关于我</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-links-col">
          <h3 class="footer-heading">联系方式</h3>
          <ul class="footer-list">
            <li><a href="mailto:hello@example.com" class="footer-link">hello@QianShiBlog.dev</a></li>
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="footer-link">Twitter</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <p class="footer-copyright">
          &copy; {{ new Date().getFullYear() }} QianShiBlog. Made with <Heart class="footer-heart-icon" /> by You
        </p>

        <button
          @click="scrollToTop"
          class="footer-back-to-top group"
        >
          返回顶部
          <div class="footer-btt-icon-wrap">
            <ArrowUpRight class="footer-btt-icon" />
          </div>
        </button>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  margin-top: 3rem;
}

.footer-container {
  max-width: 1536px; /* max-w-screen-2xl */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  padding-top: 4rem; /* py-16 */
  padding-bottom: 4rem;
}

@media (min-width: 768px) {
  .footer-container {
    padding-left: 3rem; /* px-12 */
    padding-right: 3rem;
  }
}

@media (min-width: 1024px) {
  .footer-container {
    padding-top: 6rem; /* py-24 */
    padding-bottom: 6rem;
  }
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 3rem; /* gap-12 */
  margin-bottom: 4rem; /* mb-16 */
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2rem; /* gap-8 */
  }
}

.footer-brand {
  /* lg:col-span-2 */
}
@media (min-width: 1024px) {
  .footer-brand {
    grid-column: span 2 / span 2;
  }
}

.footer-logo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  margin-bottom: 1.5rem; /* mb-6 */
  transition: color 220ms ease;
}

.footer-logo-icon {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  border-radius: 9999px; /* rounded-full */
  background-color: #f43f5e; /* bg-rose-500 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700; /* font-bold */
  font-size: 1.125rem; /* text-lg */
  transition:
    background-color 260ms ease,
    box-shadow 260ms ease,
    transform 260ms ease;
}

.group:hover .footer-logo-icon {
  background-color: #fb7185;
  box-shadow: 0 8px 18px rgba(244, 63, 94, 0.16);
  transform: scale(1.04);
}

.footer-logo-text {
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.025em; /* tracking-tight */
  font-size: 1.25rem; /* text-xl */
}

.footer-desc {
  color: var(--color-text);
  line-height: 1.625; /* leading-relaxed */
  max-width: 24rem; /* max-w-sm */
}

.footer-links-col {
  /* Wrapper for links */
}

.footer-heading {
  font-weight: 600; /* font-semibold */
  color: var(--color-heading);
  margin-bottom: 1.5rem; /* mb-6 */
  letter-spacing: -0.025em; /* tracking-tight */
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
}

.footer-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 0.125rem 0.375rem;
  margin-left: -0.375rem;
  border-radius: 0.5rem;
  isolation: isolate;
  color: var(--color-text);
  transition:
    color 240ms ease;
}

.footer-link::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: -0.35rem;
  right: -0.35rem;
  top: 50%;
  height: 1.45rem;
  border-radius: 9999px;
  background: rgba(244, 63, 94, 0.16);
  filter: blur(12px);
  opacity: 0;
  transform: translateY(-50%) scaleX(0.72);
  transition:
    opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.footer-link:hover {
  color: #f43f5e; /* hover:text-rose-500 */
}

.footer-link:hover::before {
  opacity: 1;
  transform: translateY(-50%) scaleX(1);
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem; /* pt-8 */
  border-top: 1px solid var(--color-border); /* border-slate-100 */
  gap: 1rem; /* gap-4 */
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
  }
}

@media (max-width: 767px) {
  .footer-logo-link {
    min-height: 44px;
  }

  .footer-list {
    gap: 0.5rem;
  }

  .footer-link {
    min-height: 44px;
    padding: 0.625rem 0.5rem;
  }

  .footer-back-to-top {
    min-height: 44px;
  }
}

.footer-copyright {
  color: var(--color-text); /* text-slate-400 */
  font-size: 0.875rem; /* text-sm */
  display: flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  opacity: 0.8;
}

.footer-heart-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  color: var(--color-primary); /* text-rose-500 */
  fill: var(--color-primary); /* fill-rose-500 */
}

.footer-back-to-top {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: var(--color-text); /* text-slate-500 */
  padding: 0.25rem 0.25rem 0.25rem 0.75rem;
  border-radius: 9999px;
  transition:
    color 240ms ease,
    background-color 320ms cubic-bezier(0.22, 1, 0.36, 1);
  background: transparent;
  border: none;
  cursor: pointer;
}

.footer-back-to-top:hover {
  color: var(--color-primary); /* hover:text-rose-500 */
  background-color: rgba(244, 63, 94, 0.06);
}

.footer-btt-icon-wrap {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  border-radius: 9999px; /* rounded-full */
  background-color: var(--color-border); /* bg-slate-50 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 240ms ease,
    box-shadow 240ms ease;
}

.group:hover .footer-btt-icon-wrap {
  background-color: var(--color-secondary); /* group-hover:bg-rose-50 */
  box-shadow: inset 0 0 0 1px rgba(244, 63, 94, 0.08);
}

.footer-btt-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.group:hover .footer-btt-icon {
  transform: translateX(0.125rem);
}
</style>
