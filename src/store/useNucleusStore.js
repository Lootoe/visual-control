import { defineStore } from 'pinia'
import { store } from '@/store'

const useNucleusStore = defineStore('nucleusStore', () => {
  // 由于Vue组件会用到核团相关数据，所以需要用ref包裹
  let nucleusList = shallowRef([])

  const cacheNucleusList = (data) => {
    nucleusList.value = data
  }

  const getNucleusList = () => nucleusList

  return { cacheNucleusList, getNucleusList }
})

export const useNucleusStoreHook = () => {
  return useNucleusStore(store)
}
