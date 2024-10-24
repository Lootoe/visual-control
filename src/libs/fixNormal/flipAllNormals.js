import * as THREE from 'three'

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
  const inside = computeNormal(v1, v2, v3, center)
  if (inside) {
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