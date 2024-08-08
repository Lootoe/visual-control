import { defineStore } from 'pinia'
import { store } from '@/store'

const useLeadStore = defineStore('leadStore', () => {
  // 由于Vue组件会用到核团相关数据，所以需要用ref包裹
  let leadList = shallowRef([])

  const cacheLeadList = (data) => {
    leadList.value = data
  }

  const getLeadList = () => leadList

  return { cacheLeadList, getLeadList }
})

export const useLeadStoreHook = () => {
  return useLeadStore(store)
}
