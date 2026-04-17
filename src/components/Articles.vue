<script setup lang="ts">
import { ref } from 'vue'

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
    category: '前端',
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
    category: '前端',
    tags: ['TypeScript', '前端'],
    views: 96,
    featured: false,
  },
  {
    id: 3,
    title: 'Node.js 性能优化指南',
    content:
      'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时。本文将深入探讨如何优化 Node.js 应用的性能，包括内存管理、异步编程、性能监控等方面。',
    date: '2026-04-13',
    category: '后端',
    tags: ['Node.js', '后端'],
    views: 156,
    featured: false,
  },
  {
    id: 4,
    title: 'Python 数据分析实战',
    content:
      '使用 Pandas、NumPy 和 Matplotlib 进行数据分析的完整指南。本文通过实际案例，展示如何处理数据、生成可视化图表。',
    date: '2026-04-10',
    category: '数据',
    tags: ['Python', '数据'],
    views: 203,
    featured: false,
  },
  {
    id: 5,
    title: 'Docker 容器化部署实践',
    content:
      '容器化已经成为现代应用部署的标准方式。本文介绍如何使用 Docker 将应用容器化，包括 Dockerfile 编写、镜像构建、容器编排等内容。',
    date: '2026-04-08',
    category: 'DevOps',
    tags: ['Docker', 'DevOps'],
    views: 178,
    featured: false,
  },
  {
    id: 6,
    title: 'React Hooks 完全指南',
    content:
      'React Hooks 是 React 16.8 引入的新特性，它让我们可以在函数组件中使用 state 和其他 React 特性。本文详细介绍常用 Hooks 的使用方法和最佳实践。',
    date: '2026-04-05',
    category: '前端',
    tags: ['React', '前端'],
    views: 245,
    featured: true,
  },
])

const categories = ['全部', '前端', '后端', '数据', 'DevOps']
const sortOptions = [
  { value: 'date', label: '最新发布' },
  { value: 'views', label: '最多浏览' },
]

const allTags = ref([
  { tag: 'Vue', count: 2 },
  { tag: '前端', count: 3 },
  { tag: 'TypeScript', count: 1 },
  { tag: 'Node.js', count: 1 },
  { tag: '后端', count: 1 },
  { tag: 'Python', count: 1 },
  { tag: '数据', count: 1 },
  { tag: 'Docker', count: 1 },
  { tag: 'DevOps', count: 1 },
  { tag: 'React', count: 1 },
])

const stats = ref([
  { label: '文章', value: 48, icon: 'article' },
  { label: '浏览', value: '12.5k', icon: 'views' },
  { label: '分类', value: 8, icon: 'tag' },
])

const filteredArticles = () => {
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
}

const showArticle = (article) => {
  emit('show-article', article)
}

const navigateTo = (page) => {
  emit('navigate', page)
}

const setActiveTag = (tag) => {
  searchQuery.value = tag
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<template>
  <div class="articles-page">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="navigateTo('home')">我的博客</h1>
          <nav class="nav">
            <ul>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('home')">首页</a></li>
              <li>
                <a href="#" class="nav-link active" @click.prevent="navigateTo('articles')">文章</a>
              </li>
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
          <div class="hero-content">
            <h2 class="hero-title">
              <span class="title-icon">📚</span>
              技术文章
            </h2>
            <p class="hero-description">
              分享前端开发、后端技术、DevOps 等领域的学习心得与实践经验。
            </p>
            <div class="hero-tags">
              <span class="tag">前端开发</span>
              <span class="tag">后端技术</span>
              <span class="tag">DevOps</span>
            </div>
          </div>
          <div class="hero-stats">
            <div v-for="stat in stats" :key="stat.label" class="stat-item">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
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
          <div :class="['article-list', viewMode]">
            <article
              v-for="article in filteredArticles()"
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
  color: #18181b;
}

.title-icon {
  font-size: 40px;
}

.hero-description {
  margin: 0 0 20px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 16px;
}

.hero-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  padding: 8px 16px;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
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
  color: #dc2626;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.filter-section {
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 16px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
}

.search-input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.search-clear {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.3s ease;
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
  background-color: rgba(255, 255, 255, 0.7);
  padding: 6px;
  border-radius: 12px;
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
  background-color: rgba(255, 255, 255, 0.7);
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

.tags-section {
  margin-bottom: 40px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}

.tags-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background-color: #dc2626;
  color: #ffffff;
}

.tag-count {
  padding: 2px 8px;
  background-color: rgba(220, 38, 38, 0.15);
  border-radius: 10px;
  font-size: 11px;
}

.tag-item:hover .tag-count {
  background-color: rgba(255, 255, 255, 0.2);
}

.articles {
  margin-bottom: 60px;
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
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 4px solid transparent;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateX(8px);
  border-left-color: #dc2626;
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
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #6b7280;
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

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .article-list.grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
