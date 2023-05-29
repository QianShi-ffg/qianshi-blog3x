<template>
  <div>
    66666
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending, error } = await useFetch(() => `/article/publishArticle?page=1&pageSize=10`, { baseURL: 'http://localhost:3022' });
console.log(posts.value.data, pending, error)
</script>

<style scoped>

</style>