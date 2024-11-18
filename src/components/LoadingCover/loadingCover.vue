<script setup>
defineOptions({
  name: 'loading-cover',
})

defineProps({
  content: {
    type: String,
    default: 'loading',
  },
  opacity: {
    type: Number,
    default: 1,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  failed: {
    type: Boolean,
    default: false,
  },
  failedReason: {
    type: String,
    default: '加载失败',
  },
})
</script>

<template>
  <div class="page-mask" v-if="loading" :style="{ opacity: opacity }">
    <div class="locate">
      <template v-if="!failed">
        <div class="spinner-wrapper">
          <div class="spinner"></div>
          <div class="spinner-text">loading</div>
        </div>
        <div class="loading-text">{{ content }}</div>
      </template>
      <template v-else>
        <div class="fail-img">
          <img src="@/assets/img/error.png" />
        </div>
        <div class="fail-reason">{{ failedReason }}</div>
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
  left: 0;
  top: 0;
  z-index: 9999;
  transition: all 0.3s;
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
  .spinner-wrapper {
    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .spinner {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 0.04rem solid transparent;
      border-top-color: #7766da;
      border-bottom-color: #ec4c24;
      animation: spinner 0.6s ease infinite;
    }

    .spinner-text {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 0.16rem;
      font-weight: bold;
      letter-spacing: 0.01rem;
      animation: breathing 1.5s ease-in-out infinite;
    }
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes breathing {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
</style>
