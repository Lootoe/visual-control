import { defineStore } from 'pinia'
import { store } from '@/store'

const useVtaStore = defineStore('vtaStore', () => {
  // 用ShallowRef是不希望模型Mesh也被代理，从而导致无法从场景里删除
  let vtaTable = shallowRef({})

  return { vtaTable }
})

export default () => {
  return useVtaStore(store)
}
