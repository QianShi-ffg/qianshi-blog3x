<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { ArrowLeft, Github, ExternalLink, Calendar, User, LayoutGrid } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const projectId = Number(route.params.id)

// 模拟获取作品详情数据
const allProjects = [
  {
    id: 1,
    title: 'QianShiBlog Space',
    category: '个人网站',
    desc: '基于 Vue 3 + Tailwind CSS 的现代极简主义个人博客，具有出色的动画和交互体验。',
    longDesc: 'QianShiBlog Space 是我个人的博客与作品集平台。在设计上，我采用了极简主义风格，大面积留白配合柔和的暖红色调（Rose），旨在提供极致舒适的阅读体验。技术架构上，全站采用 Vue 3 的 Composition API 编写，结合 Vite 极速构建，以及 Tailwind CSS 实现原子化样式。此外，还使用了 vueuse/motion 处理了复杂的页面转场与组件进入动效。',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20clean%20website%20mockup%2C%20light%20theme%2C%20minimalist%2C%20soft%20red%20accents&image_size=landscape_16_9',
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20blog%20article%20page%2C%20clean%20typography%2C%20white%20background%2C%20red%20highlights&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20portfolio%20grid%20layout%2C%20clean%20design%2C%20soft%20shadows&image_size=landscape_16_9'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // 示例视频
    tags: ['Vue 3', 'Tailwind', 'Vite', 'Motion'],
    role: '全栈开发 / UI设计',
    date: '2023.10 - 至今',
    github: '#',
    demo: '#'
  },
  {
    id: 2,
    title: 'Design System Pro',
    category: '组件库',
    desc: '一套为企业级应用打造的高质量 UI 组件库，包含 50+ 常用组件，支持深度定制。',
    longDesc: '这套设计系统旨在解决企业内部多个中后台系统之间 UI 不一致、重复造轮子的问题。它包含了一套完整的 React 组件，涵盖了表单、数据展示、反馈、导航等多个类别。通过 Storybook 提供了详尽的交互式文档，并且完全支持 TypeScript 静态类型检查。',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20collection%20of%20UI%20components%20floating%20in%203D%20space%2C%20clean%2C%20white%20background&image_size=landscape_16_9',
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20storybook%20UI%20documentation%20page%2C%20clean%20and%20professional&image_size=landscape_16_9'
    ],
    videoUrl: '', // 无视频示例
    tags: ['React', 'TypeScript', 'Storybook'],
    role: '前端架构师',
    date: '2022.05 - 2023.01',
    github: '#',
    demo: '#'
  },
  {
    id: 3,
    title: 'Weather Minimal',
    category: '移动端应用',
    desc: '一款极简风格的天气应用，提供精准的实时天气和未来天气预报，界面清新优雅。',
    longDesc: 'Weather Minimal 是一款跨平台的移动端应用，专注于提供纯粹、无广告的天气预报体验。使用 React Native 构建，保证了 iOS 和 Android 双端的一致性与高性能。UI 采用大卡片设计，配合流畅的微动效，能够根据当前天气自动切换背景色调和动画（如下雨、下雪粒子效果）。',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20weather%20app%20UI%20on%20a%20smartphone%20screen%2C%20pastel%20colors&image_size=landscape_16_9',
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Weather%20app%20UI%20showing%20rainy%20weather%20with%20dark%20elegant%20theme&image_size=landscape_16_9'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // 示例视频
    tags: ['React Native', 'Weather API'],
    role: '移动端开发',
    date: '2021.11 - 2022.03',
    github: '#',
    demo: '#'
  },
  {
    id: 4,
    title: 'TaskFlow',
    category: '效率工具',
    desc: '面向小团队的敏捷任务管理工具，支持看板、日历和甘特图视图。',
    longDesc: 'TaskFlow 是为了解决小团队在敏捷开发中沟通成本高、任务状态不透明而开发的。核心功能包括灵活的拖拽看板（Kanban）、多维度的甘特图排期以及实时消息通知。前端采用了 Vue 3 + Pinia 架构，后端则基于 Supabase 实现了快速的实时数据库同步与身份验证。',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20kanban%20board%20dashboard%20UI%2C%20clean%2C%20modern%2C%20soft%20shadows&image_size=landscape_16_9',
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20gantt%20chart%20interface%2C%20project%20management%20tool%2C%20clean%20UI&image_size=landscape_16_9'
    ],
    videoUrl: '', // 无视频示例
    tags: ['Vue 3', 'Supabase', 'Pinia'],
    role: '全栈开发',
    date: '2021.01 - 2021.08',
    github: '#',
    demo: '#'
  }
]

const project = computed(() => allProjects.find(p => p.id === projectId))

const goBack = () => {
  router.push('/portfolio')
}
</script>

<template>
  <div class="pd-container" v-if="project">
    <!-- Back Button -->
    <div class="pd-back-wrapper">
      <button @click="goBack" class="pd-back-btn group">
        <ArrowLeft class="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        返回作品列表
      </button>
    </div>

    <!-- Hero Section -->
    <header class="pd-hero" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <div class="pd-hero-meta">
        <span class="pd-category">{{ project.category }}</span>
      </div>
      <h1 class="pd-title">{{ project.title }}</h1>
      <p class="pd-desc">{{ project.desc }}</p>

      <div class="pd-info-grid">
        <div class="pd-info-item">
          <User class="pd-info-icon" />
          <div class="pd-info-text">
            <span class="pd-info-label">我的角色</span>
            <span class="pd-info-value">{{ project.role }}</span>
          </div>
        </div>
        <div class="pd-info-item">
          <Calendar class="pd-info-icon" />
          <div class="pd-info-text">
            <span class="pd-info-label">开发周期</span>
            <span class="pd-info-value">{{ project.date }}</span>
          </div>
        </div>
        <div class="pd-info-item">
          <LayoutGrid class="pd-info-icon" />
          <div class="pd-info-text">
            <span class="pd-info-label">技术栈</span>
            <span class="pd-info-value">{{ project.tags.join(' / ') }}</span>
          </div>
        </div>
      </div>

      <div class="pd-actions">
        <a :href="project.github" target="_blank" class="pd-btn pd-btn-outline">
          <Github class="w-5 h-5" />
          查看源码
        </a>
        <a :href="project.demo" target="_blank" class="pd-btn pd-btn-primary">
          <ExternalLink class="w-5 h-5" />
          访问演示
        </a>
      </div>
    </header>

    <!-- Main Cover Image -->
    <div class="pd-main-media" v-motion :initial="{ opacity: 0, y: 40 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }">
      <img :src="project.image" :alt="project.title" class="pd-main-img" />
    </div>

    <!-- Content Section -->
    <div class="pd-content-section" v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 300 } }">
      <h2 class="pd-section-title">项目介绍</h2>
      <p class="pd-text-paragraph">{{ project.longDesc }}</p>
      
      <!-- Video Section (If exists) -->
      <div v-if="project.videoUrl" class="pd-video-wrapper mt-12">
        <h2 class="pd-section-title">功能演示 (视频)</h2>
        <div class="pd-video-container">
          <video controls class="pd-video" :poster="project.image">
            <source :src="project.videoUrl" type="video/mp4">
            您的浏览器不支持 HTML5 视频。
          </video>
        </div>
      </div>

      <!-- Additional Images Gallery -->
      <div v-if="project.images && project.images.length > 0" class="pd-gallery mt-12">
        <h2 class="pd-section-title">项目截图</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(img, index) in project.images" :key="index" class="pd-gallery-item">
            <img :src="img" alt="Gallery image" class="pd-gallery-img" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 404 Fallback -->
  <div v-else class="pd-container text-center py-32">
    <h2 class="text-2xl font-bold text-slate-800 mb-4">找不到该作品</h2>
    <button @click="goBack" class="pd-btn pd-btn-outline mx-auto">返回列表</button>
  </div>
</template>

<style scoped lang="scss">
.pd-container {
  @apply min-h-screen py-12 pt-24 px-6 mx-auto;
  max-width: 1200px;

  @media (min-width: 768px) {
    @apply px-12 pt-32;
  }
}

.pd-back-wrapper {
  @apply mb-12;
}

.pd-back-btn {
  @apply flex items-center gap-2 text-slate-500 font-medium hover:text-rose-500 transition-colors bg-white/50 px-4 py-2 rounded-full border border-slate-200/60 backdrop-blur-md shadow-sm;
}

.pd-hero {
  @apply mb-16;

  .pd-hero-meta {
    @apply flex items-center gap-3 mb-6;
  }

  .pd-category {
    @apply px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-sm font-semibold tracking-wide border border-rose-100 shadow-[0_0_8px_rgba(244,63,94,0.1)];
  }

  .pd-title {
    @apply text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6 leading-tight;
  }

  .pd-desc {
    @apply text-xl text-slate-500 leading-relaxed mb-10 max-w-3xl;
  }

  .pd-info-grid {
    @apply grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 p-6 bg-white/60 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)];
  }

  .pd-info-item {
    @apply flex items-center gap-4;

    .pd-info-icon {
      @apply w-10 h-10 p-2.5 rounded-full bg-rose-50 text-rose-500;
    }

    .pd-info-text {
      @apply flex flex-col;

      .pd-info-label {
        @apply text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5;
      }

      .pd-info-value {
        @apply text-sm font-medium text-slate-800;
      }
    }
  }

  .pd-actions {
    @apply flex flex-wrap gap-4;

    .pd-btn {
      @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300;

      &-outline {
        @apply bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md;
      }

      &-primary {
        @apply bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5;
      }
    }
  }
}

.pd-main-media {
  @apply w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 bg-slate-100 relative;

  .pd-main-img {
    @apply w-full h-full object-cover;
  }
}

.pd-content-section {
  @apply bg-white/70 backdrop-blur-lg border border-slate-100 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)];

  .pd-section-title {
    @apply text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3;

    &::before {
      content: '';
      @apply block w-1.5 h-6 bg-rose-500 rounded-full;
    }
  }

  .pd-text-paragraph {
    @apply text-lg text-slate-600 leading-relaxed space-y-4;
  }
}

.pd-video-wrapper {
  @apply w-full;

  .pd-video-container {
    @apply relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-black aspect-video;

    .pd-video {
      @apply w-full h-full object-contain;
    }
  }
}

.pd-gallery-item {
  @apply rounded-2xl overflow-hidden shadow-md border border-slate-100;
  
  /* Use nested CSS instead of Tailwind group utility */
  .pd-gallery-img {
    @apply w-full h-full object-cover aspect-video transition-transform duration-500;
  }

  &:hover .pd-gallery-img {
    @apply scale-105;
  }
}
</style>