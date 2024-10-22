import * as THREE from 'three'
import './toIndexed'

export function fixNormals(geometry) {
  const indexedGeo = geometry.toIndexed()
  indexedGeo.computeVertexNormals()
  const index = indexedGeo.index.array // 获取索引数组
  const position = indexedGeo.attributes.position.array // 获取顶点位置数组
  const normal = indexedGeo.attributes.normal.array // 获取法线数组
  const visited = new Set()

  // 修正给定面的法线方向
  function fixFaceNormal(faceIndex, referenceNormal) {
    if (visited.has(faceIndex)) return
    visited.add(faceIndex)

    const normalVec = computeNormal(faceIndex)

    // 计算当前面的法线和参考法线的点积
    const dot = normalVec.dot(referenceNormal)

    // 引入容差值来判断是否需要翻转法线
    const epsilon = 1e-6
    if (dot < -epsilon) {
      const i1 = index[faceIndex * 3]
      const i2 = index[faceIndex * 3 + 1]
      const i3 = index[faceIndex * 3 + 2]

      // 交换索引以翻转顶点顺序
      index[faceIndex * 3] = i3
      index[faceIndex * 3 + 2] = i1

      // 翻转法线
      flipVertexNormal(i1)
      flipVertexNormal(i2)
      flipVertexNormal(i3)
    }

    // 使用栈结构替代递归，避免栈溢出
    const stack = []
    stack.push(faceIndex)

    while (stack.length > 0) {
      const currentFaceIndex = stack.pop()
      const currentNormalVec = computeNormal(currentFaceIndex)
      const currentDot = currentNormalVec.dot(referenceNormal)

      if (currentDot < -epsilon) {
        const ci1 = index[currentFaceIndex * 3]
        const ci2 = index[currentFaceIndex * 3 + 1]
        const ci3 = index[currentFaceIndex * 3 + 2]

        index[currentFaceIndex * 3] = ci3
        index[currentFaceIndex * 3 + 2] = ci1

        flipVertexNormal(ci1)
        flipVertexNormal(ci2)
        flipVertexNormal(ci3)
      }

      // 遍历相邻的三角面，修正法线
      for (let i = 0; i < index.length / 3; i++) {
        if (!visited.has(i) && isNeighbor(currentFaceIndex, i)) {
          visited.add(i)
          stack.push(i)
        }
      }
    }
  }

  // 翻转单个顶点的法线
  function flipVertexNormal(vertexIndex) {
    const nx = normal[vertexIndex * 3]
    const ny = normal[vertexIndex * 3 + 1]
    const nz = normal[vertexIndex * 3 + 2]
    normal[vertexIndex * 3] = -nx
    normal[vertexIndex * 3 + 1] = -ny
    normal[vertexIndex * 3 + 2] = -nz
  }

  // 判断两个三角面是否相邻
  function isNeighbor(faceIndex1, faceIndex2) {
    const i1 = index[faceIndex1 * 3]
    const i2 = index[faceIndex1 * 3 + 1]
    const i3 = index[faceIndex1 * 3 + 2]

    const ni1 = index[faceIndex2 * 3]
    const ni2 = index[faceIndex2 * 3 + 1]
    const ni3 = index[faceIndex2 * 3 + 2]

    const sharedVertices = [i1, i2, i3].filter((v) => [ni1, ni2, ni3].includes(v))
    return sharedVertices.length === 2 // 如果共享两个顶点，则说明相邻
  }

  // 计算指定三角面的法线
  function computeNormal(i) {
    const i1 = index[i * 3]
    const i2 = index[i * 3 + 1]
    const i3 = index[i * 3 + 2]

    const vA = new THREE.Vector3(position[i1 * 3], position[i1 * 3 + 1], position[i1 * 3 + 2])

    const vB = new THREE.Vector3(position[i2 * 3], position[i2 * 3 + 1], position[i2 * 3 + 2])

    const vC = new THREE.Vector3(position[i3 * 3], position[i3 * 3 + 1], position[i3 * 3 + 2])

    const tri = new THREE.Triangle(vA, vB, vC)
    const faceNormal = new THREE.Vector3()
    tri.getNormal(faceNormal) // 通过几何计算三角面的法线
    return faceNormal
  }

  // 遍历所有面，修正每个未访问的面的法线
  for (let i = 0; i < index.length / 3; i++) {
    if (!visited.has(i)) {
      const faceNormal = computeNormal(i)
      fixFaceNormal(i, faceNormal)
    }
  }

  // 更新几何体以反映修正后的法线
  indexedGeo.attributes.normal.needsUpdate = true
  indexedGeo.index.needsUpdate = true
  indexedGeo.computeVertexNormals()
  return indexedGeo
}
