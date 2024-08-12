<script setup></script>

<template>
  <div class="page-wrapper">
    <three-scene></three-scene>
    <change-scene-side></change-scene-side>
    <!-- <visible-panel></visible-panel> -->
    <nucleus-panel></nucleus-panel>
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
.visible-manager {
  position: absolute;
  z-index: 10;
  top: 0.24rem;
  left: 2.6rem;
}
.nucleus-manager {
  position: absolute;
  z-index: 10;
  top: 0.24rem;
  left: 0.24rem;
}
</style>
