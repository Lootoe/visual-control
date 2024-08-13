import { defineStore } from 'pinia'
import { store } from '@/store'

const useLeadStore = defineStore('leadStore', () => {
  let leadList = shallowRef([])

  return { leadList }
})

export const useLeadStoreHook = () => {
  return useLeadStore(store)
}
