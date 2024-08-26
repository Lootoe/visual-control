import { marchingCubes, laplacianSmooth } from '@/libs/buildModel'
import * as THREE from 'three'
import { getChipMeshes } from '@/modules/lead'
import { interscetDetect, combineMeshes } from '@/libs/buildModel'

const calcThreshold = (strength) => {
  // 本来幅值是从0.8到3V均匀变化的
  // 现在将其变化区间改为了1.2-3V
  // 但是总步数还是没变
  if (strength < 0.8) return 99999
  let actualNum = strength
  const v = (3 / actualNum) * 0.8
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

const intersectsChips = (electricMesh) => {
  const chips = getChipMeshes()
  const interscetedChips = []
  for (let chip of chips) {
    const flag = interscetDetect(chip.mesh, electricMesh)
    if (flag) {
      interscetedChips.push(chip)
    }
  }
  console.log('interscetedChips', interscetedChips)
  return interscetedChips
}

export const renderElectric = (vtaData, strength) => {
  const isoLevel = calcThreshold(strength)
  console.log(`幅值${strength}对应的阈值:${isoLevel}`)
  const mesh = renderVtaMesh(vtaData, isoLevel)
  const results = intersectsChips(mesh)
  if (results.length === 0) return mesh
  const meshes = [mesh]
  results.forEach((r) => {
    const electricGeo = r.mesh.userData.electricGeo
    const electricMesh = new THREE.Mesh(electricGeo, new THREE.MeshBasicMaterial({ color: '#000' }))
    meshes.push(electricMesh)
  })
  const finalMesh = combineMeshes(meshes)
  return finalMesh
}
