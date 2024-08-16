import { marchingCubes, laplacianSmooth } from '@/libs/buildModel'
import * as THREE from 'three'

const calcThreshold = (strength) => {
  // 本来幅值是从0.8到3V均匀变化的
  // 现在将其变化区间改为了1.2-3V
  // 但是总步数还是没变
  if (strength <= 0.7) return 99999
  let actualNum = strength
  const min = 0.8
  const replaceMin = 1.2
  const max = 3
  const count = (max - min) / 0.1
  const step = (max - replaceMin) / count
  if (strength > max) {
    actualNum = strength
  } else {
    actualNum = replaceMin + step * ((strength - min) / 0.1)
  }
  const v = (3 / actualNum) * 0.7
  return v
}

const electricMaterial = new THREE.MeshPhongMaterial({
  color: '#ff4444',
  transparent: true,
  opacity: 0.6,
  depthTest: true,
  depthWrite: true,
  side: THREE.DoubleSide,
  refractionRatio: 1,
  shininess: 40,
})

const renderVtaMesh = (vtaData, isoLevel) => {
  const { values, points } = vtaData
  const vertices = []
  values.forEach((v, i) => {
    if (v >= isoLevel) {
      const p = points[i]
      vertices.push(p.toArray())
    }
  })
  let geometry = null
  geometry = marchingCubes(vtaData, isoLevel)
  // geometry.computeVertexNormals()
  const finalGeo = laplacianSmooth(geometry, 1, 0.5, -1)
  const mesh = new THREE.Mesh(finalGeo, electricMaterial)
  mesh.renderOrder = 2
  return mesh
}

export const renderElectric = (vtaData, strength) => {
  const isoLevel = calcThreshold(strength)
  console.log(`幅值${strength}对应的阈值:${isoLevel}`)
  return renderVtaMesh(vtaData, isoLevel)
}
