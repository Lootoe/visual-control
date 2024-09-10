import * as THREE from 'three'
import { addMesh } from '@/modules/scene'

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

const generateRandomPoint = (min, max) => {
  const x = Math.random() * (max - min) + min
  const y = Math.random() * (max - min) + min
  const z = Math.random() * (max - min) + min
  return [x, y, z]
}

const renderCloudFromPoitns = (points) => {
  const positions = []
  for (let i = 0; i < points.length; i++) {
    const vertex1 = points[i]
    positions.push(...vertex1)
  }
  const pointGeometry = new THREE.BufferGeometry()
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const pointMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 1 })
  const pointCloud = new THREE.Points(pointGeometry, pointMaterial)
  return pointCloud
}

const renderMeshFromPoints = (points) => {
  const vertices = []
  const positions = []
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i]
    positions.push(...vertex)
  }
  const pointGeometry = new THREE.BufferGeometry()
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  pointGeometry.computeVertexNormals()
  const pointMaterial = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(pointGeometry, pointMaterial)
  return mesh
}

export const testDelaunay = () => {
  // 生成球体上的点云
  // const center = new THREE.Vector3(0.2, 0.2, 0.2)
  // const radius = 10
  // const seg = 6
  // const points = createSpherePoints(center, radius, seg)

  // 生成随机分布点云
  const numPoints = 100
  const min = -50
  const max = 50
  const points = []
  for (let i = 0; i < numPoints; i++) {
    points.push(generateRandomPoint(min, max))
  }

  const cloud = renderCloudFromPoitns(points)
  addMesh(cloud)
}
