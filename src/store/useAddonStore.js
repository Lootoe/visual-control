import { defineStore } from 'pinia'
import { store } from '@/store'

const useAddonStore = defineStore('addonStore', () => {
  let addons = reactive({})

  return { addons }
})

export const useAddonStoreHook = () => {
  return useAddonStore(store)
}
