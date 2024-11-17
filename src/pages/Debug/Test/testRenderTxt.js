import * as THREE from 'three'
import { loadTxt } from './loadTxt.js'
import { getGeometryFromVertices, getPointCloud } from '@/libs/other/threeTools'
import { addMesh } from '@/modules/scene'
import { initAlphaShapeWasm, alphaShape } from '@/libs/buildModel'

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

const calcThreshold = (strength) => {
  // 本来幅值是从0.8到3V均匀变化的
  // 现在将其变化区间改为了1.2-3V
  // 但是总步数还是没变
  if (strength < 0.8) return 99999
  let actualNum = strength
  const v = (3 / actualNum) * 0.8
  return v
}

export const testRenderTxt = async () => {
  const { points, values } = await loadTxt(new URL('./0210.txt', import.meta.url))

  const points_filted = []
  const values_filted = []
  points.forEach((point, index) => {
    if (index % 4 === 0) {
      points_filted.push(point)
      values_filted.push(values[index])
    }
  })

  console.log('当前点云数量', points.length)

  const pointCloud = getPointCloud(points, 0.1)
  addMesh(pointCloud)

  const isoLevel = calcThreshold(3)

  // // 筛选出0.3V的幅值
  const validPoints = []
  values_filted.forEach((value, index) => {
    if (value >= isoLevel) {
      validPoints.push(points_filted[index])
    }
  })
  // console.log('validPoints', validPoints.length)
  // console.time('初始化wasm')
  // initAlphaShapeWasm().then(() => {
  //   console.timeEnd('初始化wasm')
  //   const faces = alphaShape(validPoints, 1.5)
  //   const vertices = []
  //   faces.forEach((face) => {
  //     face.forEach((index) => {
  //       vertices.push(validPoints[index])
  //     })
  //   })
  //   const mesh = renderMeshFromPoints(vertices)
  //   addMesh(mesh)
  // })
}
