import { defineStore } from 'pinia'
import { store } from '@/store'

const useFiberStore = defineStore('fiberStore', () => {
  let fiberList = shallowRef([])
  // 缓存当前的正在显示的模型
  let displayingFiberList = shallowRef([])

  return { fiberList, displayingFiberList }
})

export const useFiberStoreHook = () => {
  return useFiberStore(store)
}
