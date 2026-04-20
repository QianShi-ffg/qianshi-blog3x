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
  transition-property: all;
  transition-duration: 200ms;
}

.theme-toggle-btn:hover {
  background-color: #f1f5f9; /* slate-100 */
  color: #0f172a; /* slate-900 */
}

/* Dark mode styles for the button itself */
:global(html.dark) .theme-toggle-btn {
  color: #94a3b8; /* slate-400 */
}

:global(html.dark) .theme-toggle-btn:hover {
  background-color: #1e293b; /* slate-800 */
  color: #f8fafc; /* slate-50 */
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition-property: transform;
  transition-duration: 300ms;
}

.theme-toggle-btn:hover .theme-icon {
  transform: rotate(15deg);
}
</style>
