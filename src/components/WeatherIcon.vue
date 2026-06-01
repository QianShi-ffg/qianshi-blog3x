<script setup lang="ts">
import { computed } from 'vue'
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  HelpCircle,
  Sun,
} from 'lucide-vue-next'

const props = defineProps<{
  weather?: string | null
}>()

const normalizedWeather = computed(() => props.weather?.trim() || '未知')

const weatherIcon = computed(() => {
  const weather = normalizedWeather.value

  if (/雷|暴/.test(weather)) return CloudLightning
  if (/雪|霰|冰雹/.test(weather)) return CloudSnow
  if (/雨|阵雨|毛毛雨/.test(weather)) return CloudRain
  if (/雾|霾|沙尘|浮尘/.test(weather)) return CloudFog
  if (/多云|少云|晴间多云|晴转多云/.test(weather)) return CloudSun
  if (/阴|云/.test(weather)) return Cloud
  if (/晴|热/.test(weather)) return Sun

  return HelpCircle
})
</script>

<template>
  <component :is="weatherIcon" aria-hidden="true" />
</template>
