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

  // 计算相机相对于物体A的旋转
  const cameraQuaternion = new THREE.Quaternion()
  mainCamera.getWorldQuaternion(cameraQuaternion) // 获取相机的世界旋转四元数

  // 反转相机的四元数，以计算物体A应该面向的方向
  const inverseCameraQuaternion = cameraQuaternion.clone().invert()

  assistBrain.setRotationFromQuaternion(inverseCameraQuaternion)
}

/** 同步主视图和辅视图的旋转 */
export const brainSyncRotate = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const assistSceneManager = sceneStore.assistSceneManager
  mainSceneManager.controls.addEventListener('change', () => {
    changeHeadSide(mainSceneManager, assistSceneManager)
  })
}
