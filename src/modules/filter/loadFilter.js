import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { useSceneStoreHook } from '@/store/useSceneStore'
import * as THREE from 'three'
const sceneStore = useSceneStoreHook()

export const loadFilter = async (url) => {
  return new Promise((resolve, reject) => {
    if (!url || url === '') reject()
    const loader = new PLYLoader()
    loader.load(
      url,
      (geometry) => {
        const sceneExtra = sceneStore.extraData
        geometry.applyMatrix4(sceneExtra.MNI152_template)
        geometry.applyMatrix4(sceneExtra.ras2xyz)
        // 性能提升重中之重，构建BVH树，加速射线检测
        geometry.computeBoundsTree()
        geometry.computeBoundingBox()
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000 }))
        // 只用来追踪，并不显示
        mesh.visible = false
        resolve(mesh)
      },
      null,
      reject
    )
  })
}
