import * as THREE from 'three'
import './toIndexed'

// 函数：计算三角面的法线
function computeNormal(vA, vB, vC, center) {
  const tri = new THREE.Triangle(vA, vB, vC)
  const normal = new THREE.Vector3()
  tri.getNormal(normal)
  const faceCenter = new THREE.Vector3()
  tri.getMidpoint(faceCenter)
  const toCenter = new THREE.Vector3()
  toCenter.subVectors(center, faceCenter)
  const res = normal.dot(toCenter)
  return res > 0
}

// 计算点云的几何中心，用于计算法线
function computeGeometryCenter(vertices) {
  const geoCenter = new THREE.Vector3()
  for (let vec of vertices) {
    geoCenter.add(vec)
  }
  geoCenter.divideScalar(vertices.length)
  return geoCenter
}

function computeGeometryVertices(geometry) {
  const points = []
  const vertices = geometry.attributes.position.array
  for (let i = 0; i < vertices.length; i += 3) {
    const vec = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
    points.push(vec)
  }
  return points
}

// 翻转法线错误的面
// 在three.js中，如果三角面的法线和摄像机视线同方向，那么该三角面不显示
// 对于法线错误的面，我们交换顶点位置，使其法线正常
export const flipFace = (geometry) => {
  const correctVertices = []
  const vertices = computeGeometryVertices(geometry)
  const center = computeGeometryCenter(vertices)
  // 遍历三角形面（每三个索引表示一个面）
  // 这是找领域顶点
  for (let i = 0; i < vertices.length; i += 3) {
    const v1 = vertices[i]
    const v2 = vertices[i + 1]
    const v3 = vertices[i + 2]
    const inside = computeNormal(v1, v2, v3, center)
    if (inside) {
      correctVertices[i] = v3
      correctVertices[i + 1] = v2
      correctVertices[i + 2] = v1
    } else {
      correctVertices[i] = v1
      correctVertices[i + 1] = v2
      correctVertices[i + 2] = v3
    }
  }
  const positions = []
  correctVertices.forEach((v) => {
    positions.push(...v.toArray())
  })
  const correctGeo = new THREE.BufferGeometry()
  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
  correctGeo.setAttribute('position', positionAttribute)
}
