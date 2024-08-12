<script setup></script>

<template>
  <div class="page-wrapper">
    <three-scene></three-scene>
    <change-scene-side></change-scene-side>
  </div>
</template>

<style scoped lang="less">
.page-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.change-side {
  position: absolute;
  z-index: 10;
  bottom: 0.24rem;
  right: 0.24rem;
}
</style>
