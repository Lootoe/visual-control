<script setup>
defineOptions({
  name: 'loading-cover',
})
import useLoadingStoreHook from '@/store/useLoadingStore'
const loadingStore = useLoadingStoreHook()
</script>

<template>
  <div class="page-mask" v-if="loadingStore.loading">
    <div class="locate">
      <template v-if="!loadingStore.loadingFail">
        <loading-spinner></loading-spinner>
        <div class="loading-text">{{ loadingStore.loadingText }}</div>
      </template>
      <template v-else>
        <div class="fail-img">
          <img src="@/assets/img/error.png" />
        </div>
        <div class="fail-reason">{{ loadingStore.failReason }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.page-mask {
  background-color: #000;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
  opacity: 0.8;
  .locate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .fail-img {
    width: 1rem;
    height: 1rem;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .loading-text {
    font-size: 0.2rem;
    color: #eee;
    margin-top: 0.24rem;
  }
  .fail-reason {
    font-size: 0.2rem;
    color: #eee;
    margin-top: 0.24rem;
  }
}
</style>
