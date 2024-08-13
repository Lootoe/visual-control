<script setup>
defineOptions({ name: 'change-scene-side' })
defineProps({
  backgroundColor: {
    type: String,
    default: 'rgba(51, 61, 80, 1)',
  },
})

import { SCENE_FACES, changeSceneSide } from '@/modules/scene'

const sideItems = ref([])

const changeSceneSideFn = (item, index) => {
  const target = sideItems.value[index]
  target.classList.add('clicked')
  setTimeout(() => {
    target.classList.remove('clicked')
  }, 150)
  changeSceneSide(item)
}
</script>

<template>
  <div class="change-side">
    <div class="face-list">
      <div
        class="face-item"
        v-for="(item, index) in SCENE_FACES"
        :key="index"
        @click="changeSceneSideFn(item, index)"
        :style="{ backgroundColor: backgroundColor }"
        ref="sideItems"
      >
        <img class="face-img" :src="item.icon" />
        <div class="face-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.change-side {
  .face-list {
    display: flex;
    align-items: center;
  }
  .face-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 0.16rem;
    border-radius: 0.04rem;
    transition: all 0.3s ease;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0.12rem;
    &.clicked {
      background-color: rgba(122, 192, 199, 1) !important;
    }
    .face-img {
      width: 0.5rem;
      height: 0.5rem;
      margin-bottom: 0.08rem;
    }
    .face-name {
      font-size: 0.16rem;
      color: rgba(255, 255, 255, 0.85);
    }
  }
}
</style>
