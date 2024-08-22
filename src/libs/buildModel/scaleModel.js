import * as THREE from 'three'

export const scaleModel = (geometry, scale) => {
  const vectors = geometry.attributes.position.array

  let vertices = []
  for (let i = 0; i < vectors.length; i += 3) {
    vertices.push(new THREE.Vector3(vectors[i], vectors[i + 1], vectors[i + 2]))
  }

  // 计算模型的中心点
  const centroid = new THREE.Vector3()
  vertices.forEach((vertex) => centroid.add(vertex))
  centroid.divideScalar(vertices.length)

  // 将顶点平移，使中心点在原点
  vertices = vertices.map((vertex) => vertex.sub(centroid))

  // 在原点基础上放大1.2倍
  vertices = vertices.map((vertex) => vertex.multiplyScalar(scale))

  // 将顶点平移回原来的位置
  vertices = vertices.map((vertex) => vertex.add(centroid))

  const newVertices = []
  vertices.forEach((vertex) => {
    newVertices.push(vertex.x, vertex.y, vertex.z)
  })
  const positionAttribute = new THREE.Float32BufferAttribute(newVertices, 3)
  const newGeo = new THREE.BufferGeometry()
  newGeo.setAttribute('position', positionAttribute)
  return newGeo
}
