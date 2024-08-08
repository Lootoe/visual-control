import { initMainScene } from './mainScene'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { cleanScene } from './cleanScene'
import { createLight } from './light'

const { mainSceneManager } = useSceneStoreHook()

export const initScene = ({ selector, config }) => {
  return new Promise((resolve) => {
    window.onload = () => {
      initMainScene(selector, config)
      const lights = createLight(6, 500)
      addMeshes(lights)
      resolve()
    }
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
