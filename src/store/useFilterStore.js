import { defineStore } from 'pinia'
import { store } from '@/store'

const useFilterStore = defineStore('filterStore', () => {
  let chipFilter = shallowRef([])
  let nucleusFilter = shallowRef([])

  const cacheChipFilter = (data) => {
    chipFilter.value = data
  }
  const cacheNucleusFilter = (data) => {
    nucleusFilter.value = data
  }

  const getChipFilter = () => chipFilter
  const getNucleusFilter = () => nucleusFilter

  return { cacheChipFilter, cacheNucleusFilter, getChipFilter, getNucleusFilter }
})

export const useFilterStoreHook = () => {
  return useFilterStore(store)
}
