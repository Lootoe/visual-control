import { defineStore } from 'pinia'
import { store } from '@/store'

const useFiberStore = defineStore('fiberStore', () => {
  // 由于Vue组件会用到核团相关数据，所以需要用ref包裹
  let fiberList = []
  // 缓存当前的正在显示的模型
  let displayFiber = []

  const cacheFiberList = (data) => {
    fiberList = data
  }

  const cacheDisplayFiberList = (fiberMeshes) => {
    displayFiber = fiberMeshes
  }

  const getFiberList = () => fiberList

  const getDisplayFiberList = () => displayFiber

  return { cacheFiberList, cacheDisplayFiberList, getFiberList, getDisplayFiberList }
})

export const useFiberStoreHook = () => {
  return useFiberStore(store)
}
