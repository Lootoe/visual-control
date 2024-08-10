import { defineStore } from 'pinia'
import { store } from '@/store'

const useAddonStore = defineStore('addonStore', () => {
  let addons = {}

  const cacheAddons = (key, obj) => {
    addons[key] = obj
  }

  const getAddons = () => addons

  return { cacheAddons, getAddons }
})

export const useAddonStoreHook = () => {
  return useAddonStore(store)
}
