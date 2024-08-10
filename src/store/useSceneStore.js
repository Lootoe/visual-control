import { defineStore } from 'pinia'
import { store } from '@/store'

const useSceneStore = defineStore('sceneStore', () => {
  let mainSceneManager = {}
  let assistSceneManager = {}
  let extraData = {}

  const cacheMainSceneObject = (key, obj) => {
    mainSceneManager[key] = obj
  }

  const cacheAssistSceneObject = (key, obj) => {
    assistSceneManager[key] = obj
  }

  const cacheExtraData = (key, obj) => {
    extraData[key] = obj
  }

  const getSceneExtra = () => extraData

  const getAssistSceneObject = () => assistSceneManager

  const getMainSceneManager = () => mainSceneManager

  return {
    cacheMainSceneObject,
    mainSceneManager,
    cacheExtraData,
    getSceneExtra,
    getMainSceneManager,
    cacheAssistSceneObject,
    getAssistSceneObject,
  }
})

export const useSceneStoreHook = () => {
  return useSceneStore(store)
}
