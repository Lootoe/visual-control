<script setup>
defineOptions({
  name: 'visible-panel',
})

defineProps({
  backgroundColor: {
    type: String,
    default: 'rgba(51, 61, 80, 1)',
  },
})

import { loadImg } from '@/utils/tools.js'
import { changeVisible } from '@/business/manageVisible.js'

const controlList = ref([
  {
    name: 'cortex',
    icon: loadImg('brain.png'),
    visible: true,
    text: '大脑皮层',
  },
  {
    name: 'lead',
    icon: loadImg('lead.png'),
    visible: true,
    text: '电极',
  },
  {
    name: 'axesHelper',
    icon: loadImg('axes.png'),
    visible: true,
    text: '辅助坐标轴',
  },
])

const changeVisibleFn = (item) => {
  item.visible = !item.visible
  changeVisible(item.name, item.visible)
}
</script>

// !TODO:需要区分环境来判断使用什么颜色
<template>
  <div class="visible-manager" :style="{ backgroundColor: backgroundColor }">
    <div class="top">
      <div class="top__left">名称</div>
      <div class="top__right">
        <div class="label"></div>
      </div>
    </div>
    <div class="main">
      <div class="item" v-for="(item, index) in controlList" :key="index">
        <div class="item__left">
          <img :src="item.icon" class="item-icon" />
          <div class="item-text">{{ item.text }}</div>
        </div>
        <div class="item__right">
          <div class="right__visible" @click="changeVisibleFn(item)">
            <img v-if="item.visible" src="@/assets/img/eye_open.png" class="item-eye" />
            <img v-else src="@/assets/img/eye_close.png" class="item-eye" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.visible-manager {
  font-size: 0.14rem;
  color: rgba(255, 255, 255, 0.85);
  user-select: none;
  border-radius: 0.06rem;
  .item-eye {
    cursor: pointer;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.2rem;
    &__right {
      display: flex;
      align-items: center;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .main {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.08rem 0.2rem;
      border-top: 0.01rem solid rgba(49, 55, 70, 1);
      &__left {
        display: flex;
        justify-content: center;
        align-items: center;
        .item-icon {
          width: 0.28rem;
          height: 0.28rem;
          margin-right: 0.12rem;
        }
      }
      &__right {
        display: flex;
        align-items: center;
        margin-left: 0.6rem;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 0.24rem;
            height: 0.24rem;
          }
        }
      }
    }
  }
}
</style>
