import { adjustCameraPosition } from './adjustCameraPosition'
import {
  __initScene,
  destoryScene,
  addMesh,
  removeMesh,
  addMeshes,
  removeMeshes,
  addMeshInAssist,
} from './init'
import { SCENE_FACES, changeSceneSide } from './changeSceneSide'

// 在场景初始化完成时，需要adjustCameraPosition到一个倾斜角度
const initScene = (params) => {
  return new Promise((resolve, reject) => {
    // 如果上一次的没清除，那就清除
    __initScene(params)
      .then(() => {
        adjustCameraPosition()
        resolve()
      })
      .catch(reject)
  })
}

export {
  initScene,
  destoryScene,
  addMesh,
  removeMesh,
  addMeshes,
  removeMeshes,
  addMeshInAssist,
  SCENE_FACES,
  changeSceneSide,
}
