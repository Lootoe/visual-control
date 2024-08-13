<script setup>
defineOptions({
  name: 'filber-panel',
})

defineProps({
  backgroundColor: {
    type: String,
    default: 'rgba(51, 61, 80, 1)',
  },
})

import { useLoadingStoreHook } from '@/store/useLoadingStore'
import { useFilterStoreHook } from '@/store/useFilterStore'
import { useFiberStoreHook } from '@/store/useFiberStore'
import {
  clearFibers,
  renderTracedFiber,
  compileTracingContext,
  tracingFiber,
} from '@/modules/filter'

const { getChipFilter, getNucleusFilter } = useFilterStoreHook()
const fiberStore = useFiberStoreHook()
const { setLoadingProps } = useLoadingStoreHook()

const localNucleusFilter = ref([])
const localChipFilter = ref([])
const filters = []

watch(
  () => getNucleusFilter().value,
  (newval) => {
    localNucleusFilter.value = newval.map((v) => {
      return {
        selected: false,
        ...v,
      }
    })
    filters.push(...localNucleusFilter.value)
  },
  { immediate: true }
)

watch(
  () => getChipFilter().value,
  (newval) => {
    localChipFilter.value = newval.map((v) => {
      return {
        selected: false,
        ...v,
      }
    })
    filters.push(...localChipFilter.value)
  },
  { immediate: true }
)

// 是否单一选中项
const isSingle = ref(true)
// 是否有选中项
const hasSeleced = ref(false)
// 是否展示重置按钮
const showReset = ref(false)
let firstTime = true

const selectItem = (item) => {
  item.selected = !item.selected
  // 判断有没有选中项
  const selectedArr_1 = localNucleusFilter.value.filter((v) => v.selected)
  const selectedArr_2 = localChipFilter.value.filter((v) => v.selected)
  const selectedNum = selectedArr_1.length + selectedArr_2.length
  hasSeleced.value = selectedNum > 0
  isSingle.value = selectedNum <= 1
}

const reselect = () => {
  localNucleusFilter.value.forEach((v) => {
    v.selected = false
  })
  localChipFilter.value.forEach((v) => {
    v.selected = false
  })
  isSingle.value = true
  hasSeleced.value = false
}

const tracing = (type) => {
  setLoadingProps('loading', true)
  if (firstTime) {
    setLoadingProps('loadingText', '第一次追踪神经纤维时间较久，请耐心等待')
  } else {
    setLoadingProps('loadingText', '正在追踪神经纤维')
  }
  // settimeout是防止运算导致cpu卡住，结果setLoadingProps无法执行完毕
  // 间接导致设置的文字无效
  setTimeout(() => {
    // 判断是不是第一次分析，如果是第一次分析就需要先追踪神经纤维
    if (firstTime) {
      tracingFiber()
      firstTime = false
    }
    clearFibers()
    // 从列表里筛选出已选中的item
    const arr_1 = localChipFilter.value.filter((v) => v.selected).map((v) => v.factor)
    const arr_2 = localNucleusFilter.value.filter((v) => v.selected).map((v) => v.factor)
    const arr = [...arr_1, ...arr_2]
    let source = ''
    if (type === 'confirm') {
      source = arr[0] || ''
    }
    if (type === 'cross') {
      source = arr.join('&')
    }
    if (type === 'append') {
      source = arr.join('|')
    }
    if (source === '') return
    showReset.value = true
    const fiberList = fiberStore.fiberList
    const indexes = compileTracingContext(source, filters, fiberList)
    // 给数组去重，防止重复添加
    const fiberSet = new Set(indexes)
    const showLen = fiberSet.size
    const totalLen = fiberList.length
    console.log('显示的神经纤维数量', showLen)
    console.log('神经纤维总数', totalLen)
    renderTracedFiber(indexes)
    setLoadingProps('loadingText', '追踪成功')
    setLoadingProps('loading', false)
  }, 200)
}

const reset = () => {
  showReset.value = false
  reselect()
  clearFibers()
}

const selectAll = () => {
  localNucleusFilter.value.forEach((v) => {
    v.selected = true
  })
  localChipFilter.value.forEach((v) => {
    v.selected = true
  })
  hasSeleced.value = true
  isSingle.value = false
}
</script>

<template>
  <div class="filter-panel">
    <div class="content-box" :style="{ backgroundColor: backgroundColor }">
      <div class="top">
        <div class="top__inner">
          <div class="section">
            <div class="section__title">触点</div>
            <div class="section__list">
              <div
                class="section__item"
                v-for="(item, index) in localChipFilter"
                :key="index"
                :class="{ active: item.selected }"
                @click="selectItem(item)"
              >
                {{ item.displayName }}
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section__title">脑区</div>
            <div class="section__list">
              <div
                class="section__item"
                v-for="(item, index) in localNucleusFilter"
                :key="index"
                :class="{ active: item.selected }"
                @click="selectItem(item)"
              >
                {{ item.displayName }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom" :class="{ active: hasSeleced }">
        <div class="bottom__left">
          <div class="btn" @click="selectAll">全选</div>
          <div class="btn" @click="reselect">重选</div>
        </div>
        <div class="bottom__right">
          <template v-if="isSingle">
            <div class="btn" @click="tracing('confirm')">确定</div>
          </template>
          <template v-else>
            <div class="btn" @click="tracing('cross')">交集</div>
            <div class="btn" @click="tracing('append')">并集</div>
          </template>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <div class="btn-reset" @click="reset" v-show="showReset">
        <img src="@/assets/img/reset.png" />
        <div class="btn__text">重置</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-panel {
  font-size: 0.16rem;
  position: relative;
  .content-box {
    background-color: rgba(51, 61, 80, 1);
    border: 0.01rem solid rgb(147, 153, 165);
    border-radius: 0.08rem;
    box-sizing: border-box;
    user-select: none;
    .top {
      padding: 0.12rem;
      padding-right: 0.02rem;
      .top__inner {
        overflow-y: scroll;
        padding-right: 0.08rem;
        max-height: 3.86rem;
        &::-webkit-scrollbar {
          width: 0.04rem;
        }

        &::-webkit-scrollbar-thumb {
          background-color: rgba(103, 110, 125, 1);
          border-radius: 1rem;
        }
      }

      .section {
        margin-top: 0.16rem;
        margin-bottom: 0.24rem;
        .section__title {
          color: rgba(164, 180, 213, 1);
          margin-bottom: 0.12rem;
          font-size: 0.2rem;
        }
        .section__list {
          display: grid;
          grid-template-columns: repeat(2, minmax(2rem, 1fr));
          gap: 0.1rem;
          .section__item {
            font-size: 0.14rem;
            padding: 0.2rem 0.14rem;
            cursor: pointer;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: rgba(255, 255, 255, 1);
            border: 0.01rem dashed rgba(103, 110, 125, 1);
            border-radius: 0.04rem;
            transition: all 0.1s;
            &.active {
              border: 0.01rem solid rgba(122, 192, 199, 1);
              background-color: rgba(122, 192, 199, 0.3);
            }
          }
        }
      }
    }
    .bottom {
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.12rem;
      border-top: 0.01rem solid rgba(103, 110, 125, 1);
      .bottom__left {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
          width: 50%;
          padding: 0.14rem 0;
          cursor: pointer;
          border: 0.01rem solid rgba(103, 110, 125, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.04rem;
          margin-right: 0.08rem;
        }
      }
      .bottom__right {
        flex: 1;
        display: flex;
        justify-content: space-between;
        .btn {
          padding: 0.14rem 0;
          cursor: pointer;
          width: 100%;
          background-color: rgba(122, 192, 199, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.04rem;
          margin: 0 0.04rem;
        }
      }
      &.active {
        color: #fff;
        .bottom__right {
          .btn {
            background-color: rgba(122, 192, 199, 1);
            border: none;
          }
        }
      }
    }
  }
  .btn-box {
    width: fit-content;
    display: flex;
    align-items: center;
    .btn-reset {
      width: 1.24rem;
      height: 0.52rem;
      padding: 0.2rem;
      border-radius: 0.04rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(122, 192, 199, 1);
      cursor: pointer;
      user-select: none;
      position: absolute;
      bottom: -0.76rem;
      right: 36%;
      img {
        width: 0.26rem;
        margin-right: 0.03rem;
      }
    }
  }
}
</style>
