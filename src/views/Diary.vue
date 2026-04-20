<script setup lang="ts">
import { MapPin, Calendar, ImageIcon, Video, FileText } from 'lucide-vue-next'

const moments = [
  {
    id: 1,
    type: 'image', // text, image, video
    media: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20coffee%20cup%20on%20a%20wooden%20table%2C%20morning%20sunlight%2C%20soft%20colors&image_size=portrait_3_4',
    content: '清晨的一杯咖啡，开启新一天的代码之旅。最近在研究 Vue 3 的源码，收获颇多。',
    location: '上海 · 咖啡馆',
    date: '2024-04-12',
    weather: '☀️ 晴'
  },
  {
    id: 2,
    type: 'text',
    media: null,
    content: '今天完成了一个拖拽很久的需求，看着流畅的动画效果，感觉所有的加班都是值得的。前端开发的魅力就在于这种即时的视觉反馈。',
    location: '工作室',
    date: '2024-04-05',
    weather: '☁️ 多云'
  },
  {
    id: 3,
    type: 'video',
    media: 'https://www.w3schools.com/html/mov_bbb.mp4', // Example placeholder video
    poster: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20beautiful%20sunset%20over%20a%20city%20skyline%2C%20pastel%20colors%2C%20minimalist%20photography&image_size=landscape_4_3',
    content: '下班路上的晚霞。城市虽然拥挤，但偶尔抬起头，总能发现不期而遇的浪漫。用视频记录下这转瞬即逝的美好。',
    location: '杭州',
    date: '2024-03-28',
    weather: '🌤️ 晴转多云'
  },
  {
    id: 4,
    type: 'image',
    media: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20clean%20desk%20setup%20with%20a%20macbook%20and%20a%20plant%2C%20soft%20natural%20light&image_size=square',
    content: '整理了一下桌面，把陪伴了三年的机械键盘清理得干干净净。极简的环境确实能带来内心的平静。',
    location: '家里',
    date: '2024-03-15',
    weather: '🌧️ 小雨'
  },
  {
    id: 5,
    type: 'text',
    media: null,
    content: '读完了一本关于设计的书，开始理解"设计不仅仅是外观，更是它是如何运作的"这句话的深刻含义。准备在下个项目中实践一下。',
    location: '图书馆',
    date: '2024-03-02',
    weather: '☀️ 晴'
  }
]

const getTypeIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Video
  return FileText
}
</script>

<template>
  <div class="diary-page-container">
    <!-- Header -->
    <div class="diary-header-wrapper">
      <div>
        <h1
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
          class="diary-title"
        >
          生活碎片
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
          class="diary-subtitle"
        >
          记录生活中的小确幸，不只是代码，还有远方。
        </p>
      </div>
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200 } }"
        class="diary-badge-wrap"
      >
        <div class="diary-badge-inner">
          <ImageIcon class="diary-icon-sm" />
          <span>{{ moments.length }} 个瞬间</span>
        </div>
      </div>
    </div>

    <!-- Masonry Layout -->
    <div class="diary-masonry-grid">
      <div
        v-for="(moment, index) in moments"
        :key="moment.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 100 } }"
        class="diary-masonry-item"
      >
        <router-link :to="`/diary/${moment.id}`" class="block cursor-pointer">
          <div class="diary-card group">

              <!-- Type Badge -->
            <div class="diary-type-badge">
               <component :is="getTypeIcon(moment.type)" class="diary-icon-sm" />
            </div>

            <!-- Media Section -->
            <div v-if="moment.type === 'image' && moment.media" class="diary-media-wrap">
              <img
                :src="moment.media"
                alt="Moment"
                class="diary-media-img"
              />
              <div class="diary-media-overlay"></div>
            </div>

            <div v-else-if="moment.type === 'video' && moment.media" class="diary-video-wrap group">
              <video
                :src="moment.media"
                :poster="moment.poster"
                controls
                preload="metadata"
                class="diary-video-element"
              ></video>
            </div>

            <!-- Text Content -->
            <div class="diary-content-wrap" :class="{ 'diary-content-bg-text': moment.type === 'text' }">
              <p class="diary-text-content" :class="{ 'diary-text-lg': moment.type === 'text', 'diary-text-md': moment.type !== 'text' }">
                {{ moment.content }}
              </p>

              <!-- Meta -->
              <div class="diary-meta-footer">
                <div class="diary-meta-left">
                  <span class="diary-meta-date">
                    <Calendar class="diary-icon-xs" />
                    {{ moment.date }}
                  </span>
                  <span class="diary-meta-weather">
                    {{ moment.weather }}
                  </span>
                </div>
                <span class="diary-meta-location">
                  <MapPin class="diary-icon-xxs" />
                  {{ moment.location }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-page-container {
  @apply min-h-[80vh] py-12 lg:py-20 pt-24 px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 mx-auto max-w-screen-2xl;
}

.diary-header-wrapper {
  @apply mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8;
}

.diary-title {
  @apply text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4;
}

.diary-subtitle {
  @apply text-lg text-slate-500 max-w-2xl;
}

.diary-badge-wrap {
  @apply flex gap-3;
}

.diary-badge-inner {
  @apply flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium;
}

.diary-icon-sm {
  @apply w-4 h-4;
}

.diary-masonry-grid {
  @apply columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8;
}

.diary-masonry-item {
  @apply break-inside-avoid mb-6 lg:mb-8;
}

.diary-card {
  @apply bg-white/70 backdrop-blur-lg border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 relative;
}

.diary-type-badge {
  @apply absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm text-slate-600;
}

.diary-media-wrap {
  @apply relative overflow-hidden;
}

.diary-media-img {
  @apply w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out;
}

.diary-media-overlay {
  @apply absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

.diary-video-wrap {
  @apply relative overflow-hidden bg-slate-100 aspect-video;
}

.diary-video-element {
  @apply w-full h-full object-cover;
}

.diary-content-wrap {
  @apply p-6 md:p-8;
}

.diary-content-bg-text {
  @apply bg-rose-50/30;
}

.diary-text-content {
  @apply text-slate-700 leading-relaxed mb-6;
}

.diary-text-lg {
  @apply text-xl font-medium;
}

.diary-text-md {
  @apply text-base;
}

.diary-meta-footer {
  @apply flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs font-medium text-slate-400;
}

.diary-meta-left {
  @apply flex items-center gap-4;
}

.diary-meta-date {
  @apply flex items-center gap-1 hover:text-rose-500 transition-colors;
}

.diary-icon-xs {
  @apply w-3.5 h-3.5;
}

.diary-meta-weather {
  @apply flex items-center gap-1;
}

.diary-meta-location {
  @apply flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md text-slate-500;
}

.diary-icon-xxs {
  @apply w-3 h-3;
}
</style>
