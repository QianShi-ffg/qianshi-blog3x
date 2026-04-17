<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import BackgroundBlobs from './components/layout/BackgroundBlobs.vue'
</script>

<template>
  <div class="app-container">
    <!-- Global Dynamic Background -->
    <BackgroundBlobs />

    <Navbar />

    <main class="app-main">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>

<style>
/* Global Selection Style */
::selection {
  background-color: #f43f5e; /* rose-500 */
  color: #ffffff; /* white */
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  background-color: transparent;
  color: #475569; /* slate-600 */
  position: relative;
}

.app-main {
  flex-grow: 1;
  width: 100%;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
