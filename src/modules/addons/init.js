import { renderCortex } from './renderCortex'
import { renderBrain } from './renderBrain'
import { renderAxesHelper } from './renderAxesHelper'
import usePatientStoreHook from '@/store/usePatientStore'
import useAddonStoreHook from '@/store/useAddonStore'
import { addMesh, addMeshInAssist } from '@/modules/scene'

const patientStore = usePatientStoreHook()
const addonStore = useAddonStoreHook()

export const initAxesHelper = () => {
  return renderAxesHelper()
}

export const __initBrain = () => {
  return new Promise((resolve, reject) => {
    const brainAsset = patientStore.patientAssets.head
    renderBrain(brainAsset.downloadUrl)
      .then((brainMesh) => {
        addMeshInAssist(brainMesh)
        addonStore.addons.brain = {
          mesh: brainMesh,
          visible: true,
        }
        resolve()
      })
      .catch(reject)
  })
}

export const initCortex = () => {
  return new Promise((resolve, reject) => {
    const brainAsset = patientStore.patientAssets.head
    renderCortex(brainAsset.downloadUrl)
      .then((cortexMesh) => {
        addMesh(cortexMesh)
        addonStore.addons.cortex = {
          mesh: cortexMesh,
          visible: true,
        }
        resolve()
      })
      .catch(() => {
        reject('大脑皮层加载失败')
      })
  })
}
