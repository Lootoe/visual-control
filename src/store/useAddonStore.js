import { defineStore } from 'pinia'
import { store } from '@/store'

const useAddonStore = defineStore('addonStore', () => {
  let addons = ref({})

  return { addons }
})

export default () => {
  return useAddonStore(store)
}
