import * as THREE from 'three'

export const renderFakeChip = (params) => {
  const { chipLen, chipRadius, controlLen, transformMatrix } = params
  const curve = new THREE.CubicBezierCurve(
    new THREE.Vector2(chipRadius + 0.06, chipLen / -2 - 0.04),
    new THREE.Vector2(controlLen, 0),
    new THREE.Vector2(controlLen, 0),
    new THREE.Vector2(chipRadius + 0.06, chipLen / 2 + 0.04)
  )
  const points = curve.getPoints(8)
  const geometry = new THREE.LatheGeometry(points, 36, 0, Math.PI * 2)
  geometry.applyMatrix4(transformMatrix)
  geometry.computeVertexNormals()
  const mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())
  return mesh
}

export const calcFakeData = (A, B, geometry) => {
  // 计算直线AB的方向向量
  const AB = new THREE.Vector3().subVectors(B, A).normalize() // AB向量，归一化

  // 获取geometry的所有顶点
  const vertices = geometry.attributes.position.array

  let maxDistance = -Infinity // 初始化最大距离
  let farthestPoint = null // 记录最远的点
  let distancePA = null

  for (let i = 0; i < vertices.length; i += 3) {
    const P = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]) // 顶点P

    // 计算AP向量
    const AP = new THREE.Vector3().subVectors(P, A)

    // 使用点积法计算P点在直线AB上的投影长度
    const projectionLength = AP.dot(AB) // AP在AB方向上的投影长度
    const projectionPoint = new THREE.Vector3().addVectors(
      A,
      AB.clone().multiplyScalar(projectionLength)
    ) // 投影点

    // 判断投影点是否在线段AB之间
    const projectionToA = projectionPoint.distanceTo(A)
    const projectionToB = projectionPoint.distanceTo(B)
    const ABLength = A.distanceTo(B)
    if (projectionToA <= ABLength && projectionToB <= ABLength) {
      // P点到直线AB的垂直距离
      const distanceToLine = P.distanceTo(projectionPoint)

      // 更新最远的点
      if (distanceToLine > maxDistance) {
        maxDistance = distanceToLine
        farthestPoint = P
      }
    }
  }

  // 输出结果
  if (farthestPoint) {
    distancePA = farthestPoint.distanceTo(A)
  } else {
    console.log('没有找到符合条件的顶点。')
  }

  return {
    controlLen: maxDistance,
    offset: distancePA,
  }
}
