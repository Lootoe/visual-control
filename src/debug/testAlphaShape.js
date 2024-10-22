import * as THREE from 'three'
import { alphaShape } from '@/libs/buildModel'
import { addMesh } from '@/modules/scene'

const getSquarePointsCloud = (num, min, max, center = [0, 0, 0]) => {
  const points = []
  for (let i = 0; i < num; i++) {
    const x = Math.random() * (max - min) + min + center[0]
    const y = Math.random() * (max - min) + min + center[1]
    const z = Math.random() * (max - min) + min + center[2]
    points.push([x, y, z])
  }
  return points
}

const createSpherePoints = (center, radius, seg) => {
  const geometry = new THREE.SphereGeometry(radius, seg, seg)
  // 设置geometry的位置
  geometry.translate(center.x, center.y, center.z)
  // 获取球体表面的所有顶点
  const vertices = geometry.attributes.position.array
  const points = []
  // 遍历所有顶点
  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i]
    const y = vertices[i + 1]
    const z = vertices[i + 2]
    points.push([x, y, z])
  }
  return points
}

const renderCloudFromPoitns = (vertices) => {
  const positions = []
  for (let i = 0; i < vertices.length; i++) {
    const vertex1 = vertices[i]
    positions.push(...vertex1)
  }
  const pointGeometry = new THREE.BufferGeometry()
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const pointMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5 })
  const pointCloud = new THREE.Points(pointGeometry, pointMaterial)
  return pointCloud
}

const electricMaterial = new THREE.MeshPhongMaterial({
  color: '#fe2323',
  transparent: true,
  opacity: 0.8,
  depthTest: true,
  side: THREE.DoubleSide,
  refractionRatio: 1,
  shininess: 40,
  // wireframe: true,
})

const renderMeshFromPoints = (vertices) => {
  const positions = []
  vertices.forEach((vertex) => {
    positions.push(...vertex)
  })
  const pointGeometry = new THREE.BufferGeometry()
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  pointGeometry.computeVertexNormals()
  // const newGeo = flipFace(pointGeometry)
  // newGeo.computeVertexNormals()
  const mesh = new THREE.Mesh(pointGeometry, electricMaterial)
  return mesh
}

export function testAlphaShape() {
  const points1 = getSquarePointsCloud(5000, -20, 20, [50, 50, 50])
  const points2 = getSquarePointsCloud(5000, -20, 20, [-50, -50, -50])
  // const points1 = createSpherePoints({ x: -100, y: -100, z: -100 }, 40, 30)
  // const points2 = createSpherePoints({ x: 100, y: 100, z: 100 }, 40, 30)
  const points = [...points1, ...points2]
  const cloud = renderCloudFromPoitns(points)
  addMesh(cloud)
  console.time('alphaShape')
  alphaShape(points, 50).then((faces) => {
    console.timeEnd('alphaShape')
    const vertices = []
    faces.forEach((face) => {
      face.forEach((index) => {
        vertices.push(points[index])
      })
    })
    const mesh = renderMeshFromPoints(vertices)
    addMesh(mesh)
  })
}
