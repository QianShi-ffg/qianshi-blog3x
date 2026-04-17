<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Define the properties of each blob
interface BlobState {
  x: number // Represents viewport width percentage (vw)
  y: number // Represents viewport height percentage (vh)
  colorClass: string
  sizeClass: string
  animationDelay: string
}

// Helper to get random number in range
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min

// Initialize the 3 blobs with completely random starting positions
const blobs = ref<BlobState[]>([
  {
    x: randomRange(0, 100),
    y: randomRange(0, 100),
    colorClass: 'bg-color-1',
    sizeClass: 'size-1',
    animationDelay: '0s'
  },
  {
    x: randomRange(0, 100),
    y: randomRange(0, 100),
    colorClass: 'bg-color-2',
    sizeClass: 'size-2',
    animationDelay: '2s'
  },
  {
    x: randomRange(0, 100),
    y: randomRange(0, 100),
    colorClass: 'bg-color-3',
    sizeClass: 'size-3',
    animationDelay: '4s'
  }
])

let intervalId: ReturnType<typeof setInterval>

const updateBlobs = () => {
  blobs.value.forEach(blob => {
    // Generate entirely random new coordinates within the viewport.
    // X goes from -10vw to 110vw (allowing them to partially drift off-screen)
    // Y goes from -10vh to 110vh
    blob.x = randomRange(-10, 110)
    blob.y = randomRange(-10, 110)
  })
}

onMounted(() => {
  // Start the journey slightly after mount
  setTimeout(updateBlobs, 100)

  // Every 14 seconds, set a completely new random destination (up, down, left, right)
  intervalId = setInterval(updateBlobs, 14000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="blob-container">
    <!-- Outer wrapper for continuous random movement via JS -->
    <div
      v-for="(blob, index) in blobs"
      :key="index"
      class="blob-mover"
      :style="{
        top: 0,
        left: 0,
        transform: `translate(calc(${blob.x}vw - 50%), calc(${blob.y}vh - 50%))`
      }"
    >
      <!-- Inner div for CSS breathing animation (scale/opacity) -->
      <div
        class="blob-inner"
        :class="[blob.colorClass, blob.sizeClass]"
        :style="{
          animationDelay: blob.animationDelay
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.blob-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -50;
  background-color: rgba(248, 250, 252, 0.2); /* slate-50/20 */
}

.blob-mover {
  position: absolute;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 14000ms;
}

.blob-inner {
  border-radius: 9999px;
  mix-blend-mode: multiply;
  filter: blur(80px);
  animation: breathe 8s infinite alternate ease-in-out;
}

/* Colors */
.bg-color-1 { background-color: rgba(253, 164, 175, 0.5); } /* rose-300/50 */
.bg-color-2 { background-color: rgba(147, 197, 253, 0.4); } /* blue-300/40 */
.bg-color-3 { background-color: rgba(253, 230, 138, 0.5); } /* amber-200/50 */

/* Sizes */
.size-1 {
  width: 40vw;
  height: 40vw;
  max-width: 400px;
  max-height: 400px;
}
.size-2 {
  width: 35vw;
  height: 35vw;
  max-width: 350px;
  max-height: 350px;
}
.size-3 {
  width: 38vw;
  height: 38vw;
  max-width: 380px;
  max-height: 380px;
}

/*
  We use pure CSS keyframes for the "breathing" effect (scale and opacity),
  while Vue handles the long-distance, randomized movement via inline transforms.
*/
@keyframes breathe {
  0% {
    opacity: 0.6;
    transform: scale(0.85);
  }
  100% {
    opacity: 1;
    transform: scale(1.15);
  }
}
</style>
