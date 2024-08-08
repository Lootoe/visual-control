import { renderMainScene } from './mainScene'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { cleanScene } from './cleanScene'

const { mainSceneManager } = useSceneStoreHook()

export const renderScene = ({ selector, config }) => {
  return new Promise((resolve) => {
    window.onload = () => {
      renderMainScene(selector, config)
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
