<script setup>
const ui_bg = 'import.meta.env.VITE_UI_BG'
const activedToolIndex = ref(-1)
const changeToolItem = (toolIndex) => {
  if (toolIndex === activedToolIndex.value) {
    activedToolIndex.value = -1
  } else {
    activedToolIndex.value = toolIndex
  }
}
</script>

<template>
  <div class="page-wrapper">
    <three-scene></three-scene>
    <change-scene-side :backgroundColor="ui_bg"></change-scene-side>
    <nucleus-panel v-show="activedToolIndex === 0" :backgroundColor="ui_bg"></nucleus-panel>
    <visible-panel v-show="activedToolIndex === 1" :backgroundColor="ui_bg"></visible-panel>
    <div class="tool-box">
      <div
        class="tool-item"
        @click="changeToolItem(0)"
        :style="{ backgroundColor: activedToolIndex === 0 ? 'rgba(122, 192, 199, 1)' : ui_bg }"
      >
        <img src="@/assets/img/palette.png" alt="" />
      </div>
      <div
        class="tool-item"
        @click="changeToolItem(1)"
        :style="{ backgroundColor: activedToolIndex === 1 ? 'rgba(122, 192, 199, 1)' : ui_bg }"
      >
        <img src="@/assets/img/layers.png" alt="" />
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
</style>
