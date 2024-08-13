/**
 * *刚进入可视化程控时，摄像机与皮层之间需要有一定的倾斜角度
 */
import * as THREE from 'three'
import { useSceneStoreHook } from '@/store/useSceneStore'
const sceneStore = useSceneStoreHook()

export const adjustCameraPosition = () => {
  const matrixWorld = new THREE.Matrix4()
  // 以下矩阵从 syncSceneRotate 该方法调试获得
  matrixWorld.set(
    0.9589133111409693,
    1.3877787807814457e-17,
    -0.2836992451816932,
    0,
    -0.10014702543669239,
    0.9356217365525198,
    -0.33850042745413145,
    0,
    0.26543518043553493,
    0.3530042012362561,
    0.8971801373730405,
    0,
    30.407676281394092,
    40.43939262139782,
    102.77900291352582,
    1
  )
  const invertMatrixWorld = matrixWorld.invert()
  const camera = sceneStore.mainSceneManager.camera
  camera.applyMatrix4(invertMatrixWorld)
  camera.position.set(33.69271610126761, 44.80819127024677, 113.88255170473744)
}
