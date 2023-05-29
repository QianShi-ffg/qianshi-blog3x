<template>
  <div>
    <my-header></my-header>
    <main>
      <slot></slot>
    </main>
    <my-footer></my-footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
main {
  width: 100%;
  min-height: 100vh;
}
</style>