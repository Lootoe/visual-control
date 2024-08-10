import { renderCortex } from './renderCortex'
import { renderBrain } from './renderBrain'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useAddonStoreHook } from '@/store/useAddonStore'
import { addMesh, addMeshInAssist } from '@/modules/scene'

const { getPatientAssets } = usePatientStoreHook()
const { cacheAddons, getAddons } = useAddonStoreHook()

export const initAddons = () => {
  return new Promise((resolve, reject) => {
    initCortex()
      .then(() => {
        return initBrain()
      })
      .then(resolve)
      .catch(reject)
  })
}

export const changeAddonsVisible = (key, flag) => {
  const addons = getAddons()
  const target = addons[key]
  target.mesh.visible = flag
  target.visible = flag
}

const initBrain = () => {
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

const initCortex = () => {
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
