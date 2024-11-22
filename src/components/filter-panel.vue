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

import useFilterStoreHook from '@/store/useFilterStore'
import useFiberStoreHook from '@/store/useFiberStore'
import useLoadingCoverHook from '@/components/LoadingCover/useLoadingCover'

import {
  clearFibers,
  renderTracedFiber,
  compileTracingContext,
  tracingFiber,
  renderAllFiber,
  renderRestFiber,
  renderWholeBrainFiber,
} from '@/modules/filter'

const { loadBegin, loadUpdate, loadEnd, delay } = useLoadingCoverHook()

// 显示所有神经纤维，而不是能追踪到的神经纤维
window.hack.sf = () => {
  loadBegin({
    content: '正在追踪神经纤维',
    delay: 500,
    opacity: 0.8,
  })
  setTimeout(() => {
    renderAllFiber()
    loadEnd()
    showReset.value = true
  }, 200)
}

// 显示不能追踪到的神经纤维
window.hack.rsf = () => {
  loadBegin({
    content: '正在追踪神经纤维',
    delay: 500,
    opacity: 0.8,
  })
  setTimeout(() => {
    renderRestFiber()
    loadEnd()
    showReset.value = true
  }, 200)
}

const filterStore = useFilterStoreHook()
const fiberStore = useFiberStoreHook()

const localNucleusFilter = ref([])
const localChipFilter = ref([])
const filters = []

watch(
  () => filterStore.nucleusFilter,
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
  () => filterStore.chipFilter,
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
  const selectedArr = filters.filter((v) => v.selected)
  const selectedNum = selectedArr.length
  hasSeleced.value = selectedNum > 0
  isSingle.value = selectedNum <= 1
  isWholeBrain.value = false
}

const reselect = () => {
  filters.forEach((v) => {
    v.selected = false
  })
  isSingle.value = true
  hasSeleced.value = false
  isWholeBrain.value = false
}

const tracing = async (type) => {
  clearFibers()
  if (!hasSeleced.value && !isWholeBrain.value) return
  if (isWholeBrain.value) {
    loadBegin({
      content: '追踪全脑神经纤维时间较久，请耐心等待',
      opacity: 0.8,
    })
    await delay(200)
    renderWholeBrainFiber().then(() => {
      loadEnd()
      showReset.value = true
      return
    })
  } else {
    if (firstTime) {
      loadBegin({
        content: '第一次追踪神经纤维时间较久，请耐心等待',
        opacity: 0.8,
      })
      await delay(200)
      await tracingFiber()
      firstTime = false
    } else {
      loadBegin({
        content: '正在追踪神经纤维',
        opacity: 0.8,
      })
      await delay(200)
    }
    // 从列表里筛选出已选中的item
    const arr = filters.filter((v) => v.selected).map((v) => v.factor)
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
    renderTracedFiber(indexes)
    loadUpdate({ content: '追踪成功' })
    loadEnd()
  }
}

const reset = () => {
  showReset.value = false
  reselect()
  clearFibers()
  isWholeBrain.value = false
}

const selectAll = () => {
  filters.forEach((v) => {
    v.selected = true
  })
  hasSeleced.value = true
  isSingle.value = false
  isWholeBrain.value = false
}

const isWholeBrain = ref(false)

const selectWholeBrain = () => {
  localNucleusFilter.value.forEach((v) => {
    v.selected = false
  })
  localChipFilter.value.forEach((v) => {
    v.selected = false
  })
  isWholeBrain.value = !isWholeBrain.value
  hasSeleced.value = false
  isSingle.value = true
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
          <div class="btn" @click="selectWholeBrain" :class="{ active: isWholeBrain }">全脑</div>
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
        width: 60%;
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
          &.active {
            color: #fff;
            border: 0.01rem solid #fff;
          }
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
      left: 34%;
      img {
        width: 0.26rem;
        margin-right: 0.03rem;
      }
    }
  }
}
</style>
