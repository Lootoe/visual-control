<script setup>
defineOptions({
  name: 'loading-cover',
})
import useLoadingStoreHook from '@/store/useLoadingStore'
import { ref, watch } from 'vue'
const loadingStore = useLoadingStoreHook()
const localLoading = ref(false)

// 这个watch是为了每次消失前，有个5秒渐变
watch(
  () => loadingStore.loading,
  (val) => {
    if (!val) {
      loadingStore.opacity = 0
      setTimeout(() => {
        localLoading.value = false
        // 再次设置为0.5是为了下次使用方便
        loadingStore.opacity = 0.8
      }, 500)
    } else {
      localLoading.value = true
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="localLoading" class="page-wrapper" :style="{ opacity: loadingStore.opacity }">
    <div class="locate">
      <loading-spinner class="ls"></loading-spinner>
      <div class="loading-text">{{ loadingStore.loadingText }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.page-wrapper {
  background-color: #000;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
  transition: opacity 0.5s ease;
  .locate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .loading-text {
    font-size: 0.2rem;
    color: #eee;
    margin-top: 0.24rem;
  }
}
</style>
