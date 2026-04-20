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
  margin-top: 6rem; /* mt-24 */
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
  transition-property: transform;
  transition-duration: 300ms;
}

.group:hover .footer-logo-icon {
  transform: scale(1.1); /* group-hover:scale-110 */
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
  color: var(--color-text);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.footer-link:hover {
  color: #f43f5e; /* hover:text-rose-500 */
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
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  background: transparent;
  border: none;
  cursor: pointer;
}

.footer-back-to-top:hover {
  color: var(--color-primary); /* hover:text-rose-500 */
}

.footer-btt-icon-wrap {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  border-radius: 9999px; /* rounded-full */
  background-color: var(--color-border); /* bg-slate-50 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.group:hover .footer-btt-icon-wrap {
  background-color: var(--color-secondary); /* group-hover:bg-rose-50 */
}

.footer-btt-icon {
  width: 1rem; /* w-4 */
  height: 1rem; /* h-4 */
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.group:hover .footer-btt-icon {
  transform: translateY(-0.125rem) translateX(0.125rem); /* group-hover:-translate-y-0.5 group-hover:translate-x-0.5 */
}
</style>
