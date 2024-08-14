<script setup>
defineOptions({
  name: 'loading-spinner',
})
</script>

<template>
  <div class="spinner-wrapper">
    <div class="spinner"></div>
    <div class="spinner-text">loading</div>
  </div>
</template>

<style scoped lang="less">
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
    border: 0.06rem solid transparent;
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
</style>
