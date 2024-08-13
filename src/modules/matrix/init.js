import * as THREE from 'three'
import { loadMatrix } from './loadMatrix.js'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { usePatientStoreHook } from '@/store/usePatientStore'
const { cacheExtraData } = useSceneStoreHook()
const { getPatientAssets } = usePatientStoreHook()

export const initMatrix = () => {
  return new Promise((resolve, reject) => {
    // 先缓存RAS2XYZ矩阵
    const ras2xyz = new THREE.Matrix4(-1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1)
    cacheExtraData('ras2xyz', ras2xyz)
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
