/**
 * *辅视图的大脑模型与主视图同步旋转
 */
import useSceneStoreHook from '@/store/useSceneStore'
const sceneStore = useSceneStoreHook()

const changeHeadSide = (mainSceneManager, assistSceneManager) => {
  const mainCamera = mainSceneManager.camera
  const assistCamera = assistSceneManager.camera
  const assistScreenDistance = assistSceneManager.config.screenDistance
  const rotation = mainCamera.rotation
  const position = mainCamera.position
  const positionNormal = position.clone().normalize().multiplyScalar(assistScreenDistance)
  assistCamera.rotation.z = rotation.z
  assistCamera.rotation.y = rotation.y
  assistCamera.rotation.x = rotation.x
  // !这里的同步存在小问题:主视图相机移动时，辅助视图相机也会移动，导致逃出俯视图UI框
  assistCamera.position.z = positionNormal.z
  assistCamera.position.y = positionNormal.y
  assistCamera.position.x = positionNormal.x
}

/** 同步主视图和辅视图的旋转 */
export const brainSyncRotate = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const assistSceneManager = sceneStore.assistSceneManager
  mainSceneManager.controls.addEventListener('change', () => {
    changeHeadSide(mainSceneManager, assistSceneManager)
  })
}
