import { defineStore } from 'pinia'
import { store } from '@/store'

const useNucleusStore = defineStore('nucleusStore', () => {
  // 由于Vue组件会用到核团相关数据，所以需要用ref包裹
  let nucleusList = shallowRef([])

  return { nucleusList }
})

export default () => {
  return useNucleusStore(store)
}
