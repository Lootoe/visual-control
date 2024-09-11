import { marchingCubes, laplacianSmooth } from '@/libs/buildModel'
import * as THREE from 'three'
import { getChipMeshes } from '@/modules/lead'
import { interscetDetect, combineMeshes } from '@/libs/modifyModel'

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
  color: '#fe2323',
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

const renderVtaCloud = (vtaData, isoLevel) => {
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
  const mat = new THREE.PointsMaterial({ size: 0.2, color: 0xffff00 })
  const mesh = new THREE.Points(geometry, mat)
  mesh.renderOrder = 2
  return mesh
}

const intersectsChips = (electricMesh, position) => {
  const allChips = getChipMeshes()
  const leadChips = allChips[position]
  const interscetedChips = []
  for (let chip of leadChips) {
    // 阈值设为36是因为电极片最上层的点数为36
    // 我们认为第一层完全被覆盖了才认为是相交
    const vitualMesh = new THREE.Mesh(chip.mesh.userData.electricGeo, new THREE.MeshBasicMaterial())
    const flag = interscetDetect(vitualMesh, electricMesh, 0.2)
    if (flag) {
      interscetedChips.push(chip)
    }
  }
  return interscetedChips
}

export const renderElectric = (vtaData, strength, position) => {
  const isoLevel = calcThreshold(strength)
  console.log(`幅值${strength}对应的阈值:${isoLevel}`)
  const mesh = renderVtaMesh(vtaData, isoLevel)
  let results = intersectsChips(mesh, position)

  // 正极不爬
  results = results.filter((v) => v.node !== 1)

  if (results.length === 0) return mesh
  // 必须把原电场放数组第一个
  const meshes = [mesh]
  results.forEach((r) => {
    const electricGeo = r.mesh.userData.electricGeo
    const electricMesh = new THREE.Mesh(electricGeo, new THREE.MeshBasicMaterial())
    meshes.push(electricMesh)
  })
  const finalMesh = combineMeshes(meshes)
  return finalMesh
}
