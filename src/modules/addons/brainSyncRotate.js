/**
 * *辅视图的大脑模型与主视图同步旋转
 */
import useSceneStoreHook from '@/store/useSceneStore'
import * as THREE from 'three'
import useAddonStoreHook from '@/store/useAddonStore'

const addonStore = useAddonStoreHook()

const sceneStore = useSceneStoreHook()

const changeHeadSide = (mainSceneManager) => {
  // 初始化变量
  const mainCamera = mainSceneManager.camera
  const assistBrain = addonStore.addons.brain.mesh

  // 计算相机在第一个场景中的方位角和仰角
  const relativePosition = new THREE.Vector3()
  const centerPos = new THREE.Vector3(0, 0, 0)
  relativePosition.subVectors(mainCamera.position, centerPos).normalize()

  // 计算俯仰角（仰角），相机相对于模型的Y轴角度
  let phi = Math.atan2(
    relativePosition.y,
    Math.sqrt(relativePosition.x * relativePosition.x + relativePosition.z * relativePosition.z)
  )

  // 计算方位角，相机相对于模型在XZ平面的角度
  let theta = Math.atan2(relativePosition.x, relativePosition.z)
  console.log('theta', theta)
  // 将俯仰角和方位角应用到模型的旋转
  assistBrain.rotation.set(phi, -theta, 0)
}

/** 同步主视图和辅视图的旋转 */
export const brainSyncRotate = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const assistSceneManager = sceneStore.assistSceneManager
  mainSceneManager.controls.addEventListener('change', () => {
    changeHeadSide(mainSceneManager, assistSceneManager)
  })
}
