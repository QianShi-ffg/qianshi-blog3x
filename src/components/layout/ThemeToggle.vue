<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Sun, Moon, Monitor } from 'lucide-vue-next'

const mode = useColorMode({
  emitAuto: true,
})

const toggleTheme = () => {
  if (mode.value === 'auto') {
    mode.value = 'light'
  } else if (mode.value === 'light') {
    mode.value = 'dark'
  } else {
    mode.value = 'auto'
  }
}
</script>

<template>
  <button class="theme-toggle-btn" @click="toggleTheme" title="切换主题">
    <Sun v-if="mode === 'light'" class="theme-icon" />
    <Moon v-else-if="mode === 'dark'" class="theme-icon" />
    <Monitor v-else class="theme-icon" />
  </button>
</template>

<style scoped>
.theme-toggle-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #64748b; /* slate-500 */
  isolation: isolate;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
}

.theme-toggle-btn::before {
  content: '';
  position: absolute;
  inset: 0.2rem;
  border-radius: 9999px;
  background: rgba(244, 63, 94, 0.12);
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.7);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  z-index: -1;
}

.theme-toggle-btn:hover {
  color: #f43f5e;
}

.theme-toggle-btn:hover::before {
  opacity: 1;
  transform: scale(1);
}

/* Dark mode styles for the button itself */
:global(html.dark .theme-toggle-btn){
  color: #94a3b8; /* slate-400 */
}

:global(html.dark .theme-toggle-btn:hover){
  color: #fb7185;
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

.theme-toggle-btn:hover .theme-icon {
  transform: scale(1.08);
  filter: drop-shadow(0 4px 10px rgba(244, 63, 94, 0.2));
}
</style>
