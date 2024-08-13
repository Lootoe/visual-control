<script setup>
defineOptions({
  name: 'nucleus-panel',
})
defineProps({
  backgroundColor: {
    type: String,
    default: 'rgba(51, 61, 80, 1)',
  },
})

import { useNucleusStoreHook } from '@/store/useNucleusStore'
import { nucleusSideEnum } from '@/enum/nucleusEnum'
import { changeNucleusVisible, changeNucleusColor } from '@/modules/nucleus'

const nucleusStore = useNucleusStoreHook()
const localNucleusList = ref([])

watch(
  () => nucleusStore.nucleusList,
  (newval) => {
    const table = {}
    newval.forEach((item) => {
      const { color, en, zh, nucleusSide } = item
      const zhName = zh.replace('左侧', '').replace('右侧', '')
      const enName = en.replace('Left ', '').replace('Right ', '')
      let target = table[enName]
      if (!target) {
        const obj = {
          color,
          nucleusSide,
          zhName,
          enName,
          visible: {},
        }
        obj.visible[nucleusSide] = item.visible
        table[enName] = obj
      } else {
        target.visible[nucleusSide] = item.visible
      }
    })
    localNucleusList.value = Object.values(table)
    console.log('【NucleusManager】', localNucleusList.value)
  },
  { immediate: true }
)

const selectedIndex = ref(-1)
const updateSelect = (index, isSelect) => {
  selectedIndex.value = isSelect ? index : -1
}

const getName = (en, side) => {
  let name = ''
  if (side === nucleusSideEnum.LEFT) {
    name = 'Left ' + en
  }
  if (side === nucleusSideEnum.RIGHT) {
    name = 'Right ' + en
  }
  if (side === nucleusSideEnum.MIDDLE) {
    name = en
  }
  return name
}

const changeNucleusVisibleFn = (item, side) => {
  item.visible[side] = !item.visible[side]
  const { enName, nucleusSide } = item
  let name = getName(enName, nucleusSide)
  changeNucleusVisible(name, item.visible[side])
}

const changeNucleusColorFn = (item, color) => {
  item.color = color
  const { enName, nucleusSide } = item
  let name = getName(enName, nucleusSide)
  changeNucleusColor(name, color)
}

const colorPickers = ref([])
const onListScroll = () => {
  // 滚动时隐藏颜色拾取器
  colorPickers.value.forEach((c) => {
    c.hide()
  })
}

const isMiddle = (item) => {
  // eslint-disable-next-line no-prototype-builtins
  return item.visible.hasOwnProperty('MIDDLE')
}
</script>

<template>
  <div class="nucleus-manager" :style="{ backgroundColor: backgroundColor }">
    <div class="top" :style="{ backgroundColor: backgroundColor }">
      <div class="top-left">名称</div>
      <div class="top-center"></div>
      <div class="top-right">
        <div style="margin-right: 0.2rem">左</div>
        <div>右</div>
      </div>
    </div>
    <div class="main" @scroll="onListScroll">
      <div
        class="item"
        v-for="(item, index) in localNucleusList"
        :key="index"
        :style="{
          backgroundColor: selectedIndex === index ? 'rgba(122, 192, 199,0.4)' : 'transparent',
        }"
      >
        <div class="cell item-left">
          <div class="color-pickr-wrapper">
            <el-color-picker
              ref="colorPickers"
              v-model="item.color"
              show-alpha
              color-format="rgb"
              @blur="updateSelect(index, false)"
              @focus="updateSelect(index, true)"
              @active-change="changeNucleusColorFn(item, $event)"
            />
          </div>
        </div>
        <div class="cell item-center">{{ item.zhName }}（{{ item.enName }}）</div>
        <div class="cell item-right">
          <template v-if="!isMiddle(item)">
            <div
              style="margin-right: 0.2rem"
              @click="changeNucleusVisibleFn(item, nucleusSideEnum.LEFT)"
            >
              <img v-if="item.visible.LEFT" src="@/assets/img/eye_open.png" />
              <img v-else src="@/assets/img/eye_close.png" />
            </div>
            <div @click="changeNucleusVisibleFn(item, nucleusSideEnum.RIGHT)">
              <img v-if="item.visible.RIGHT" src="@/assets/img/eye_open.png" />
              <img v-else src="@/assets/img/eye_close.png" />
            </div>
          </template>
          <template v-else>
            <div @click="changeNucleusVisibleFn(item, nucleusSideEnum.MIDDLE)">
              <img v-if="item.visible.MIDDLE" src="@/assets/img/eye_open.png" />
              <img v-else src="@/assets/img/eye_close.png" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.nucleus-manager {
  box-sizing: border-box;
  font-size: 0.16rem;
  color: rgba(255, 255, 255, 0.85);
  user-select: none;
  border-radius: 0.06rem;
  overflow: hidden;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;
    font-size: 0.2rem;
    .top-left {
      width: 0.6rem;
      display: flex;
      align-items: center;
    }
    .top-right {
      width: 0.8rem;
      display: flex;
      justify-content: flex-end;
      //   background-color: #fff;
      // 消除滚动条宽度的影像
      margin-right: 0.04rem;
      div {
        width: 0.28rem;
        height: 0.28rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .main {
    max-height: 3.48rem;
    overflow: hidden;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0.04rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(103, 110, 125, 1);
      border-radius: 1rem;
    }
  }
  .item {
    display: grid;
    grid-template-columns: 0.1fr 2.8fr 0.4fr;
    align-items: center;
    padding: 0.12rem 0.2rem;
    border-top: 0.01rem solid #313746;
  }
  .item-left {
    margin-right: 0.2rem;
    .color-pickr-wrapper {
      width: 0.24rem;
      height: 0.24rem;
      border-radius: 0.04rem;
      overflow: hidden;
    }
  }
  .item-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 0.8rem;
    // background-color: #fff;
    img {
      width: 0.28rem;
      height: 0.28rem;
      cursor: pointer;
    }
  }
}
</style>
