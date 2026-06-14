<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  disabled?: boolean
  ariaLabel?: string
}>()

const emit = defineEmits<{
  change: [page: number]
}>()

const paginationItems = computed(() => {
  const pages: Array<number | 'ellipsis'> = []
  const total = Math.max(1, props.totalPages)
  const current = props.currentPage

  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  pages.push(1)

  if (current > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }

  if (current < total - 2) {
    pages.push('ellipsis')
  }

  pages.push(total)
  return pages
})

const changePage = (page: number) => {
  const nextPage = Math.min(Math.max(page, 1), Math.max(1, props.totalPages))
  if (nextPage === props.currentPage || props.disabled) return
  emit('change', nextPage)
}
</script>

<template>
  <nav
    v-motion
    :initial="{ opacity: 0, y: 16 }"
    :enter="{ opacity: 1, y: 0, transition: { duration: 520, delay: 120 } }"
    class="app-pagination"
    :class="{ 'app-pagination-updating': disabled }"
    :aria-label="ariaLabel || '分页'"
  >
    <button
      type="button"
      class="app-pagination-arrow"
      :disabled="currentPage === 1 || disabled"
      aria-label="上一页"
      @click="changePage(currentPage - 1)"
    >
      <ChevronLeft class="app-pagination-icon" />
    </button>

    <div class="app-pagination-pages">
      <template v-for="(item, index) in paginationItems" :key="`${item}-${index}`">
        <span v-if="item === 'ellipsis'" class="app-pagination-ellipsis">...</span>
        <button
          v-else
          type="button"
          class="app-pagination-page"
          :class="{ 'app-pagination-page-active': currentPage === item }"
          :aria-current="currentPage === item ? 'page' : undefined"
          @click="changePage(item)"
        >
          {{ item }}
        </button>
      </template>
    </div>

    <button
      type="button"
      class="app-pagination-arrow"
      :disabled="currentPage === totalPages || disabled"
      aria-label="下一页"
      @click="changePage(currentPage + 1)"
    >
      <ChevronRight class="app-pagination-icon" />
    </button>
  </nav>
</template>

<style scoped>
.app-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 3rem;
  padding: 0.5rem;
}

.app-pagination-updating {
  opacity: 0.58;
  pointer-events: none;
  transition: opacity 180ms linear;
}

.app-pagination-pages {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.35rem;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.56);
  box-shadow:
    0 16px 40px -30px rgba(15, 23, 42, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.app-pagination-arrow,
.app-pagination-page {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.68);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition:
    transform 200ms linear,
    color 200ms linear,
    border-color 200ms linear,
    background-color 200ms linear,
    box-shadow 200ms linear;
}

.app-pagination-arrow:hover:not(:disabled),
.app-pagination-page:hover {
  transform: translateY(-0.125rem);
  color: var(--color-primary);
  border-color: rgba(244, 63, 94, 0.2);
  background: rgba(255, 241, 242, 0.86);
  box-shadow: 0 14px 24px -18px rgba(244, 63, 94, 0.55);
}

.app-pagination-page-active {
  color: #ffffff;
  border-color: transparent;
  background: var(--color-primary);
  box-shadow:
    0 14px 26px -16px rgba(244, 63, 94, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}

.app-pagination-page-active:hover {
  color: #ffffff;
  background: var(--color-primary);
}

.app-pagination-arrow:disabled {
  cursor: not-allowed;
  opacity: 0.38;
  transform: none;
}

.app-pagination-icon {
  width: 1rem;
  height: 1rem;
}

.app-pagination-ellipsis {
  min-width: 1.5rem;
  color: var(--color-text);
  text-align: center;
  font-weight: 600;
  opacity: 0.55;
}

:global(html.dark .app-pagination-pages) {
  background: var(--color-card);
  border-color: transparent;
  box-shadow:
    0 16px 38px -30px rgba(0, 0, 0, 0.72),
    inset 0 1px 0 rgba(255, 255, 255, 0.035);
}

:global(html.dark .app-pagination-arrow),
:global(html.dark .app-pagination-page) {
  background: var(--color-card-hover);
  border-color: transparent;
  color: #cbd5e1;
}

:global(html.dark .app-pagination-arrow:hover:not(:disabled)),
:global(html.dark .app-pagination-page:hover) {
  background: rgba(244, 63, 94, 0.14);
  border-color: transparent;
  color: var(--color-primary);
  box-shadow: 0 14px 24px -18px rgba(244, 63, 94, 0.45);
}

:global(html.dark .app-pagination-page-active),
:global(html.dark .app-pagination-page-active:hover) {
  color: #ffffff;
  background: var(--color-primary);
  border-color: transparent;
  box-shadow:
    0 14px 26px -18px rgba(244, 63, 94, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

:global(html.dark .app-pagination-arrow:disabled) {
  color: rgba(203, 213, 225, 0.42);
  background: var(--color-card);
}

:global(html.dark .app-pagination-ellipsis) {
  color: rgba(203, 213, 225, 0.62);
}

@media (max-width: 640px) {
  .app-pagination {
    gap: 0.5rem;
    margin-top: 2.25rem;
  }

  .app-pagination-pages {
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .app-pagination-arrow,
  .app-pagination-page {
    width: 2.75rem;
    height: 2.75rem;
  }
}
</style>
