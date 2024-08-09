import { renderBrain } from './renderBrain'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { addMesh } from '@/modules/scene'

const { getPatientAssets } = usePatientStoreHook()
const { cacheExtraData, getSceneExtra } = useSceneStoreHook()

export const initBrain = () => {
  return new Promise((resolve, reject) => {
    const brainAsset = getPatientAssets().head
    renderBrain(brainAsset.downloadUrl)
      .then((brainMesh) => {
        addMesh(brainMesh)
        // 默认不显示
        // brainMesh.visible = false
        cacheExtraData('brain', {
          mesh: brainMesh,
          visible: true,
        })
        resolve()
      })
      .catch(reject)
  })
}

export const changeBrainVisible = (flag) => {
  const brain = getSceneExtra().brain
  brain.mesh.visible = flag
  brain.visible = flag
}
