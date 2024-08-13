import { defineStore } from 'pinia'
import { store } from '@/store'

const useLoadingStore = defineStore('loadingStore', () => {
  let opacity = ref(1)
  let loading = ref(true)
  let loadingText = ref('加载中')

  return { opacity, loading, loadingText }
})

export const useLoadingStoreHook = () => {
  return useLoadingStore(store)
}
