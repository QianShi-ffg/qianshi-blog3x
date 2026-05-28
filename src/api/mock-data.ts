import type {
  ArticleDetail,
  ArticleSummary,
  DiaryMoment,
  DiaryMomentSummary,
  Project,
} from '@/types/content'

export const articles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践与性能优化',
    date: '2024-03-15',
    readTime: '8 min',
    category: '前端',
    desc: '在现代前端开发中，保持代码的简洁与可维护性至关重要。本文将分享在实际项目中总结的一些经验和技巧，帮助你写出更优雅的 Vue 3 代码。',
  },
  {
    id: 2,
    title: '如何构建一个现代化的博客系统',
    date: '2024-02-28',
    readTime: '12 min',
    category: '前端',
    desc: '从零开始，使用 Vue 3、Vite 和 Tailwind CSS 搭建一个高性能、响应式且具有极佳交互体验的个人博客。',
  },
  {
    id: 3,
    title: '极简主义在数字产品设计中的应用',
    date: '2024-01-10',
    readTime: '6 min',
    category: '设计',
    desc: '探讨"少即是多"的设计理念，以及如何通过合理的留白、克制的色彩和精致的排版来提升用户体验。',
  },
  {
    id: 4,
    title: '保持热爱的同时避免职业倦怠',
    date: '2023-12-05',
    readTime: '5 min',
    category: '生活',
    desc: '在快节奏的互联网行业中，如何找到工作与生活的平衡点，保持持续的创造力和学习热情。',
  },
  {
    id: 5,
    title: '深入理解 Tailwind CSS 架构哲学',
    date: '2023-11-20',
    readTime: '10 min',
    category: '前端',
    desc: '原子化 CSS 为什么会流行？Tailwind CSS 是如何解决传统 CSS 维护痛点的？本文带你一探究竟。',
  },
] satisfies ArticleSummary[]

const baseArticleDetail = {
  title: 'Vue 3 组合式 API 最佳实践与性能优化',
  date: '2024-03-15',
  readTime: '8 min',
  category: '前端',
  coverImage:
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20workspace%20with%20code%20on%20a%20screen%2C%20soft%20morning%20light%2C%20clean%20aesthetic&image_size=landscape_16_9',
  content: `
## 引言

在现代前端开发中，保持代码的简洁与可维护性至关重要。Vue 3 的组合式 API（Composition API）为我们提供了一种全新的代码组织方式，它不仅打破了 Vue 2 选项式 API（Options API）在逻辑复用上的局限，还在 TypeScript 支持和性能优化上带来了显著的提升。

本文将分享在实际项目中总结的一些经验和技巧，帮助你写出更优雅、更高性能的 Vue 3 代码。

---

## 1. 逻辑复用：自定义 Hook 的艺术

组合式 API 最大的魅力在于提取和复用逻辑。通过编写自定义 Hook（或称为 Composables），我们可以将复杂的业务逻辑从组件中剥离出来。

### 为什么需要自定义 Hook？

在 Vue 2 中，我们通常使用 Mixins 来复用逻辑，但 Mixins 存在命名冲突、来源不清晰等问题。自定义 Hook 通过闭包和函数调用的方式，完美解决了这些痛点。

\`\`\`typescript
// useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  const update = () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}
\`\`\`

---

## 2. 响应式系统：ref vs reactive

在 Vue 3 中，\`ref\` 和 \`reactive\` 是创建响应式状态的两个核心 API。初学者经常会纠结在什么时候该用哪一个。

### 最佳实践建议

1. **基础类型**（如 \`string\`, \`number\`, \`boolean\`）必须使用 \`ref\`。
2. **引用类型**（如 \`object\`, \`array\`）建议统一使用 \`ref\`，通过 \`.value\` 重新赋值不会丢失响应式。
3. 只有当你非常明确需要一个深层响应式的对象，且不需要重新赋值整个对象时，才使用 \`reactive\`。

> **提示**：在 Vue 3.2 引入 \`<script setup>\` 之后，\`ref\` 的 \`.value\` 拆包已经变得非常智能和便捷，统一使用 \`ref\` 可以降低心智负担。

---

## 3. 性能优化：避免不必要的计算

### 巧用 computed

\`computed\` 具有缓存特性，只有当其依赖的响应式源发生变化时才会重新求值。

\`\`\`typescript
const filteredList = computed(() => {
  // 这里的高开销计算只会在 list 或 filterText 变化时执行
  return list.value.filter(item => item.name.includes(filterText.value))
})
\`\`\`

### 谨慎使用 watch

\`watch\` 应该主要用于处理**副作用**（如 API 请求、DOM 操作等）。如果是基于现有状态派生出新的状态，应该优先考虑 \`computed\`。

---

## 结语

Vue 3 的组合式 API 为我们打开了前端架构的新世界大门。"少即是多"（Less is More），掌握这些核心 API 的最佳实践，能够让我们的代码更加健壮、易读和高效。

希望这篇文章能对你的日常开发有所启发。持续学习，持续重构，代码不止！
  `,
} satisfies Omit<ArticleDetail, 'id' | 'desc'>

export const articleDetails = articles.map((article) => ({
  ...article,
  coverImage: baseArticleDetail.coverImage,
  content: baseArticleDetail.content,
})) satisfies ArticleDetail[]

export const projects = [
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
] satisfies Project[]

export const momentSummaries = [
  {
    id: 1,
    type: 'image',
    media:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20coffee%20cup%20on%20a%20wooden%20table%2C%20morning%20sunlight%2C%20soft%20colors&image_size=portrait_3_4',
    content: '清晨的一杯咖啡，开启新一天的代码之旅。最近在研究 Vue 3 的源码，收获颇多。',
    location: '上海 · 咖啡馆',
    date: '2024-04-12',
    weather: '☀️ 晴',
  },
  {
    id: 2,
    type: 'text',
    media: null,
    content:
      '今天完成了一个拖拽很久的需求，看着流畅的动画效果，感觉所有的加班都是值得的。前端开发的魅力就在于这种即时的视觉反馈。',
    location: '工作室',
    date: '2024-04-05',
    weather: '☁️ 多云',
  },
  {
    id: 3,
    type: 'video',
    media: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20beautiful%20sunset%20over%20a%20city%20skyline%2C%20pastel%20colors%2C%20minimalist%20photography&image_size=landscape_4_3',
    content:
      '下班路上的晚霞。城市虽然拥挤，但偶尔抬起头，总能发现不期而遇的浪漫。用视频记录下这转瞬即逝的美好。',
    location: '杭州',
    date: '2024-03-28',
    weather: '🌤️ 晴转多云',
  },
  {
    id: 4,
    type: 'image',
    media:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20clean%20desk%20setup%20with%20a%20macbook%20and%20a%20plant%2C%20soft%20natural%20light&image_size=square',
    content: '整理了一下桌面，把陪伴了三年的机械键盘清理得干干净净。极简的环境确实能带来内心的平静。',
    location: '家里',
    date: '2024-03-15',
    weather: '🌧️ 小雨',
  },
  {
    id: 5,
    type: 'text',
    media: null,
    content:
      '读完了一本关于设计的书，开始理解"设计不仅仅是外观，更是它是如何运作的"这句话的深刻含义。准备在下个项目中实践一下。',
    location: '图书馆',
    date: '2024-03-02',
    weather: '☀️ 晴',
  },
] satisfies DiaryMomentSummary[]

export const moments = [
  {
    id: 1,
    type: 'image',
    media:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20coffee%20cup%20on%20a%20wooden%20table%2C%20morning%20sunlight%2C%20soft%20colors&image_size=landscape_16_9',
    content: '清晨的一杯咖啡，开启新一天的代码之旅。最近在研究 Vue 3 的源码，收获颇多。',
    longContent:
      '每天早晨的这杯咖啡似乎已经成了一种仪式。今天阳光特别好，照在桌面上暖洋洋的。\n\n最近这段时间一直在死磕 Vue 3 的源码，从响应式系统到编译器的实现，越看越觉得精妙。虽然过程有些痛苦，特别是看 `reactivity` 包里关于各种依赖收集和触发的边界处理时，但当真正理解它的设计哲学后，那种豁然开朗的感觉是无与伦比的。\n\n希望今天能把组件挂载的流程彻底理清楚。',
    location: '上海 · 某咖啡馆',
    date: '2024-04-12 09:30',
    weather: '☀️ 晴',
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    type: 'text',
    media: null,
    content:
      '今天完成了一个拖拽很久的需求，看着流畅的动画效果，感觉所有的加班都是值得的。前端开发的魅力就在于这种即时的视觉反馈。',
    longContent:
      '历时将近两周，那个让整个团队头疼的复杂拖拽交互需求终于上线了。\n\n中间经历了无数次的方案推翻和重构。最开始尝试使用现成的第三方库，发现很难满足产品极度变态的定制化要求（比如跨层级的DOM拖拽和实时的磁吸对齐）。最后咬咬牙决定用原生的 Pointer Events 自己写。\n\n在处理滚动边界和性能优化（RequestAnimationFrame 是永远的神）上掉了很多头发。但就在刚刚，看着它在生产环境里如丝般顺滑地跑起来，之前所有的烦躁都烟消云散了。这就是我为什么喜欢做前端的原因吧，你写的每一行代码，最终都会以最直观的方式呈现在屏幕上。',
    location: '工作室',
    date: '2024-04-05 22:15',
    weather: '☁️ 多云',
    likes: 42,
    comments: 12,
  },
  {
    id: 3,
    type: 'video',
    media: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20beautiful%20sunset%20over%20a%20city%20skyline%2C%20pastel%20colors%2C%20minimalist%20photography&image_size=landscape_16_9',
    content:
      '下班路上的晚霞。城市虽然拥挤，但偶尔抬起头，总能发现不期而遇的浪漫。用视频记录下这转瞬即逝的美好。',
    longContent:
      '连续加了三天班，今天难得准时下班。\n\n走出写字楼的时候，不经意间抬头，被眼前的晚霞震撼到了。大片的粉色和橘色交织在天空，给钢筋水泥的城市蒙上了一层极其温柔的滤镜。路上的行人都行色匆匆，低着头看着手机，不知道有多少人错过了这样的风景。\n\n停下来录了一段视频，风吹过树叶的声音和远处的车流声混在一起。深吸一口气，感觉最近的压力都随着这阵晚风飘散了。生活不只有显示器里的代码，偶尔也要抬头看看天。',
    location: '杭州 · 滨江',
    date: '2024-03-28 18:45',
    weather: '🌤️ 晴转多云',
    likes: 56,
    comments: 8,
  },
  {
    id: 4,
    type: 'image',
    media:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20clean%20desk%20setup%20with%20a%20macbook%20and%20a%20plant%2C%20soft%20natural%20light&image_size=landscape_16_9',
    content:
      '整理了一下桌面，把陪伴了三年的机械键盘清理得干干净净。极简的环境确实能带来内心的平静。',
    longContent:
      '周末的大扫除。\n\n花了整整一个下午的时间整理工作台。把那把快被盘出包浆的机械键盘一个键帽一个键帽地拆下来清洗，又把错综复杂的理线重新梳理了一遍。扔掉了桌面上不需要的杂物，只留下电脑、台灯和一盆绿植。\n\n看着干净整洁的桌面，感觉思绪也跟着清晰了起来。有时候外部环境的极简，真的能促进内心的专注。准备在这个焕然一新的桌面上，开始写我的新开源项目了。',
    location: '家里',
    date: '2024-03-15 14:20',
    weather: '🌧️ 小雨',
    likes: 89,
    comments: 15,
  },
  {
    id: 5,
    type: 'text',
    media: null,
    content:
      '读完了一本关于设计的书，开始理解"设计不仅仅是外观，更是它是如何运作的"这句话的深刻含义。准备在下个项目中实践一下。',
    longContent:
      '刚刚合上《设计心理学》。\n\n作为一名开发人员，以前总觉得设计就是把东西画得好看。但书中提到的可用性、可见性、隐喻和反馈等概念，让我有了全新的认知。乔布斯说的那句“设计不仅仅是外观和感觉，设计是它是如何运作的”，现在终于能体会到了。\n\n比如我们常常为了视觉上的极简，而隐藏掉重要的操作按钮，这其实是违背了可见性原则的。下一个迭代，我要试着用这些理论去重新审视一下我们现有的组件交互逻辑，不仅仅要实现功能，更要让用户用得“理所当然”。',
    location: '市图书馆',
    date: '2024-03-02 16:00',
    weather: '☀️ 晴',
    likes: 34,
    comments: 6,
  },
] satisfies DiaryMoment[]
