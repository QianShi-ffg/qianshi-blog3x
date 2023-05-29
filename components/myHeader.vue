<template>
  <header class="myHeader">
    <span>首页</span>
  </header>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
header.myHeader {
  display: flex;
  align-items: center;
  padding: 0 30px;
  width: 100%;
  height: 64px;
  background-color: rgba(240, 248, 255, 0.582);
  box-sizing: border-box;
  span {
    cursor: pointer;
  }
}
</style>