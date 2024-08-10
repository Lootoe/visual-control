<script setup>
defineOptions({
  name: 'loading-cover',
})
import { useLoadingStoreHook } from '@/store/useLoadingStore'
import { ref, watch } from 'vue'
const { getLoadingProps, setLoadingProps } = useLoadingStoreHook()
const loadingProps = getLoadingProps()
const { opacity, loading, loadingText } = toRefs(loadingProps)
const localLoading = ref(true)

// 这个watch是为了每次消失前，有个5秒渐变
watch(loading, (val) => {
  if (!val) {
    setLoadingProps('opacity', 0)
    setTimeout(() => {
      localLoading.value = false
      // 再次设置为0.5是为了下次使用方便
      setLoadingProps('opacity', 0.8)
    }, 500)
  } else {
    localLoading.value = true
  }
})
</script>

<template>
  <div v-if="localLoading" class="page-wrapper" :style="{ opacity: opacity }">
    <div class="locate">
      <loading-spinner class="ls"></loading-spinner>
      <div class="loading-text">{{ loadingText }}</div>
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
    font-size: 0.18rem;
    color: #eee;
    margin-top: 0.2rem;
  }
}
</style>
