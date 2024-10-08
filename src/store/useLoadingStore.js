import { defineStore } from 'pinia'
import { store } from '@/store'
import { ref } from 'vue'

const useLoadingStore = defineStore('loadingStore', () => {
  let opacity = ref(1)
  let loading = ref(true)
  let loadingText = ref('加载中')
  let loadingFail = ref(false)
  let failReason = ref('加载失败')

  return { opacity, loading, loadingText, loadingFail, failReason }
})

export default () => {
  return useLoadingStore(store)
}
