import { defineStore } from 'pinia'
import { store } from '@/store'

const useVtaStore = defineStore('vtaStore', () => {
  let vtaTable = {}

  return { vtaTable }
})

export default () => {
  return useVtaStore(store)
}
