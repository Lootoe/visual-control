/**
 * *随意切换摄像机相对皮层的位置
 * ?正、背、左、右、上、下
 * ?辅视图相机也要相应旋转（由于brainSyncRotate，这里不用再实现）
 * ?在功能在changeSide组件里使用
 * ?下面vector的数值不统一，是因为皮层形状诡异，我们需要让相机时刻在皮层外围
 */

import { loadImg } from '@/utils/tools'
import useSceneStoreHook from '@/store/useSceneStore'
const sceneStore = useSceneStoreHook()

export const SCENE_FACES = [
  {
    name: '正面',
    icon: loadImg('front.png'),
    vector: [0, 0, 2.2],
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  {
    name: '背面',
    icon: loadImg('behind.png'),
    vector: [0, 0, -2.2],
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  {
    name: '左侧面',
    icon: loadImg('left.png'),
    vector: [2.2, 0, 0],
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  {
    name: '右侧面',
    icon: loadImg('right.png'),
    vector: [-2.2, 0, 0],
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  {
    name: '顶面',
    icon: loadImg('top.png'),
    vector: [0, 2.2, 0],
    rotation: {
      x: 0,
      y: 0,
      z: Math.PI / 2,
    },
  },
  {
    name: '底面',
    icon: loadImg('bottom.png'),
    vector: [0, -2.2, 0],
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
]

export const changeSceneSide = (params) => {
  const { camera, controls, config } = sceneStore.mainSceneManager
  const { vector, rotation } = params
  camera.position.set(
    vector[0] * config.screenDistance,
    vector[1] * config.screenDistance,
    vector[2] * config.screenDistance
  )
  // 修改camera的LookAt无用
  // 因为camera被controls托管了
  // 需要修改controls的target
  controls.target.x = rotation.x
  controls.target.y = rotation.y
  controls.target.z = rotation.z
}
