import { defineStore } from 'pinia'
import { store } from '@/store'

const useLoadingStore = defineStore('loadingStore', () => {
  let opacity = ref(1)
  let loading = ref(true)
  let loadingText = ref('加载中')

  const setLoadingProps = (key, value) => {
    if (key === 'loading') {
      loading.value = value
    } else if (key === 'loadingText') {
      loadingText.value = value
    } else if (key === 'opacity') {
      opacity.value = value
    }
  }

  const getLoadingProps = () => {
    return reactive({
      loading: loading,
      loadingText: loadingText,
      opacity: opacity,
    })
  }

  return { setLoadingProps, getLoadingProps }
})

export const useLoadingStoreHook = () => {
  return useLoadingStore(store)
}
