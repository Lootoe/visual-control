<script setup>
import usePatientStoreHook from '@/store/usePatientStore'
import { toggleFullScreen, isPadExist } from '@/core/interface/pad.js'
import { computed } from 'vue'

const patientStore = usePatientStoreHook()
const hasFiber = computed(() => {
  return patientStore.patientAssets?.fiber?.length > 0
})

const uiBg = import.meta.env.VITE_UI_BG
const activedToolIndex = ref(-1)
const changeToolItem = (toolIndex) => {
  if (toolIndex === activedToolIndex.value) {
    activedToolIndex.value = -1
  } else {
    activedToolIndex.value = toolIndex
  }
}

const fullScreen = ref(false)
const localToggleFullScreen = (isFullScreen) => {
  if (isPadExist()) {
    toggleFullScreen(isFullScreen)
  }
  fullScreen.value = !fullScreen.value
}
</script>

<template>
  <div class="page-wrapper">
    <control-scene @click="activedToolIndex = -1"></control-scene>
    <change-scene-side :backgroundColor="uiBg"></change-scene-side>
    <nucleus-panel v-show="activedToolIndex === 0" :backgroundColor="uiBg"></nucleus-panel>
    <visible-panel v-show="activedToolIndex === 1" :backgroundColor="uiBg"></visible-panel>
    <filter-panel v-show="activedToolIndex === 2" :backgroundColor="uiBg"></filter-panel>
    <qi-cranial></qi-cranial>
    <div class="tool-box">
      <div class="tool-item" :style="{ backgroundColor: uiBg }" @click="localToggleFullScreen()">
        <img src="@/assets/img/max.png" v-show="!fullScreen" />
        <img src="@/assets/img/min.png" v-show="fullScreen" />
      </div>
      <div
        class="tool-item"
        @click="changeToolItem(0)"
        :style="{ backgroundColor: activedToolIndex === 0 ? 'rgba(122, 192, 199, 1)' : uiBg }"
      >
        <img src="@/assets/img/palette.png" alt="" />
      </div>
      <div
        class="tool-item"
        @click="changeToolItem(1)"
        :style="{ backgroundColor: activedToolIndex === 1 ? 'rgba(122, 192, 199, 1)' : uiBg }"
      >
        <img src="@/assets/img/layers.png" alt="" />
      </div>
    </div>
    <div class="bottom-box" v-if="hasFiber">
      <div class="fiber-btn" @click="changeToolItem(2)" :backgroundColor="uiBg">
        <img src="@/assets/img/arrow.png" :class="{ down: activedToolIndex !== 2 }" />
        <div class="btn__text">神经纤维</div>
      </div>
    </div>
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
  top: 1rem;
  left: 0.96rem;
}
.nucleus-manager {
  position: absolute;
  z-index: 10;
  top: 1rem;
  left: 0.24rem;
}
.filter-panel {
  position: absolute;
  z-index: 11;
  bottom: 1rem;
  left: 0.24rem;
}
.bottom-box {
  position: absolute;
  left: 0.24rem;
  bottom: 0.24rem;
  .fiber-btn {
    font-size: 0.16rem;
    height: 0.52rem;
    padding: 0.2rem;
    border-radius: 0.04rem;
    color: rgba(113, 176, 184, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(51, 61, 80, 1);
    border: 0.01rem solid rgba(113, 176, 184, 1);
    cursor: pointer;
    user-select: none;
    margin-right: 0.16rem;
    box-sizing: border-box;
    img {
      width: 0.18rem;
      margin-right: 0.12rem;
      &.down {
        transform: rotateX(180deg) !important;
      }
    }
  }
}
.tool-box {
  position: absolute;
  z-index: 10;
  top: 0.24rem;
  left: 0.24rem;
  display: flex;
  align-items: center;
  .tool-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(51, 61, 80, 1);
    padding: 0.12rem;
    border-radius: 0.08rem;
    cursor: pointer;
    margin-right: 0.12rem;
    img {
      width: 0.36rem;
      height: 0.36rem;
    }
  }
}
.slider-bar {
  position: absolute;
  right: 0;
  height: 10rem;
}
</style>
