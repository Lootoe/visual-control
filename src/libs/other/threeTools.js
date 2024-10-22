import * as THREE from 'three'

// 用坐标构建模型
export const getGeometryFromVertices = (vertices) => {
  const positions = []
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i]
    positions.push(...vertex)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

// 提取模型里的坐标
export const getVerticesFromGeometry = (geometry) => {
  const vertices = []
  const positions = geometry.attributes.position.array
  const uniqueVertices = new Set() // 用于存储唯一的顶点
  for (let i = 0; i < positions.length; i += 3) {
    // 序列化顶点为字符串
    const vertex = `${positions[i]},${positions[i + 1]},${positions[i + 2]}`
    uniqueVertices.add(vertex) // 添加到 Set 中，自动去重
  }
  uniqueVertices.forEach((vertex) => {
    // 反序列化为数字数组
    const [x, y, z] = vertex.split(',').map(Number)
    vertices.push([x, y, z])
  })
  return vertices
}

// 显示点云
export const getPointCloud = (vertices, size = 0.5, color = 0xffff00) => {
  const positions = []
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i]
    positions.push(...vertex)
  }
  let meometry = new THREE.BufferGeometry()
  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
  meometry.setAttribute('position', positionAttribute)
  const mat = new THREE.PointsMaterial({ size, color })
  const mesh = new THREE.Points(meometry, mat)
  return mesh
}
