<script setup>
import init3DAssets from '@/interface'

defineOptions({
  name: 'ThreeScene',
})

onMounted(() => {
  init3DAssets()
})
</script>

<template>
  <div class="scene-wrapper">
    <div class="main-scene"></div>
    <div class="assist-scene"></div>
  </div>
</template>

<style scoped lang="less">
.scene-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  user-select: none;
  position: 10;
}
.main-scene {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}
.assist-scene {
  position: absolute;
  z-index: 11;
  top: 0;
  right: 0;
  width: 1.6rem;
  height: 1.6rem;
}
</style>
