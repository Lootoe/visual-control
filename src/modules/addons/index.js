import { renderCortex } from './renderCortex'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useAddonStoreHook } from '@/store/useAddonStore'
import { addMesh } from '@/modules/scene'

const { getPatientAssets } = usePatientStoreHook()
const { cacheAddons, getAddons } = useAddonStoreHook()

export const initAddons = () => {
  return new Promise((resolve, reject) => {
    initBrain().then(resolve).catch(reject)
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
    renderCortex(brainAsset.downloadUrl)
      .then((brainMesh) => {
        addMesh(brainMesh)
        // 默认不显示
        cacheAddons('cortex', {
          mesh: brainMesh,
          visible: true,
        })
        resolve()
      })
      .catch(reject)
  })
}
