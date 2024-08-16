/**
 * *刚进入可视化程控时，摄像机与皮层之间需要有一定的倾斜角度
 */
import useSceneStoreHook from '@/store/useSceneStore'
const sceneStore = useSceneStoreHook()

export const adjustCameraPosition = () => {
  const camera = sceneStore.mainSceneManager.camera
  camera.position.set(130.00458451436987, 94.60649005828151, 71.58505461406277)
  camera.rotation.set(-0.9230457012764062, 0.8310838654129342, 0.7733620667552826)
}
