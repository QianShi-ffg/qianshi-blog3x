<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { ArrowLeft, MapPin, Calendar, ImageIcon, Video, FileText, Heart, Share2, MessageCircle } from 'lucide-vue-next'
import Comments from '../components/Comments.vue'

const route = useRoute()
const router = useRouter()
const momentId = Number(route.params.id)

// 模拟获取日记详情数据 (合并了列表页数据和详情内容)
const allMoments = [
  {
    id: 1,
    type: 'image',
    media: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20coffee%20cup%20on%20a%20wooden%20table%2C%20morning%20sunlight%2C%20soft%20colors&image_size=landscape_16_9',
    content: '清晨的一杯咖啡，开启新一天的代码之旅。最近在研究 Vue 3 的源码，收获颇多。',
    longContent: '每天早晨的这杯咖啡似乎已经成了一种仪式。今天阳光特别好，照在桌面上暖洋洋的。\n\n最近这段时间一直在死磕 Vue 3 的源码，从响应式系统到编译器的实现，越看越觉得精妙。虽然过程有些痛苦，特别是看 `reactivity` 包里关于各种依赖收集和触发的边界处理时，但当真正理解它的设计哲学后，那种豁然开朗的感觉是无与伦比的。\n\n希望今天能把组件挂载的流程彻底理清楚。',
    location: '上海 · 某咖啡馆',
    date: '2024-04-12 09:30',
    weather: '☀️ 晴',
    likes: 24,
    comments: 5
  },
  {
    id: 2,
    type: 'text',
    media: null,
    content: '今天完成了一个拖拽很久的需求，看着流畅的动画效果，感觉所有的加班都是值得的。前端开发的魅力就在于这种即时的视觉反馈。',
    longContent: '历时将近两周，那个让整个团队头疼的复杂拖拽交互需求终于上线了。\n\n中间经历了无数次的方案推翻和重构。最开始尝试使用现成的第三方库，发现很难满足产品极度变态的定制化要求（比如跨层级的DOM拖拽和实时的磁吸对齐）。最后咬咬牙决定用原生的 Pointer Events 自己写。\n\n在处理滚动边界和性能优化（RequestAnimationFrame 是永远的神）上掉了很多头发。但就在刚刚，看着它在生产环境里如丝般顺滑地跑起来，之前所有的烦躁都烟消云散了。这就是我为什么喜欢做前端的原因吧，你写的每一行代码，最终都会以最直观的方式呈现在屏幕上。',
    location: '工作室',
    date: '2024-04-05 22:15',
    weather: '☁️ 多云',
    likes: 42,
    comments: 12
  },
  {
    id: 3,
    type: 'video',
    media: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20beautiful%20sunset%20over%20a%20city%20skyline%2C%20pastel%20colors%2C%20minimalist%20photography&image_size=landscape_16_9',
    content: '下班路上的晚霞。城市虽然拥挤，但偶尔抬起头，总能发现不期而遇的浪漫。用视频记录下这转瞬即逝的美好。',
    longContent: '连续加了三天班，今天难得准时下班。\n\n走出写字楼的时候，不经意间抬头，被眼前的晚霞震撼到了。大片的粉色和橘色交织在天空，给钢筋水泥的城市蒙上了一层极其温柔的滤镜。路上的行人都行色匆匆，低着头看着手机，不知道有多少人错过了这样的风景。\n\n停下来录了一段视频，风吹过树叶的声音和远处的车流声混在一起。深吸一口气，感觉最近的压力都随着这阵晚风飘散了。生活不只有显示器里的代码，偶尔也要抬头看看天。',
    location: '杭州 · 滨江',
    date: '2024-03-28 18:45',
    weather: '🌤️ 晴转多云',
    likes: 56,
    comments: 8
  },
  {
    id: 4,
    type: 'image',
    media: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20clean%20desk%20setup%20with%20a%20macbook%20and%20a%20plant%2C%20soft%20natural%20light&image_size=landscape_16_9',
    content: '整理了一下桌面，把陪伴了三年的机械键盘清理得干干净净。极简的环境确实能带来内心的平静。',
    longContent: '周末的大扫除。\n\n花了整整一个下午的时间整理工作台。把那把快被盘出包浆的机械键盘一个键帽一个键帽地拆下来清洗，又把错综复杂的理线重新梳理了一遍。扔掉了桌面上不需要的杂物，只留下电脑、台灯和一盆绿植。\n\n看着干净整洁的桌面，感觉思绪也跟着清晰了起来。有时候外部环境的极简，真的能促进内心的专注。准备在这个焕然一新的桌面上，开始写我的新开源项目了。',
    location: '家里',
    date: '2024-03-15 14:20',
    weather: '🌧️ 小雨',
    likes: 89,
    comments: 15
  },
  {
    id: 5,
    type: 'text',
    media: null,
    content: '读完了一本关于设计的书，开始理解"设计不仅仅是外观，更是它是如何运作的"这句话的深刻含义。准备在下个项目中实践一下。',
    longContent: '刚刚合上《设计心理学》。\n\n作为一名开发人员，以前总觉得设计就是把东西画得好看。但书中提到的可用性、可见性、隐喻和反馈等概念，让我有了全新的认知。乔布斯说的那句“设计不仅仅是外观和感觉，设计是它是如何运作的”，现在终于能体会到了。\n\n比如我们常常为了视觉上的极简，而隐藏掉重要的操作按钮，这其实是违背了可见性原则的。下一个迭代，我要试着用这些理论去重新审视一下我们现有的组件交互逻辑，不仅仅要实现功能，更要让用户用得“理所当然”。',
    location: '市图书馆',
    date: '2024-03-02 16:00',
    weather: '☀️ 晴',
    likes: 34,
    comments: 6
  }
]

const moment = computed(() => allMoments.find(m => m.id === momentId))

const getTypeIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Video
  return FileText
}

const goBack = () => {
  router.push('/diary')
}
</script>

<template>
  <div class="dd-page-container" v-if="moment">
    
    <!-- Top Action Bar -->
    <div class="dd-top-bar" v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }">
      <button @click="goBack" class="dd-back-btn group">
        <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span>返回碎片</span>
      </button>
      
      <div class="dd-type-badge">
        <component :is="getTypeIcon(moment.type)" class="w-4 h-4" />
        <span class="uppercase text-xs font-bold tracking-wider">{{ moment.type }}</span>
      </div>
    </div>

    <!-- Main Content Card -->
    <article
      class="dd-article-card"
      v-motion 
      :initial="{ opacity: 0, y: 30 }" 
      :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 100 } }"
    >
      
      <!-- Meta Header -->
      <header class="dd-meta-header">
        <div class="dd-meta-item">
          <Calendar class="w-4 h-4 text-rose-500" />
          <span class="font-medium text-slate-700">{{ moment.date }}</span>
        </div>
        <div class="flex items-center gap-4 text-slate-500">
          <div class="dd-meta-item">
            <span>{{ moment.weather }}</span>
          </div>
          <div class="dd-meta-item bg-slate-50 px-3 py-1 rounded-full">
            <MapPin class="w-3.5 h-3.5" />
            <span class="text-sm">{{ moment.location }}</span>
          </div>
        </div>
      </header>

      <!-- Media Section -->
      <div v-if="moment.type === 'image' && moment.media" class="dd-media-section">
        <img :src="moment.media" alt="Diary cover" class="dd-media-img" />
      </div>

      <div v-else-if="moment.type === 'video' && moment.media" class="dd-media-section">
        <video 
          :src="moment.media" 
          :poster="moment.poster" 
          controls 
          class="dd-media-video"
        ></video>
      </div>

      <!-- Text Content -->
      <div class="dd-content-section" :class="{ 'pt-8 md:pt-12': !moment.media, 'pt-8': moment.media }">
        <!-- Quote style for short content -->
        <blockquote class="dd-quote">
          {{ moment.content }}
        </blockquote>

        <!-- Detailed Long Content -->
        <div class="dd-long-content">
          <p v-for="(paragraph, index) in moment.longContent.split('\n\n')" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- Interaction Footer -->
      <footer class="dd-interaction-footer">
        <div class="flex items-center gap-6">
          <button class="dd-action-btn group">
            <Heart class="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span class="group-hover:text-rose-600 transition-colors">{{ moment.likes }}</span>
          </button>
          <button class="dd-action-btn group">
            <MessageCircle class="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span class="group-hover:text-blue-600 transition-colors">{{ moment.comments }}</span>
          </button>
        </div>
        <button class="dd-action-btn hover:text-slate-900 transition-colors">
          <Share2 class="w-5 h-5" />
        </button>
      </footer>

      <!-- Comments Module -->
      <div class="px-6 md:px-10 pb-10">
        <Comments />
      </div>

    </article>

  </div>

  <!-- 404 Fallback -->
  <div v-else class="min-h-screen flex flex-col items-center justify-center py-32">
    <h2 class="text-2xl font-bold text-slate-800 mb-4">找不到该日记</h2>
    <button @click="goBack" class="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors">返回列表</button>
  </div>
</template>

<style scoped lang="scss">
.dd-page-container {
  @apply min-h-screen py-12 pt-24 px-4 sm:px-6 mx-auto;
  max-width: 1200px;

  @media (min-width: 768px) {
    @apply pt-32;
  }
}

.dd-top-bar {
  @apply flex justify-between items-center mb-8;
}

.dd-back-btn {
  @apply flex items-center gap-2 text-slate-500 font-medium hover:text-rose-500 transition-colors bg-white/50 px-4 py-2 rounded-full border border-slate-200/60 backdrop-blur-md shadow-sm;
}

.dd-type-badge {
  @apply flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200 shadow-sm;
}

.dd-article-card {
  @apply bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden relative;
  
  &::before {
    content: '';
    @apply absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-400 to-rose-300;
  }
}

.dd-meta-header {
  @apply flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 border-b border-slate-100/50;
}

.dd-meta-item {
  @apply flex items-center gap-2 text-sm;
}

.dd-media-section {
  @apply w-full relative bg-slate-100;
}

.dd-media-img {
  @apply w-full h-auto max-h-[60vh] object-cover object-center;
}

.dd-media-video {
  @apply w-full h-auto max-h-[60vh] bg-black object-contain;
}

.dd-content-section {
  @apply px-6 md:px-10 pb-8;
}

.dd-quote {
  @apply text-xl md:text-2xl font-medium text-slate-800 leading-snug mb-10 pl-6 border-l-4 border-rose-400 relative italic;
  
  &::before {
    content: '"';
    @apply absolute -left-2 -top-4 text-5xl text-rose-200 font-serif opacity-50;
  }
}

.dd-long-content {
  @apply space-y-6 text-slate-600 text-base md:text-lg leading-relaxed;
}

.dd-interaction-footer {
  @apply flex items-center justify-between px-6 md:px-10 py-5 bg-slate-50/50 border-t border-slate-100;
}

.dd-action-btn {
  @apply flex items-center gap-2 text-slate-500 font-medium text-sm;
}
</style>