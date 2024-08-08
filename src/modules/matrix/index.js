import { loadMatrix } from './loadMatrix.js'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { usePatientStoreHook } from '@/store/usePatientStore'
const { cacheExtraData } = useSceneStoreHook()
const { getPatientAssets } = usePatientStoreHook()

export const configMNI152 = () => {
  return new Promise((resolve, reject) => {
    const asset = getPatientAssets()?.matrix?.MNI152_template
    loadMatrix(asset.downloadUrl)
      .then((affine) => {
        if (affine) {
          cacheExtraData('MNI152_template', affine)
        }
        resolve()
      })
      .catch(reject)
  })
}
