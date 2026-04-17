<script setup lang="ts">
const emit = defineEmits(['navigate']);

const navigateTo = (page) => {
  emit('navigate', page);
};

const projects = [
  {
    id: 1,
    title: '电商后台管理系统',
    description: '基于 Vue3 + TypeScript + Element Plus 构建的电商后台管理系统，包含商品管理、订单管理、用户管理等功能模块。',
    tags: ['Vue3', 'TypeScript', 'Element Plus'],
    image: '🏪',
    link: '#'
  },
  {
    id: 2,
    title: '在线协作白板',
    description: '一款支持多人实时协作的在线白板应用，采用 WebSocket 实现实时同步，使用 Canvas 实现绘图功能。',
    tags: ['React', 'WebSocket', 'Canvas'],
    image: '🎨',
    link: '#'
  },
  {
    id: 3,
    title: '个人博客系统',
    description: '使用 Nuxt3 构建的 SSR 博客应用，支持 Markdown 编辑、标签分类、评论系统等完整功能。',
    tags: ['Nuxt3', 'Vue3', 'SSR'],
    image: '📝',
    link: '#'
  },
  {
    id: 4,
    title: '移动端记账应用',
    description: '基于 React Native 开发的移动端记账应用，支持语音输入、图表统计、数据导出等功能。',
    tags: ['React Native', 'TypeScript'],
    image: '💰',
    link: '#'
  }
];

const skills = [
  { name: 'Vue', level: 90 },
  { name: 'React', level: 75 },
  { name: 'TypeScript', level: 85 },
  { name: 'Node.js', level: 70 },
  { name: 'Python', level: 60 },
  { name: 'SQL', level: 65 }
];
</script>

<template>
  <div class="portfolio">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="navigateTo('home')">我的博客</h1>
          <nav class="nav">
            <ul>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('home')">首页</a></li>
              <li><a href="#" class="nav-link active" @click.prevent="navigateTo('portfolio')">作品</a></li>
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
          <h2 class="hero-title">我的作品集</h2>
          <p class="hero-description">
            这里展示了我在工作和学习中完成的一些项目。每一个项目都是一次成长的机会。
          </p>
        </section>

        <!-- 技能展示 -->
        <section class="skills-section">
          <h3 class="section-title">
            <span class="title-icon">⚡</span>
            技术栈
          </h3>
          <div class="skills-grid">
            <div v-for="skill in skills" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 项目展示 -->
        <section class="projects-section">
          <h3 class="section-title">
            <span class="title-icon">🚀</span>
            项目作品
          </h3>
          <div class="projects-grid">
            <article v-for="project in projects" :key="project.id" class="project-card">
              <div class="project-image">
                <span class="project-icon">{{ project.image }}</span>
              </div>
              <div class="project-content">
                <h4 class="project-title">{{ project.title }}</h4>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tags">
                  <span v-for="tag in project.tags" :key="tag" class="project-tag">{{ tag }}</span>
                </div>
                <a :href="project.link" class="project-link">
                  查看详情
                  <svg class="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
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
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.header:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
  gap: 30px;
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

/* 主内容 */
.main {
  flex: 1;
  padding: 60px 0;
}

/* Hero Section */
.hero {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px;
  background: linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%);
  border-radius: 16px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #18181B;
}

.hero-description {
  margin: 0;
  color: #4B5563;
  line-height: 1.7;
  font-size: 16px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* 技能展示 */
.skills-section {
  margin-bottom: 60px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 30px 0;
  color: #18181B;
}

.title-icon {
  font-size: 28px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.skill-item {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.skill-name {
  font-weight: 600;
  color: #18181B;
}

.skill-level {
  color: #DC2626;
  font-weight: 600;
}

.skill-bar {
  height: 8px;
  background-color: #F3F4F6;
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #DC2626 0%, #EF4444 100%);
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* 项目展示 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.project-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.project-image {
  height: 180px;
  background: linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-icon {
  font-size: 64px;
}

.project-content {
  padding: 24px;
}

.project-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #18181B;
}

.project-description {
  margin: 0 0 16px 0;
  color: #4B5563;
  line-height: 1.6;
  font-size: 14px;
}

.project-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.project-tag {
  padding: 4px 12px;
  background-color: #FEE2E2;
  color: #DC2626;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #DC2626;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.project-link:hover {
  color: #B91C1C;
  gap: 12px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
}

/* 页脚 */
.footer {
  background-color: #F9FAFB;
  padding: 60px 0 30px;
  border-top: 1px solid #E4E4E7;
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
  border-top: 1px solid #E4E4E7;
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #6B7280;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 30px;
  }

  .hero-title {
    font-size: 28px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .nav ul {
    gap: 20px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}
</style>