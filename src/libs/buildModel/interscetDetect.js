import * as THREE from 'three'

export const interscetDetect = (meshA, meshB) => {
  // 计算 MeshA 的几何中心
  const centerA = new THREE.Vector3()
  meshA.geometry.computeBoundingBox()
  meshA.geometry.boundingBox.getCenter(centerA)

  // 将几何中心转到世界坐标
  centerA.applyMatrix4(meshA.matrixWorld)

  // 创建射线检测器
  const raycaster = new THREE.Raycaster()

  // 获取 MeshA 的顶点
  const vertices = meshA.geometry.attributes.position.array
  let overlapDetected = false

  for (let i = 0; i < vertices.length; i += 3) {
    // 获取顶点坐标
    const vertex = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
    vertex.applyMatrix4(meshA.matrixWorld)

    // 计算射线方向
    const direction = new THREE.Vector3().subVectors(vertex, centerA).normalize()

    // 设置射线起点和方向
    raycaster.set(centerA, direction)

    // 检测与 MeshB 的相交情况
    const intersects = raycaster.intersectObject(meshB, true)
    const centerToVertexDistance = centerA.distanceTo(vertex)

    if (intersects.length > 0) {
      // 检查射线是否与 MeshB 相交并且交点距离小于中心到顶点的距离
      if (intersects[0].distance < centerToVertexDistance) {
        overlapDetected = true
        break
      }
    }
  }

  if (overlapDetected) {
    return true
  } else {
    return false
  }
}
