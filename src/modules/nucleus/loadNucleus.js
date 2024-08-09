import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { useSceneStoreHook } from '@/store/useSceneStore'

const { getSceneExtra } = useSceneStoreHook()

/**加载ply模型，主要是主视图的核团 */
export const loadNucleus = (url) => {
  return new Promise((resolve, reject) => {
    if (!url || url === '') reject()
    const loader = new PLYLoader()
    loader.load(
      url,
      (geometry) => {
        const sceneExtra = getSceneExtra()
        geometry.applyMatrix4(sceneExtra.MNI152_template)
        geometry.applyMatrix4(sceneExtra.ras2xyz)
        // 性能提升重中之重，构建BVH树，加速射线检测
        geometry.computeBoundsTree()
        geometry.computeBoundingBox()
        resolve(geometry)
      },
      null,
      reject
    )
  })
}
