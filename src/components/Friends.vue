<script setup lang="ts">
const emit = defineEmits(['navigate']);

const navigateTo = (page) => {
  emit('navigate', page);
};

const friends = [
  {
    id: 1,
    name: '前端小站',
    description: '分享前端开发技术博客',
    url: 'https://example.com',
    avatar: '🎨',
    tags: ['前端', 'Vue']
  },
  {
    id: 2,
    name: '技术随笔',
    description: '记录技术学习和成长',
    url: 'https://example.com',
    avatar: '💻',
    tags: ['技术', 'React']
  },
  {
    id: 3,
    name: '全栈之路',
    description: '全栈开发者的技术分享',
    url: 'https://example.com',
    avatar: '🚀',
    tags: ['全栈', 'Node.js']
  },
  {
    id: 4,
    name: '生活点滴',
    description: '记录生活的美好瞬间',
    url: 'https://example.com',
    avatar: '📷',
    tags: ['生活', '摄影']
  },
  {
    id: 5,
    name: '设计之家',
    description: 'UI/UX设计灵感分享',
    url: 'https://example.com',
    avatar: '🎭',
    tags: ['设计', 'UI']
  },
  {
    id: 6,
    name: '开源世界',
    description: '开源项目与社区贡献',
    url: 'https://example.com',
    avatar: '🌟',
    tags: ['开源', 'GitHub']
  }
];
</script>

<template>
  <div class="friends">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="navigateTo('home')">我的博客</h1>
          <nav class="nav">
            <ul>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('home')">首页</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('portfolio')">作品</a></li>
              <li><a href="#" class="nav-link" @click.prevent="navigateTo('resume')">简历</a></li>
              <li><a href="#" class="nav-link active" @click.prevent="navigateTo('friends')">友链</a></li>
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
          <h2 class="hero-title">友情链接</h2>
          <p class="hero-description">
            这里汇集了一些优秀的技术博客和网站，希望这些资源也能对你有所帮助。
          </p>
        </section>

        <!-- 友链说明 -->
        <section class="info-section">
          <div class="info-card">
            <div class="info-icon-wrapper">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <div class="info-content">
              <h3>交换友链</h3>
              <p>如果你也有一个技术博客，并且希望交换友链，欢迎通过邮件联系我。请在邮件中注明你的博客名称、地址和简介。</p>
              <div class="info-contact">
                <span>📧 zhangming@example.com</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 友链列表 -->
        <section class="friends-section">
          <h3 class="section-title">
            <span class="title-icon">🔗</span>
            优秀博客
          </h3>
          <div class="friends-grid">
            <a v-for="friend in friends" :key="friend.id" :href="friend.url" class="friend-card" target="_blank" rel="noopener noreferrer">
              <div class="friend-avatar">
                <span>{{ friend.avatar }}</span>
              </div>
              <div class="friend-info">
                <h4 class="friend-name">{{ friend.name }}</h4>
                <p class="friend-description">{{ friend.description }}</p>
                <div class="friend-tags">
                  <span v-for="tag in friend.tags" :key="tag" class="friend-tag">{{ tag }}</span>
                </div>
              </div>
              <div class="friend-arrow">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </a>
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

/* 友链说明 */
.info-section {
  margin-bottom: 60px;
}

.info-card {
  display: flex;
  gap: 24px;
  padding: 32px;
  background-color: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.info-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: #FEE2E2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon {
  width: 30px;
  height: 30px;
  color: #DC2626;
}

.info-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #18181B;
}

.info-content p {
  margin: 0 0 16px 0;
  color: #4B5563;
  line-height: 1.6;
  font-size: 14px;
}

.info-contact {
  display: flex;
  gap: 20px;
}

.info-contact span {
  padding: 8px 16px;
  background-color: #FEF2F2;
  color: #DC2626;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* 友链列表 */
.friends-section {
  margin-bottom: 40px;
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

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-decoration: none;
  transition: all 0.3s ease;
}

.friend-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.friend-avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.friend-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #18181B;
}

.friend-description {
  margin: 0 0 8px 0;
  color: #6B7280;
  font-size: 13px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.friend-tags {
  display: flex;
  gap: 6px;
}

.friend-tag {
  padding: 2px 8px;
  background-color: #FEE2E2;
  color: #DC2626;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.friend-arrow {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: #9CA3AF;
  transition: all 0.3s ease;
}

.friend-card:hover .friend-arrow {
  color: #DC2626;
  transform: translateX(4px);
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

  .info-card {
    flex-direction: column;
    text-align: center;
  }

  .info-contact {
    justify-content: center;
    flex-wrap: wrap;
  }

  .friends-grid {
    grid-template-columns: 1fr;
  }

  .friend-card {
    flex-wrap: wrap;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}
</style>