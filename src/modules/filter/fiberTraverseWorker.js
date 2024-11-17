import * as THREE from 'three'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'

// 加速射线检测的重中之重
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

const direction_1 = new THREE.Vector3(0, 0, 1)
const direction_2 = new THREE.Vector3(0, 0, -1)
const raycaster_1 = new THREE.Raycaster()
raycaster_1.firstHitOnly = true
const raycaster_2 = new THREE.Raycaster()
raycaster_2.firstHitOnly = true

const intersectSuccess = (mesh, point) => {
  raycaster_1.set(point, direction_1)
  const intersects_1 = raycaster_1.intersectObject(mesh)
  const success_1 = intersects_1.length

  raycaster_2.set(point, direction_2)
  const intersects_2 = raycaster_2.intersectObject(mesh)
  const success_2 = intersects_2.length

  return success_1 && success_2
}

async function traverse({ filters, fibers }) {
  // 由于workers无法传递Mesh，所以我们只能拆散了再重新组装
  filters.forEach((model) => {
    const plydata = model.mesh
    const ply = buildPly(plydata)
    model.mesh = ply
  })
  const reusablePoint = new THREE.Vector3()
  fibers.forEach((fiber) => {
    const { vectors, index } = fiber
    filters.forEach((model) => {
      const { mesh, crossedFibers } = model
      if (mesh) {
        for (let i = 0; i < vectors.length; i += 2) {
          const vector = vectors[i]
          reusablePoint.fromArray(vector)
          if (
            mesh.geometry.boundingBox.containsPoint(reusablePoint) &&
            intersectSuccess(mesh, reusablePoint)
          ) {
            crossedFibers.push(index)
            break
          }
        }
      }
    })
  })

  filters.forEach((model) => {
    model.mesh = null
  })
  const filtersBuffer = objectToArrayBuffer(filters)
  self.postMessage(filtersBuffer, [filtersBuffer.buffer])
  self.close()
}

self.addEventListener('message', (e) => {
  traverse(e.data)
})

const buildPly = (plyData) => {
  // 创建 BufferGeometry 并设置属性
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(plyData.vertices, 3))
  if (plyData.indices) {
    geometry.setIndex(plyData.indices)
  }
  // 使用几何体创建 Mesh
  const material = new THREE.MeshBasicMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.geometry.computeBoundsTree()
  mesh.geometry.computeBoundingBox()
  return mesh
}

function objectToArrayBuffer(obj) {
  // 将对象序列化为 JSON 字符串
  const jsonString = JSON.stringify(obj)

  // 将字符串转换为 Uint8Array
  const encoder = new TextEncoder()
  const uint8Array = encoder.encode(jsonString)

  // 返回 Uint8Array 的缓冲区
  return uint8Array
}
