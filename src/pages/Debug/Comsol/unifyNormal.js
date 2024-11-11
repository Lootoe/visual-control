import * as THREE from 'three'

export function unifyNormals(bufferGeometry) {
  bufferGeometry.computeBoundsTree()
  bufferGeometry.computeBoundingBox()
  const position = bufferGeometry.attributes.position
  const normal = bufferGeometry.attributes.normal

  const raycaster = new THREE.Raycaster()
  const tempVec = new THREE.Vector3()
  const tempNormal = new THREE.Vector3()
  const tempMesh = new THREE.Mesh(
    bufferGeometry,
    // 必须要双面材质，不然无效
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  )
  tempMesh.geometry.computeVertexNormals()

  // 计算包围球
  bufferGeometry.computeBoundingSphere()

  // 遍历所有三角形面

  bufferGeometry.computeBoundingSphere()

  // 遍历所有三角形面
  for (let i = 0; i < position.count; i += 3) {
    // 获取三角形的三个顶点
    const vA = new THREE.Vector3().fromBufferAttribute(position, i)
    const vB = new THREE.Vector3().fromBufferAttribute(position, i + 1)
    const vC = new THREE.Vector3().fromBufferAttribute(position, i + 2)

    // 计算中心点
    const center = new THREE.Vector3().addVectors(vA, vB).add(vC).divideScalar(3)

    // 计算当前面的法线
    const edge1 = new THREE.Vector3().subVectors(vB, vA)
    const edge2 = new THREE.Vector3().subVectors(vC, vA)
    const faceNormal = new THREE.Vector3().crossVectors(edge1, edge2).normalize()

    // 在法线方向上移动一小段距离
    const testPoint = center.clone().add(faceNormal.clone().multiplyScalar(0.1))

    // 设置射线的起点和方向
    raycaster.set(testPoint, faceNormal)

    // 使用射线检测几何体本身
    const intersects = raycaster.intersectObject(tempMesh, true)
    // 如果射线相交，则调换法线方向
    if (intersects.length > 0) {
      // 反转法线方向
      tempNormal
        .fromBufferAttribute(normal, i)
        .negate()
        .toArray(normal.array, i * 3)
      tempNormal
        .fromBufferAttribute(normal, i + 1)
        .negate()
        .toArray(normal.array, (i + 1) * 3)
      tempNormal
        .fromBufferAttribute(normal, i + 2)
        .negate()
        .toArray(normal.array, (i + 2) * 3)

      // 交换顶点索引的顺序
      tempVec.copy(vB)
      vB.copy(vC)
      vC.copy(tempVec)

      // 更新顶点缓冲区中的位置
      vA.toArray(position.array, i * 3)
      vB.toArray(position.array, (i + 1) * 3)
      vC.toArray(position.array, (i + 2) * 3)
    }
  }

  // 更新缓冲区
  position.needsUpdate = true
  normal.needsUpdate = true

  // 重新计算法线
  bufferGeometry.computeVertexNormals()
}
