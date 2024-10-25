import * as THREE from 'three'
import { rayIntersectsTriangle } from './rayIntersectsTriangle'

// 函数：计算三角面的法线
function computeNormalOutside(vA, vB, vC) {
  const tri = new THREE.Triangle(vA, vB, vC)
  const normal = new THREE.Vector3()
  tri.getNormal(normal)
  const faceCenter = new THREE.Vector3()
  tri.getMidpoint(faceCenter)
  const point = [
    faceCenter[0] + normal[0] * 0.5,
    faceCenter[1] + normal[1] * 0.5,
    faceCenter[2] + normal[2] * 0.5,
  ]
  const v1 = vA.toArray()
  const v2 = vB.toArray()
  const v3 = vC.toArray()
  const direction1 = [0, 0, 1]
  const direction2 = [0, 0, -1]
  const success1 = rayIntersectsTriangle(point, direction1, v1, v2, v3)
  const success2 = rayIntersectsTriangle(point, direction2, v1, v3, v2)
  return success1 && success2
}

// 计算点云的几何中心，用于计算法线
function computeVerticesCenter(vertices) {
  const geoCenter = new THREE.Vector3()
  for (let vec of vertices) {
    geoCenter.add(vec)
  }
  geoCenter.divideScalar(vertices.length)
  return geoCenter
}

// 翻转法线错误的面
// 如果发现第一个三角面法线方向不正确，则全部三角面都需要调换顺序
export const flipAllNormals = (geometry) => {
  const { faces, vertices } = getDataFromBufferGeometry(geometry)

  const center = computeVerticesCenter(vertices)

  const firstFace = faces[0]
  const [v1, v2, v3] = firstFace.map((i) => vertices[i])
  const outside = computeNormalOutside(v1, v2, v3, center)
  if (!outside) {
    const correctVertices = []
    faces.forEach((arr) => {
      const v1 = vertices[arr[0]]
      const v2 = vertices[arr[1]]
      const v3 = vertices[arr[2]]
      correctVertices.push(v3, v2, v1)
    })
    const positions = []
    correctVertices.forEach((v) => {
      positions.push(...v.toArray())
    })
    const correctGeo = new THREE.BufferGeometry()
    const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
    correctGeo.setAttribute('position', positionAttribute)
    return correctGeo
  } else {
    return geometry
  }
}

// 获取所有面和顶点的方法
function getDataFromBufferGeometry(bufferGeometry) {
  const position = bufferGeometry.attributes.position
  const index = bufferGeometry.index
  const vertices = []
  const faces = []

  // 收集顶点
  for (let i = 0; i < position.count; i++) {
    const vertex = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i))
    vertices.push(vertex)
  }

  // 根据是否存在索引来收集面
  if (index) {
    const indices = index.array
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i]
      const b = indices[i + 1]
      const c = indices[i + 2]

      faces.push([a, b, c]) // 面是由顶点索引组成
    }
  } else {
    for (let i = 0; i < position.count; i += 3) {
      faces.push([i, i + 1, i + 2]) // 如果没有索引，按顺序组合三角形面
    }
  }

  return { vertices, faces }
}
