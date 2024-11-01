import * as THREE from 'three'
import { getGeometryFromVertices, getPointCloud } from '@/libs/other/threeTools'
import { alphaShape } from '@/libs/buildModel'

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
  if (strength < 0.1) {
    return 0
  } else {
    const v = (3 / strength) * 0.8
    return v
  }
}

export const renderTxt = (points, values, amp, mode) => {
  return new Promise((resolve, reject) => {
    const isoLevel = calcThreshold(amp)
    // // 筛选出0.3V的幅值
    const validPoints = []
    values.forEach((value, index) => {
      if (value >= isoLevel) {
        validPoints.push(points[index])
      }
    })
    console.log('有效点数', validPoints.length)

    if (mode === 0) {
      const pointCloud = getPointCloud(validPoints, 0.1)
      resolve(pointCloud)
    }

    if (mode === 1) {
      const faces = alphaShape(validPoints, 1)
      const vertices = []
      faces.forEach((face) => {
        face.forEach((index) => {
          vertices.push(validPoints[index])
        })
      })
      const mesh = renderMeshFromPoints(vertices)
      resolve(mesh)
    }
  })
}

export const calcPointsLayer = (values) => {
  let staticsList = [
    {
      range: [0, 0.8],
      length: 0,
    },
    {
      range: [0.8, 1],
      length: 0,
    },
    {
      range: [0.8, 3],
      length: 0,
    },
    {
      range: [0.8, 5],
      length: 0,
    },
    {
      range: [0.8, 8],
      length: 0,
    },
    {
      range: [0.8, 10],
      length: 0,
    },
    {
      range: [0.8, 12.5],
      length: 0,
    },
  ]
  staticsList.forEach((item) => {
    values.forEach((value) => {
      const min = calcThreshold(item.range[1])
      const max = calcThreshold(item.range[0])
      if (value >= min && value < max) {
        item.length++
      }
    })
  })
  return staticsList
}
