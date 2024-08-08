import { defineStore } from 'pinia'
import { store } from '@/store'

const useSceneStore = defineStore('sceneStore', () => {
  let mainSceneManager = {}
  let extraData = {}

  const cacheMainSceneObject = (key, obj) => {
    mainSceneManager[key] = obj
  }

  const cacheExtraData = (key, obj) => {
    extraData[key] = obj
  }

  const getSceneExtra = () => extraData

  const getMainSceneManager = () => mainSceneManager

  return {
    cacheMainSceneObject,
    mainSceneManager,
    cacheExtraData,
    getSceneExtra,
    getMainSceneManager,
  }
})

export const useSceneStoreHook = () => {
  return useSceneStore(store)
}
