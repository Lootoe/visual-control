import { defineStore } from 'pinia'
import { store } from '@/store'

const useLeadStore = defineStore('leadStore', () => {
  let leadList = shallowRef([])

  return { leadList }
})

export default () => {
  return useLeadStore(store)
}
