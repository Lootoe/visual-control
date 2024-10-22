import * as THREE from 'three'
import { alphaShape } from '@/libs/buildModel'
import { addMesh } from '@/modules/scene'
import { VertexNormalsHelper } from 'three/examples/jsm/Addons.js'
import { AxesHelper } from 'three'

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
  const pointMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 1 })
  const pointCloud = new THREE.Points(pointGeometry, pointMaterial)
  return pointCloud
}

const electricMaterial = new THREE.MeshPhongMaterial({
  color: '#fe2323',
  transparent: true,
  opacity: 0.6,
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

export function debug() {
  const points1 = getSquarePointsCloud(100, -20, 20, [50, 50, 50])
  const points2 = getSquarePointsCloud(100, -20, 20, [-50, -50, -50])
  // const points1 = createSpherePoints({ x: -100, y: -100, z: -100 }, 40, 30)
  // const points2 = createSpherePoints({ x: 100, y: 100, z: 100 }, 40, 30)
  const points = [...points1, ...points2]
  const cloud = renderCloudFromPoitns(points)
  addMesh(cloud)
  alphaShape(points1, 500).then((faces) => {
    const vertices = []
    faces.forEach((face) => {
      face.forEach((index) => {
        vertices.push(points1[index])
      })
    })
    const mesh = renderMeshFromPoints(vertices)
    const normalHelper = new VertexNormalsHelper(mesh, 4, 0x00ff00)
    addMesh(mesh)
    addMesh(normalHelper)
    addMesh(new AxesHelper(1000))
  })
}
