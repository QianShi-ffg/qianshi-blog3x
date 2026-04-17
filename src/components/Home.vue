<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['navigate', 'show-article'])

const activeTab = ref('all')
const searchQuery = ref('')
const viewMode = ref('grid')

const articles = ref([
  {
    id: 1,
    title: 'Vue3 Composition API 深入理解',
    content:
      'Vue3 引入了 Composition API，这是一种全新的逻辑组织和复用方式。与 Options API 相比，Composition API 提供了更灵活的组织逻辑的方式，特别适合处理复杂的组件逻辑。',
    date: '2026-04-17',
    category: '技术',
    tags: ['Vue', '前端'],
    views: 128,
    featured: true,
  },
  {
    id: 2,
    title: 'TypeScript 最佳实践',
    content:
      'TypeScript 为 JavaScript 添加了静态类型检查，帮助我们在编译阶段发现潜在错误。本文将分享我在项目中使用 TypeScript 的一些最佳实践和经验教训。',
    date: '2026-04-16',
    category: '技术',
    tags: ['TypeScript', '前端'],
    views: 96,
    featured: false,
  },
  {
    id: 3,
    title: '城市漫游日记',
    content:
      '周末在城市里漫步，发现了许多隐藏的宝藏角落。从老弄堂到新地标，每一处都有它独特的故事。',
    date: '2026-04-13',
    category: '生活',
    tags: ['旅行', '城市'],
    views: 156,
    featured: false,
  },
  {
    id: 4,
    title: 'Python 数据分析实战',
    content:
      '使用 Pandas、NumPy 和 Matplotlib 进行数据分析的完整指南。本文通过实际案例，展示如何处理数据、生成可视化图表。',
    date: '2026-04-10',
    category: '技术',
    tags: ['Python', '数据'],
    views: 203,
    featured: false,
  },
  {
    id: 5,
    title: '春日花园之旅',
    content:
      '春天是赏花的好时节，公园里百花齐放，美不胜收。记录下这些美好的瞬间，感受大自然的魅力。',
    date: '2026-04-08',
    category: '生活',
    tags: ['旅行', '摄影'],
    views: 178,
    featured: false,
  },
  {
    id: 6,
    title: 'React Hooks 完全指南',
    content:
      'React Hooks 是 React 16.8 引入的新特性，它让我们可以在函数组件中使用 state 和其他 React 特性。本文详细介绍常用 Hooks 的使用方法和最佳实践。',
    date: '2026-04-05',
    category: '技术',
    tags: ['React', '前端'],
    views: 245,
    featured: true,
  },
])

const categories = ['全部', '技术', '生活']
const sortOptions = [
  { value: 'date', label: '最新发布' },
  { value: 'views', label: '最多浏览' },
]

const allTags = ref([
  { tag: 'Vue', count: 2 },
  { tag: '前端', count: 3 },
  { tag: 'TypeScript', count: 1 },
  { tag: 'Python', count: 1 },
  { tag: '数据', count: 1 },
  { tag: 'React', count: 1 },
  { tag: '旅行', count: 2 },
  { tag: '城市', count: 1 },
  { tag: '摄影', count: 1 },
])

const stats = ref([
  { label: '文章', value: 48, icon: 'article' },
  { label: '浏览', value: '12.5k', icon: 'views' },
  { label: '标签', value: 32, icon: 'tag' },
])

const featuredArticles = computed(() => {
  return articles.value.filter((article) => article.featured)
})

const filteredArticles = computed(() => {
  let result = [...articles.value]

  if (activeTab.value !== '全部') {
    result = result.filter((article) => article.category === activeTab.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return result
})

const navigateTo = (page) => {
  emit('navigate', page)
}

const showArticle = (article) => {
  emit('show-article', article)
}

const setActiveTag = (tag) => {
  searchQuery.value = tag
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="home">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="navigateTo('home')">我的博客</h1>
          <nav class="nav">
            <ul>
              <li>
                <a href="#" class="nav-link active" @click.prevent="navigateTo('home')">首页</a>
              </li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('articles')">文章</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('life')">生活</a></li>
              <li>
                <a href="#" class="nav-link" @click.prevent="navigateTo('portfolio')">作品</a>
              </li>
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
          <div class="hero-bg-pattern"></div>
          <div class="hero-content">
            <div class="hero-text">
              <h2 class="hero-title">
                你好，我是<span class="highlight">开发者</span>
                <span class="wave">👋</span>
              </h2>
              <p class="hero-description">
                这是一个分享学习笔记、生活见闻和技术心得的个人博客。
                记录成长的每一步，与大家共同进步。
              </p>
              <div class="hero-tags">
                <span class="tag">前端开发</span>
                <span class="tag">Vue</span>
                <span class="tag">TypeScript</span>
                <span class="tag">Node.js</span>
              </div>
            </div>
            <div class="hero-avatar">
              <div class="avatar-wrapper">
                <span class="avatar-text">博客</span>
              </div>
              <div class="avatar-decoration"></div>
            </div>
          </div>
          <div class="hero-stats">
            <div v-for="stat in stats" :key="stat.label" class="stat-item">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </section>

        <!-- 热门推荐 -->
        <section v-if="featuredArticles.length > 0 && !searchQuery" class="featured-section">
          <h3 class="section-title">
            <svg class="section-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
            精选文章
          </h3>
          <div class="featured-grid">
            <article
              v-for="article in featuredArticles"
              :key="article.id"
              class="featured-card"
              @click="showArticle(article)"
            >
              <div class="featured-badge">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                推荐
              </div>
              <div class="featured-content">
                <h4 class="featured-title">{{ article.title }}</h4>
                <p class="featured-excerpt">{{ article.content }}</p>
                <div class="featured-meta">
                  <span class="featured-date">{{ article.date }}</span>
                  <span class="featured-category">{{ article.category }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- 搜索和筛选 -->
        <section class="filter-section">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="search-input"
            />
            <button v-if="searchQuery" class="search-clear" @click="clearSearch">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div class="filter-controls">
            <div class="category-tabs">
              <button
                v-for="cat in categories"
                :key="cat"
                :class="['category-tab', { active: activeTab === cat }]"
                @click="activeTab = cat"
              >
                {{ cat }}
              </button>
            </div>
            <div class="view-toggle">
              <button
                :class="['view-btn', { active: viewMode === 'grid' }]"
                @click="viewMode = 'grid'"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                :class="['view-btn', { active: viewMode === 'list' }]"
                @click="viewMode = 'list'"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <!-- 标签云 -->
        <section class="tags-section">
          <h4 class="tags-title">热门标签</h4>
          <div class="tags-cloud">
            <button
              v-for="tagInfo in allTags"
              :key="tagInfo.tag"
              class="tag-item"
              @click="setActiveTag(tagInfo.tag)"
            >
              # {{ tagInfo.tag }}
              <span class="tag-count">{{ tagInfo.count }}</span>
            </button>
          </div>
        </section>

        <!-- 文章列表 -->
        <section class="articles">
          <div v-if="filteredArticles.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h4 class="empty-title">未找到相关文章</h4>
            <p class="empty-description">尝试使用其他关键词搜索</p>
            <button class="empty-button" @click="clearSearch">清除搜索</button>
          </div>
          <div v-else :class="['article-list', viewMode]">
            <article
              v-for="article in filteredArticles"
              :key="article.id"
              class="article-card"
              @click="showArticle(article)"
            >
              <div class="article-card-header">
                <div class="article-info">
                  <h4 class="article-title">{{ article.title }}</h4>
                  <div class="article-meta">
                    <span class="article-date">
                      <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill-rule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ article.date }}
                    </span>
                    <span class="article-views">
                      <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fill-rule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14.134 15a11.934 11.934 0 01-4.134-1.196 11.94 11.94 0 01-4.134 1.196 11.932 11.932 0 01-4.133-1.196 11.947 11.947 0 014.133-5.803 11.947 11.947 0 014.134 1.196 11.94 11.94 0 014.134-1.196 11.932 11.932 0 014.133 1.196 11.947 11.947 0 01-4.133 5.803z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ article.views }}
                    </span>
                  </div>
                </div>
                <span class="article-category">{{ article.category }}</span>
              </div>
              <p class="article-excerpt">{{ article.content }}</p>
              <div class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="article-tag"># {{ tag }}</span>
              </div>
              <div class="article-footer">
                <span class="read-more">
                  阅读更多
                  <svg class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </div>
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
/* 头部 */
.header {
  background-color: #ffffff;
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
  color: #dc2626;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #b91c1c;
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
  color: #3f3f46;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
}

.nav-link:hover,
.nav-link.active {
  color: #dc2626;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #dc2626;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* 主内容 */
.main {
  flex: 1;
  padding: 40px 0;
}

/* Hero Section */
.hero {
  position: relative;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-radius: 16px;
  padding: 60px 48px;
  margin-bottom: 60px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.1);
}

.hero-bg-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.1));
  border-radius: 50%;
  transform: translate(30%, -30%);
  z-index: 0;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #18181b;
  line-height: 1.2;
}

.highlight {
  color: #dc2626;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: rgba(220, 38, 38, 0.2);
  z-index: -1;
}

.wave {
  display: inline-block;
  animation: wave 2s ease-in-out infinite;
  font-size: 36px;
  margin-left: 12px;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-5deg);
  }
}

.hero-description {
  margin: 0 0 30px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 18px;
}

.hero-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  padding: 10px 20px;
  background-color: #ffffff;
  color: #dc2626;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #fca5a5;
}

.tag:hover {
  background-color: #fca5a5;
  color: #ffffff;
  transform: translateY(-2px);
}

.hero-avatar {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.avatar-wrapper {
  width: 100%;
  height: 100%;
  background-color: #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 48px;
  font-weight: 700;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.avatar-decoration {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px dashed #fca5a5;
  border-radius: 50%;
  animation: rotate 6s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero-stats {
  display: flex;
  gap: 48px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  position: relative;
  z-index: 1;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* 热门推荐 */
.featured-section {
  margin-bottom: 60px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: #18181b;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #dc2626;
}

.featured-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
}

.featured-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.featured-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #dc2626, #fca5a5);
  border-radius: 16px 16px 0 0;
}

.featured-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #dc2626;
  color: #ffffff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

.featured-badge svg {
  width: 16px;
  height: 16px;
}

.featured-content {
  position: relative;
  z-index: 1;
}

.featured-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #18181b;
  transition: color 0.3s ease;
}

.featured-card:hover .featured-title {
  color: #dc2626;
}

.featured-excerpt {
  margin: 0 0 20px 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 15px;
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.featured-date {
  font-size: 13px;
  color: #6b7280;
}

.featured-category {
  padding: 4px 12px;
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* 搜索和筛选 */
.filter-section {
  margin-bottom: 40px;
}

.search-box {
  position: relative;
  margin-bottom: 24px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 16px 56px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.search-input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.search-clear {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.3s ease;
  z-index: 1;
}

.search-clear:hover {
  color: #dc2626;
}

.search-clear svg {
  width: 20px;
  height: 20px;
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.category-tabs {
  display: flex;
  gap: 8px;
  background-color: #f9fafb;
  padding: 6px;
  border-radius: 12px;
  flex: 1;
  min-width: 200px;
}

.category-tab {
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.category-tab:hover {
  color: #dc2626;
}

.category-tab.active {
  background-color: #dc2626;
  color: #ffffff;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background-color: #f9fafb;
  padding: 4px;
  border-radius: 8px;
}

.view-btn {
  padding: 8px 12px;
  border: none;
  background-color: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.view-btn:hover {
  color: #dc2626;
}

.view-btn.active {
  background-color: #dc2626;
  color: #ffffff;
}

.view-btn svg {
  width: 18px;
  height: 18px;
}

/* 标签云 */
.tags-section {
  margin-bottom: 40px;
  padding: 24px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.tags-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background-color: #ffffff;
  color: #dc2626;
  border: 1px solid #fca5a5;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
}

.tag-item:hover {
  background-color: #dc2626;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

.tag-count {
  padding: 2px 8px;
  background-color: #fee2e2;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.tag-item:hover .tag-count {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 文章列表 */
.articles {
  margin-bottom: 60px;
}

.empty-state {
  text-align: center;
  padding: 80px 40px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #18181b;
}

.empty-description {
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 15px;
}

.empty-button {
  padding: 12px 24px;
  background-color: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-button:hover {
  background-color: #b91c1c;
  transform: translateY(-2px);
}

.article-list {
  display: grid;
  gap: 24px;
}

.article-list.grid {
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
}

.article-list.list {
  grid-template-columns: 1fr;
}

.article-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-left: 4px solid transparent;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.article-card:hover {
  transform: translateX(8px);
  border-left-color: #dc2626;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.article-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.article-info {
  flex: 1;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #18181b;
  transition: color 0.3s ease;
}

.article-card:hover .article-title {
  color: #dc2626;
}

.article-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #6b7280;
}

.article-date,
.article-views {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.article-category {
  padding: 4px 12px;
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.article-excerpt {
  margin: 0 0 16px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 14px;
}

.article-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.article-tag {
  font-size: 12px;
  color: #9ca3af;
}

.article-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #dc2626;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.article-card:hover .read-more {
  gap: 12px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.article-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* 页脚 */
.footer {
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 60px 0 30px;
  margin-top: 80px;
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
  color: #dc2626;
}

.footer-description {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.footer-links h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #18181b;
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
  color: #6b7280;
  transition: color 0.3s ease;
  font-size: 14px;
}

.footer-links a:hover {
  color: #dc2626;
}

.footer-bottom {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 40px 32px;
    text-align: center;
  }

  .hero-content {
    flex-direction: column;
    gap: 32px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-stats {
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
  }

  .featured-grid,
  .article-list.grid {
    grid-template-columns: 1fr;
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

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 32px 24px;
  }

  .hero-title {
    font-size: 28px;
  }

  .section-title {
    font-size: 20px;
  }

  .featured-card,
  .article-card {
    padding: 24px;
  }

  .tags-section {
    padding: 20px;
  }

  .empty-state {
    padding: 60px 20px;
  }
}
</style>
