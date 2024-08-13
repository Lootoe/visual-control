import { defineStore } from 'pinia'
import { store } from '@/store'

const useFilterStore = defineStore('filterStore', () => {
  let chipFilter = shallowRef([])
  let nucleusFilter = shallowRef([])

  return { chipFilter, nucleusFilter }
})

export const useFilterStoreHook = () => {
  return useFilterStore(store)
}
