import * as THREE from 'three'
import { initAlphaShapeWasm, alphaShape } from '@/libs/buildModel'
import { addMesh } from '@/modules/scene'
import { getGeometryFromVertices, getPointCloud } from '@/libs/other/threeTools'

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
  const geo = getGeometryFromVertices(vertices)
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, electricMaterial)
  return mesh
}

export function testAlphaShape() {
  const points1 = getSquarePointsCloud(5000, -20, 20, [50, 50, 50])
  const points2 = getSquarePointsCloud(5000, -20, 20, [-50, -50, -50])
  // const points1 = createSpherePoints({ x: -100, y: -100, z: -100 }, 40, 30)
  // const points2 = createSpherePoints({ x: 100, y: 100, z: 100 }, 40, 30)
  const points = [...points1, ...points2]
  const cloud = getPointCloud(points)
  addMesh(cloud)
  initAlphaShapeWasm().then(() => {
    const faces = alphaShape(points, 50)
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
