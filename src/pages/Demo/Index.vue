<script setup></script>

<template>
  <div class="scene-wrapper">
    <div class="main-scene"></div>
  </div>
</template>

<style scoped lang="less">
.scene-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  user-select: none;
}
.main-scene {
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
}
</style>
