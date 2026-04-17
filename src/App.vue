<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Home from './components/Home.vue'
import Articles from './components/Articles.vue'
import Life from './components/Life.vue'
import Portfolio from './components/Portfolio.vue'
import Resume from './components/Resume.vue'
import Friends from './components/Friends.vue'
import ArticleDetail from './components/ArticleDetail.vue'

const currentPage = ref('home')
const currentArticle = ref(null)
const blobs = ref([])

const navigateTo = (page) => {
  currentPage.value = page
  currentArticle.value = null
}

const showArticle = (article) => {
  currentArticle.value = article
}

const backToHome = () => {
  currentPage.value = 'home'
  currentArticle.value = null
}

const generateBlobs = () => {
  const colors = [
    'rgba(220, 38, 38, 0.4)',
    'rgba(239, 68, 68, 0.35)',
    'rgba(59, 130, 246, 0.4)',
    'rgba(16, 185, 129, 0.35)',
    'rgba(245, 158, 11, 0.4)',
    'rgba(139, 92, 246, 0.35)',
  ]

  const newBlobs = []
  for (let i = 0; i < 8; i++) {
    newBlobs.push({
      id: i,
      size: Math.random() * 400 + 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 15 + 20,
    })
  }
  blobs.value = newBlobs
}

onMounted(() => {
  generateBlobs()
  setInterval(generateBlobs, 30000)
})
</script>

<template>
  <div class="app">
    <!-- 动态背景色块 -->
    <div class="background-pattern">
      <div
        v-for="blob in blobs"
        :key="blob.id"
        class="background-blob"
        :style="{
          width: blob.size + 'px',
          height: blob.size + 'px',
          left: blob.x + '%',
          top: blob.y + '%',
          backgroundColor: blob.color,
          animationDelay: blob.delay + 's',
          animationDuration: blob.duration + 's',
        }"
      ></div>
    </div>

    <!-- 文章详情页 -->
    <ArticleDetail v-if="currentArticle" :article="currentArticle" @back="backToHome" />

    <!-- 首页 -->
    <Home v-else-if="currentPage === 'home'" @navigate="navigateTo" @show-article="showArticle" />

    <!-- 文章页 -->
    <Articles
      v-else-if="currentPage === 'articles'"
      @navigate="navigateTo"
      @show-article="showArticle"
    />

    <!-- 生活页 -->
    <Life v-else-if="currentPage === 'life'" @navigate="navigateTo" />

    <!-- 作品页 -->
    <Portfolio v-else-if="currentPage === 'portfolio'" @navigate="navigateTo" />

    <!-- 简历页 -->
    <Resume v-else-if="currentPage === 'resume'" @navigate="navigateTo" />

    <!-- 友链页 -->
    <Friends v-else-if="currentPage === 'friends'" @navigate="navigateTo" />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  color: #09090b;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Helvetica Neue', sans-serif;
  line-height: 1.5;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: blob-move 25s infinite ease-in-out;
}

@keyframes blob-move {
  0% {
    transform: translate(0, 0) scale(1);
  }
  10% {
    transform: translate(15vw, 25vh) scale(1.15);
  }
  20% {
    transform: translate(35vw, 10vh) scale(0.9);
  }
  30% {
    transform: translate(55vw, 35vh) scale(1.2);
  }
  40% {
    transform: translate(75vw, 15vh) scale(0.95);
  }
  50% {
    transform: translate(85vw, 45vh) scale(1.1);
  }
  60% {
    transform: translate(65vw, 65vh) scale(1.15);
  }
  70% {
    transform: translate(45vw, 85vh) scale(0.9);
  }
  80% {
    transform: translate(25vw, 55vh) scale(1.1);
  }
  90% {
    transform: translate(8vw, 75vh) scale(0.95);
  }
  100% {
    transform: translate(0, 0) scale(1);
  }
}

.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .container {
    max-width: 100%;
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
