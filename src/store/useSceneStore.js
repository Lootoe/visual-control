import { defineStore } from 'pinia'
import { store } from '@/store'

const useSceneStore = defineStore('sceneStore', () => {
  let mainSceneManager = shallowRef({})
  let assistSceneManager = shallowRef({})
  let extraData = shallowRef({})

  return {
    mainSceneManager,
    assistSceneManager,
    extraData,
  }
})

export const useSceneStoreHook = () => {
  return useSceneStore(store)
}

// sceneStore
