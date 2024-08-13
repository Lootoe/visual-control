import { renderCortex } from './renderCortex'
import { renderBrain } from './renderBrain'
import { renderAxesHelper } from './renderAxesHelper'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useAddonStoreHook } from '@/store/useAddonStore'
import { addMesh, addMeshInAssist } from '@/modules/scene'

const { getPatientAssets } = usePatientStoreHook()
const { cacheAddons } = useAddonStoreHook()

export const initAxesHelper = () => {
  return renderAxesHelper()
}

export const __initBrain = () => {
  return new Promise((resolve, reject) => {
    const brainAsset = getPatientAssets().head
    renderBrain(brainAsset.downloadUrl)
      .then((brainMesh) => {
        addMeshInAssist(brainMesh)
        // 默认不显示
        cacheAddons('brain', {
          mesh: brainMesh,
          visible: true,
        })
        resolve()
      })
      .catch(reject)
  })
}

export const initCortex = () => {
  return new Promise((resolve, reject) => {
    const brainAsset = getPatientAssets().head
    renderCortex(brainAsset.downloadUrl)
      .then((cortexMesh) => {
        addMesh(cortexMesh)
        // 默认不显示
        cacheAddons('cortex', {
          mesh: cortexMesh,
          visible: true,
        })
        resolve()
      })
      .catch(reject)
  })
}
