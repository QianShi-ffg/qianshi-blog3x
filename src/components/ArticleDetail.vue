<script setup lang="ts">
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['back']);

const backToHome = () => {
  emit('back');
};
</script>

<template>
  <div class="article-detail-container">
    <!-- 头部 -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 class="logo" @click="backToHome">我的博客</h1>
          <nav class="nav">
            <ul>
              <li><a href="#" class="nav-link active">首页</a></li>
              <li><a href="#" class="nav-link">作品</a></li>
              <li><a href="#" class="nav-link">简历</a></li>
              <li><a href="#" class="nav-link">友链</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>

    <!-- 文章内容 -->
    <main class="main">
      <div class="container">
        <article class="article-detail">
          <button class="back-button" @click="backToHome">
            <span class="back-icon">←</span>
            <span>返回首页</span>
          </button>
          <h2 class="article-title">{{ article.title }}</h2>
          <div class="article-meta">
            <span class="article-date">
              <svg class="meta-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              {{ article.date }}
            </span>
            <span :class="['article-category', article.category]">{{ article.category }}</span>
          </div>
          <div class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="article-tag"># {{ tag }}</span>
          </div>
          <div class="article-content">
            <p>{{ article.content }}</p>
            <p>
              这是一篇关于 {{ article.category }} 的精彩文章。文章涵盖了 {{ article.tags.join('、') }} 等多个方面，
              希望能够给你带来一些启发和帮助。如果有任何问题或建议，欢迎通过邮件与我联系。
            </p>
          </div>
          <div class="article-footer">
            <button class="back-button" @click="backToHome">
              <span class="back-icon">←</span>
              <span>返回文章列表</span>
            </button>
          </div>
        </article>
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
              <li><a href="#">首页</a></li>
              <li><a href="#">作品</a></li>
              <li><a href="#">简历</a></li>
              <li><a href="#">友链</a></li>
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

/* 文章详情 */
.article-detail {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.article-detail::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #DC2626 0%, #EF4444 100%);
}

.back-button {
  background-color: transparent;
  border: none;
  color: #DC2626;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  padding: 8px 0;
}

.back-button:hover {
  color: #B91C1C;
  transform: translateX(-4px);
}

.back-icon {
  font-size: 18px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 24px 0;
  color: #18181B;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  gap: 24px;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.article-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6B7280;
}

.meta-icon {
  width: 18px;
  height: 18px;
}

.article-category {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.article-category.技术 {
  background-color: #FEE2E2;
  color: #DC2626;
}

.article-category.生活 {
  background-color: #DBEAFE;
  color: #2563EB;
}

.article-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.article-tag {
  font-size: 14px;
  color: #9CA3AF;
}

.article-content {
  line-height: 1.8;
  color: #374151;
  font-size: 16px;
  margin-bottom: 40px;
}

.article-content p {
  margin: 0 0 24px 0;
}

.article-footer {
  border-top: 1px solid #E5E7EB;
  padding-top: 24px;
  display: flex;
  justify-content: flex-start;
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
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .nav ul {
    gap: 20px;
  }

  .header {
    padding: 16px 0;
  }

  .main {
    padding: 40px 0;
  }

  .article-detail {
    padding: 32px;
  }

  .article-title {
    font-size: 28px;
  }

  .footer {
    padding: 40px 0 20px;
    margin-top: 60px;
  }

  .footer-content {
    flex-direction: column;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .article-detail {
    padding: 24px;
  }

  .logo {
    font-size: 24px;
  }

  .article-title {
    font-size: 24px;
  }

  .article-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>