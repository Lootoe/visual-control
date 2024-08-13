import { initMainScene } from './mainScene'
import { initAssistScene } from './assistScene'
import useSceneStoreHook from '@/store/useSceneStore'
import { cleanScene } from './cleanScene'
import { createLight } from './light'

const sceneStore = useSceneStoreHook()

// 在场景初始化完成时，需要adjustCameraPosition到一个倾斜角度
export const __initScene = (params) => {
  const { mainSceneSelector, mainSceneConfig, assistSceneSelector, assistSceneConfig } = params
  return new Promise((resolve) => {
    initMainScene(mainSceneSelector, mainSceneConfig)
    initAssistScene(assistSceneSelector, assistSceneConfig)
    const lights = createLight(6, 500)
    addMeshes(lights)
    resolve()
  })
}

export const destoryScene = () => {
  destoryMainScene()
  destoryAssistScene()
}

export const destoryMainScene = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const renderer = mainSceneManager.renderer
  const scene = mainSceneManager.scene
  cleanScene(renderer, scene)
}

export const destoryAssistScene = () => {
  const assistSceneManager = sceneStore.assistSceneManager
  const renderer = assistSceneManager.renderer
  const scene = assistSceneManager.scene
  cleanScene(renderer, scene)
}

export const addMesh = (mesh) => {
  const mainSceneManager = sceneStore.mainSceneManager
  mainSceneManager.scene.add(mesh)
}

export const removeMesh = (mesh) => {
  const mainSceneManager = sceneStore.mainSceneManager
  mainSceneManager.scene.remove(mesh)
}

export const addMeshes = (meshes) => {
  const mainSceneManager = sceneStore.mainSceneManager
  meshes.forEach((mesh) => mainSceneManager.scene.add(mesh))
}

export const removeMeshes = (meshes) => {
  const mainSceneManager = sceneStore.mainSceneManager
  meshes.forEach((mesh) => mainSceneManager.scene.remove(mesh))
}

export const addMeshInAssist = (mesh) => {
  const assistSceneManager = sceneStore.assistSceneManager
  assistSceneManager.scene.add(mesh)
}
