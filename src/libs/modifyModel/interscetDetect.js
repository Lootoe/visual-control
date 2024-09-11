import * as THREE from 'three'

// 判断一个点是否在网格内部的辅助函数
const isPointInsideMesh = (point, mesh) => {
  const raycaster = new THREE.Raycaster(point, new THREE.Vector3(1, 0, 0)) // 朝 X 轴方向发射射线
  const intersects = raycaster.intersectObject(mesh, true)
  // 如果射线与网格的相交次数为奇数，点在网格内部
  return intersects.length % 2 !== 0
}

export const interscetDetect = (meshA, meshB, percent = 0.2) => {
  // 计算 MeshA 的几何中心
  const centerA = new THREE.Vector3()
  meshA.geometry.computeBoundingBox()
  meshA.geometry.boundingBox.getCenter(centerA)
  // 性能提升重中之重，构建BVH树，加速射线检测
  meshB.geometry.computeBoundsTree()
  meshB.geometry.computeBoundingBox()

  // 将几何中心转到世界坐标
  centerA.applyMatrix4(meshA.matrixWorld)

  // 创建射线检测器
  const raycaster = new THREE.Raycaster()

  // 获取 MeshA 的顶点
  const vertices = meshA.geometry.attributes.position.array
  // 预先创建 Vector3 实例以避免在循环中频繁创建
  const vertex = new THREE.Vector3()
  const direction = new THREE.Vector3()

  let inCount = 0
  let containCount = 0

  const COUNT_THRESHOLD = Math.round((vertices.length / 3) * percent)

  // 遍历每个顶点，判断其是否在 MeshB 内部
  for (let i = 0; i < vertices.length; i += 3) {
    // 获取顶点坐标并转换到世界坐标系
    vertex.set(vertices[i], vertices[i + 1], vertices[i + 2])
    vertex.applyMatrix4(meshA.matrixWorld)

    // 计算射线方向
    direction.subVectors(vertex, centerA).normalize()

    // 设置射线起点和方向
    raycaster.set(centerA, direction)

    // 检测与 MeshB 的相交情况
    const intersects = raycaster.intersectObject(meshB, true)
    const centerToVertexDistance = centerA.distanceTo(vertex)

    if (intersects.length > 0) {
      if (intersects[0].distance < centerToVertexDistance) {
        inCount++
      }
      // 使用点在几何体内部的检测
      if (isPointInsideMesh(vertex, meshB)) {
        containCount++
      }
    }
  }

  if (inCount === 0) {
    return false
  } else {
    return inCount >= COUNT_THRESHOLD || containCount >= COUNT_THRESHOLD
  }
}
