<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['navigate']);

const navigateTo = (page) => {
  emit('navigate', page);
};

const lifeItems = ref([
  {
    id: 1,
    type: 'text',
    title: '咖啡与清晨',
    content: '清晨的第一缕阳光透过窗帘洒进来，我坐在窗边，捧着一杯刚冲好的手冲咖啡。咖啡的香气弥漫在空气中，让人感到无比宁静。这样的时刻，总能让我思考很多事情。',
    date: '2026-04-17',
    location: '上海家中'
  },
  {
    id: 2,
    type: 'image',
    title: '城市天际线',
    images: ['https://picsum.photos/800/600?random=1', 'https://picsum.photos/800/600?random=2'],
    content: '站在浦东滨江步道，远眺对岸的陆家嘴金融中心。高楼大厦在晨雾中若隐若现，宛如一幅水墨画。',
    date: '2026-04-16',
    location: '上海浦东'
  },
  {
    id: 3,
    type: 'video',
    title: '日落时分',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://picsum.photos/800/450?random=3',
    content: '在海边等待日落，看着太阳慢慢沉入海平线，天空从金黄变为橙红，再到深紫。这是大自然最美丽的时刻之一。',
    date: '2026-04-15',
    location: '厦门海边'
  },
  {
    id: 4,
    type: 'image',
    title: '春日樱花',
    images: ['https://picsum.photos/800/600?random=4', 'https://picsum.photos/800/600?random=5', 'https://picsum.photos/800/600?random=6'],
    content: '顾村公园的樱花正值盛开时节，满园的粉色花海让人仿佛置身于童话世界。微风拂过，花瓣纷纷扬扬地飘落，美得让人窒息。',
    date: '2026-04-14',
    location: '上海顾村公园'
  },
  {
    id: 5,
    type: 'text',
    title: '阅读的乐趣',
    content: '今天读完了《百年孤独》，这是一本让人深思的书。马尔克斯用魔幻现实主义的笔触，描述了一个家族七代人的兴衰历程。书中的人物命运多舛，却又充满了对生活的热爱和对人性的洞察。',
    date: '2026-04-13',
    location: '上海家中'
  },
  {
    id: 6,
    type: 'video',
    title: '街头音乐',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    thumbnail: 'https://picsum.photos/800/450?random=7',
    content: '在田子坊的巷子里，偶遇一位街头艺人正在弹奏吉他。他的音乐婉转动人，吸引了不少路人驻足欣赏。',
    date: '2026-04-12',
    location: '上海田子坊'
  }
]);

const currentFilter = ref('all');
const filters = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'text', label: '文字', icon: '📝' },
  { value: 'image', label: '图片', icon: '🖼' },
  { value: 'video', label: '视频', icon: '🎬' }
];

const stats = ref([
  { label: '日记', value: 48, icon: 'book' },
  { label: '照片', value: '256', icon: 'camera' },
  { label: '视频', value: 12, icon: 'video' }
]);

const filteredItems = () => {
  if (currentFilter.value === 'all') {
    return lifeItems.value;
  }
  return lifeItems.value.filter(item => item.type === currentFilter.value);
};
</script>

<template>
  <div class="life-page">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="navigateTo('home')">我的博客</h1>
          <nav class="nav">
            <ul>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('home')">首页</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('articles')">文章</a></li>
              <li><a href="#" class="nav-link active" @click.prevent="navigateTo('life')">生活</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('portfolio')">作品</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('resume')">简历</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('friends')">友链</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main">
      <div class="container">
        <!-- Hero Section -->
        <section class="hero">
          <div class="hero-content">
            <h2 class="hero-title">
              <span class="title-icon">📔</span>
              生活点滴
            </h2>
            <p class="hero-description">
              用文字、图片和视频记录生活的每一个美好瞬间。
            </p>
          </div>
          <div class="hero-stats">
            <div v-for="stat in stats" :key="stat.label" class="stat-item">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </section>

        <!-- 筛选标签 -->
        <section class="filter-section">
          <div class="filter-tabs">
            <button
              v-for="filter in filters"
              :key="filter.value"
              :class="['filter-tab', { active: currentFilter === filter.value }]"
              @click="currentFilter = filter.value"
            >
              <span class="tab-icon">{{ filter.icon }}</span>
              <span class="tab-label">{{ filter.label }}</span>
            </button>
          </div>
        </section>

        <!-- 生活内容列表 -->
        <section class="life-section">
          <div class="life-grid">
            <article
              v-for="item in filteredItems()"
              :key="item.id"
              class="life-card"
              :class="item.type"
            >
              <!-- 图片类型 -->
              <template v-if="item.type === 'image'">
                <div class="life-images">
                  <div class="images-grid" :class="'images-' + item.images.length">
                    <div
                      v-for="(img, index) in item.images"
                      :key="index"
                      class="image-item"
                    >
                      <img :src="img" :alt="item.title" loading="lazy" />
                    </div>
                  </div>
                </div>
                <div class="life-content">
                  <div class="life-meta">
                    <span class="life-date">{{ item.date }}</span>
                    <span class="life-location">
                      <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      {{ item.location }}
                    </span>
                  </div>
                  <h3 class="life-title">{{ item.title }}</h3>
                  <p class="life-text">{{ item.content }}</p>
                </div>
              </template>

              <!-- 视频类型 -->
              <template v-else-if="item.type === 'video'">
                <div class="life-video">
                  <div class="video-thumbnail">
                    <img :src="item.thumbnail" :alt="item.title" />
                    <div class="play-button">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="life-content">
                  <div class="life-meta">
                    <span class="life-date">{{ item.date }}</span>
                    <span class="life-location">
                      <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      {{ item.location }}
                    </span>
                  </div>
                  <h3 class="life-title">{{ item.title }}</h3>
                  <p class="life-text">{{ item.content }}</p>
                </div>
              </template>

              <!-- 文字类型 -->
              <template v-else>
                <div class="life-text-content">
                  <div class="life-meta">
                    <span class="life-date">{{ item.date }}</span>
                    <span class="life-location">
                      <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                      </svg>
                      {{ item.location }}
                    </span>
                  </div>
                  <h3 class="life-title">{{ item.title }}</h3>
                  <p class="life-text">{{ item.content }}</p>
                </div>
              </template>
            </article>
          </div>
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3 class="footer-logo">我的博客</h3>
            <p class="footer-description">记录生活，分享成长</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><a href="#" @click.prevent="navigateTo('home')">首页</a></li>
              <li><a href="#" @click.prevent="navigateTo('articles')">文章</a></li>
              <li><a href="#" @click.prevent="navigateTo('life')">生活</a></li>
              <li><a href="#" @click.prevent="navigateTo('portfolio')">作品</a></li>
              <li><a href="#" @click.prevent="navigateTo('resume')">简历</a></li>
              <li><a href="#" @click.prevent="navigateTo('friends')">友链</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 我的博客. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.header {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #DC2626;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #B91C1C;
}

.nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #3F3F46;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
}

.nav-link:hover,
.nav-link.active {
  color: #DC2626;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #DC2626;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.main {
  flex: 1;
  padding: 40px 0;
}

.hero {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 40px 48px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #18181B;
}

.title-icon {
  font-size: 40px;
}

.hero-description {
  margin: 0;
  color: #4B5563;
  line-height: 1.7;
  font-size: 16px;
}

.hero-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #DC2626;
}

.stat-label {
  font-size: 13px;
  color: #6B7280;
}

.filter-section {
  margin-bottom: 40px;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 8px;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background-color: transparent;
  color: #6B7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  color: #DC2626;
  background-color: rgba(220, 38, 38, 0.1);
}

.filter-tab.active {
  background-color: #DC2626;
  color: #FFFFFF;
}

.tab-icon {
  font-size: 18px;
}

.life-grid {
  display: grid;
  gap: 24px;
}

.life-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.life-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.life-images {
  position: relative;
}

.images-grid {
  display: grid;
  gap: 4px;
}

.images-grid.images-1 {
  grid-template-columns: 1fr;
}

.images-grid.images-2 {
  grid-template-columns: repeat(2, 1fr);
}

.images-grid.images-3 {
  grid-template-columns: repeat(3, 1fr);
}

.images-grid.images-4 {
  grid-template-columns: repeat(2, 1fr);
}

.images-grid.images-4 .image-item:first-child {
  grid-column: span 2;
}

.image-item {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4/3;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.life-card:hover .image-item img {
  transform: scale(1.05);
}

.life-video {
  position: relative;
}

.video-thumbnail {
  position: relative;
  cursor: pointer;
}

.video-thumbnail img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 72px;
  height: 72px;
  background-color: rgba(220, 38, 38, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.play-button svg {
  width: 28px;
  height: 28px;
  color: #FFFFFF;
  margin-left: 4px;
}

.video-thumbnail:hover .play-button {
  transform: translate(-50%, -50%) scale(1.1);
  background-color: #DC2626;
}

.life-content,
.life-text-content {
  padding: 24px 28px;
}

.life-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.life-date {
  font-size: 13px;
  color: #6B7280;
}

.life-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6B7280;
}

.meta-icon {
  width: 14px;
  height: 14px;
}

.life-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #18181B;
}

.life-text {
  margin: 0;
  color: #4B5563;
  line-height: 1.8;
  font-size: 15px;
}

.footer {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 60px 0 30px;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 40px;
}

.footer-info {
  flex: 1;
  min-width: 250px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #DC2626;
}

.footer-description {
  margin: 0;
  color: #6B7280;
  line-height: 1.6;
}

.footer-links h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #18181B;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  text-decoration: none;
  color: #6B7280;
  transition: color 0.3s ease;
  font-size: 14px;
}

.footer-links a:hover {
  color: #DC2626;
}

.footer-bottom {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #6B7280;
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 32px;
    gap: 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-stats {
    gap: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .nav ul {
    gap: 16px;
    flex-wrap: wrap;
  }

  .filter-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .images-grid.images-3 {
    grid-template-columns: repeat(2, 1fr);
  }

  .images-grid.images-3 .image-item:last-child {
    display: none;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 24px;
  }

  .hero-title {
    font-size: 24px;
  }

  .images-grid.images-2,
  .images-grid.images-3,
  .images-grid.images-4 {
    grid-template-columns: 1fr;
  }

  .images-grid.images-4 .image-item:first-child {
    grid-column: auto;
  }

  .life-content,
  .life-text-content {
    padding: 20px;
  }

  .life-title {
    font-size: 18px;
  }

  .play-button {
    width: 56px;
    height: 56px;
  }
}
</style>