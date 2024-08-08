import { defineStore } from 'pinia'
import { store } from '@/store'

const useSceneStore = defineStore('sceneStore', () => {
  let mainSceneManager = {}

  const cacheMainSceneObject = (key, obj) => {
    mainSceneManager[key] = obj
  }

  return { cacheMainSceneObject, mainSceneManager }
})

export const useSceneStoreHook = () => {
  return useSceneStore(store)
}
