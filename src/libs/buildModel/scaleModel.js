import * as THREE from 'three'

export const scaleModel = (geometry, scale) => {
  // 获取顶点和法线数据
  const positions = geometry.attributes.position.array
  const normals = geometry.attributes.normal.array

  let vertices = []
  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
    const normal = new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2])

    // 沿着法线方向缩放顶点
    const scaledVertex = vertex.add(normal.multiplyScalar(scale - 1))
    vertices.push(scaledVertex)
  }

  // 将新的顶点数据转换回Float32Array
  const newVertices = []
  vertices.forEach((vertex) => {
    newVertices.push(vertex.x, vertex.y, vertex.z)
  })

  // 创建新的BufferGeometry并设置顶点属性
  const positionAttribute = new THREE.Float32BufferAttribute(newVertices, 3)
  const newGeo = new THREE.BufferGeometry()
  newGeo.setAttribute('position', positionAttribute)

  return newGeo
}
