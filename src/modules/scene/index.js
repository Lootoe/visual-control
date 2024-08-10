import { initMainScene } from './mainScene'
import { initAssistScene } from './assistScene'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { cleanScene } from './cleanScene'
import { createLight } from './light'

const { mainSceneManager, assistSceneManager } = useSceneStoreHook()

export const initScene = (params) => {
  const { mainSceneSelector, mainSceneConfig, assistSceneSelector, assistSceneConfig } = params
  return new Promise((resolve) => {
    initMainScene(mainSceneSelector, mainSceneConfig)
    initAssistScene(assistSceneSelector, assistSceneConfig)
    const lights = createLight(6, 500)
    addMeshes(lights)
    resolve()
  })
}

// 清除主视图和辅视图
export const destoryScene = () => {
  const renderer = mainSceneManager.renderer
  const scene = mainSceneManager.scene
  cleanScene(renderer, scene)
}

export const addMesh = (mesh) => {
  mainSceneManager.scene.add(mesh)
}

export const removeMesh = (mesh) => {
  mainSceneManager.scene.remove(mesh)
}

export const addMeshes = (meshes) => {
  meshes.forEach((mesh) => mainSceneManager.scene.add(mesh))
}

export const removeMeshes = (meshes) => {
  meshes.forEach((mesh) => mainSceneManager.scene.remove(mesh))
}

const addMeshInAssist = (mesh) => {
  assistSceneManager.scene.add(mesh)
}
