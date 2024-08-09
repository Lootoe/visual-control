import { defineStore } from 'pinia'
import { store } from '@/store'

const useLeadStore = defineStore('leadStore', () => {
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
