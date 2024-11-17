import useFiberStoreHook from '@/store/useFiberStore'
import usePatientStoreHook from '@/store/usePatientStore'
import { loadFiber } from './loadFiber'

const fiberStore = useFiberStoreHook()
const patientStore = usePatientStoreHook()

export const initFiber = () => {
  return new Promise((resolve, reject) => {
    const fiberAssets = patientStore.patientAssets.fiber
    const downloadUrlList = fiberAssets.map((item) => item.downloadUrl)
    loadFiber(downloadUrlList)
      .then((fiberPool) => {
        fiberStore.fiberList = fiberPool
        resolve()
      })
      .catch(reject)
  })
}
