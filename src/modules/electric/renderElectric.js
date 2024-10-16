import * as THREE from 'three'
import { getChipMeshes } from '@/modules/lead'
import { marchingCubes } from '@/libs/buildModel'
import { interscetDetect, combineMeshes, laplacianSmooth, flipNormals } from '@/libs/modifyModel'
import { renderFakeChip, calcFakeData } from './fakeChip'
import qh from 'quickhull3d'

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
  side: THREE.DoubleSide,
  refractionRatio: 1,
  shininess: 40,
  // wireframe: true,
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
  const smoothedGeometry = laplacianSmooth(geometry, 1, 0.5, -1)
  const mesh = new THREE.Mesh(smoothedGeometry, electricMaterial)
  flipNormals(mesh.geometry)
  mesh.renderOrder = 2
  return mesh
}

const intersectsChips = (electricMesh, position, percent, isContain) => {
  const allChips = getChipMeshes()
  const leadChips = allChips[position]
  const interscetedChips = []
  for (let chip of leadChips) {
    // 阈值设为36是因为电极片最上层的点数为36
    // 我们认为第一层完全被覆盖了才认为是相交
    const vitualMesh = new THREE.Mesh(chip.mesh.userData.electricGeo, new THREE.MeshBasicMaterial())
    const flag = interscetDetect(vitualMesh, electricMesh, percent, isContain)
    if (flag) {
      interscetedChips.push(chip)
    }
  }
  return interscetedChips
}

const getGeoFromVertices = (vertices) => {
  const positions = []
  for (let i = 0; i < vertices.length; i++) {
    const vertex = vertices[i]
    positions.push(...vertex)
  }
  const pointGeometry = new THREE.BufferGeometry()
  pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return pointGeometry
}

const getGeometryVertices = (geometry) => {
  const vertices = []
  const positions = geometry.attributes.position.array
  const uniqueVertices = new Set() // 用于存储唯一的顶点
  for (let i = 0; i < positions.length; i += 3) {
    // 序列化顶点为字符串
    const vertex = `${positions[i]},${positions[i + 1]},${positions[i + 2]}`
    uniqueVertices.add(vertex) // 添加到 Set 中，自动去重
  }
  uniqueVertices.forEach((vertex) => {
    // 反序列化为数字数组
    const [x, y, z] = vertex.split(',').map(Number)
    vertices.push([x, y, z])
  })
  return vertices
}

// 当幅值为0.8时，直接采用补的电极片，无视融合
const handleVtaStep1 = (vtaData, isoLevel, position) => {
  const mesh = renderVtaMesh(vtaData, isoLevel)
  let results = intersectsChips(mesh, position, 0.12, true)
  // 正极不爬
  results = results.filter((v) => v.node !== 1)
  console.log('检测到相交的电极片数量', results.length)
  if (results.length === 0) return mesh
  const group = new THREE.Group()
  results.forEach((r) => {
    const chipGeo = r.mesh.userData.electricGeo
    const electricMesh = new THREE.Mesh(chipGeo, electricMaterial)
    group.add(electricMesh)
  })
  return group
}

// 当幅值在0.85-1.6V之间时，采用quickhull3d算法
const handleVtaStep2 = (vtaDataList, isoLevel, position) => {
  const group = new THREE.Group()
  vtaDataList.forEach((vtaData) => {
    const mesh = renderVtaMesh(vtaData, isoLevel)
    let results = intersectsChips(mesh, position, 0.14, true)
    console.log('检测到相交的电极片数量', results.length)
    // 正极不爬
    results = results.filter((v) => v.node === 2)
    const meshes = [mesh]
    results.forEach((r) => {
      const userData = r.mesh.userData
      const fakeData = calcFakeData(userData.startPoint, userData.endPoint, mesh.geometry)
      const fakeChip = renderFakeChip({
        controlLen: fakeData.controlLen,
        offset: fakeData.offset,
        chipLen: userData.chipLen,
        chipRadius: userData.chipRadius,
        transformMatrix: userData.transformMatrix,
      })
      meshes.push(fakeChip)
    })
    const finalMesh = combineMeshes(meshes)
    const geoVertices = getGeometryVertices(finalMesh.geometry)
    const faces = qh(geoVertices)
    const vertices = []
    faces.forEach((face) => {
      const faceVertices = face.map((v) => geoVertices[v])
      vertices.push(...faceVertices)
    })
    const qhGeo = getGeoFromVertices(vertices)
    const finalGeo = laplacianSmooth(qhGeo, 1, 0.14, 0)
    const fianlMesh = new THREE.Mesh(finalGeo, electricMaterial)
    fianlMesh.renderOrder = 2
    group.add(fianlMesh)
  })
  return group
}

// 当幅值大于1.6V时，采用融合算法
const handleVtaStep3 = (electricRenderData, isoLevel, position, strength) => {
  const { fusionVta, splitVta, nodeLength } = electricRenderData
  const mesh = renderVtaMesh(fusionVta, isoLevel)
  let results = intersectsChips(mesh, position, 0.14, false)
  // 正极不爬
  results = results.filter((v) => v.node !== 1)
  console.log('检测到相交的电极片数量', results.length)
  if (results.length === 0) {
    return mesh
  }
  if (results.length === nodeLength && strength < 1.4) {
    return handleVtaStep2(splitVta, isoLevel, position)
  } else {
    // 必须把原电场放数组第一个
    const meshes = [mesh]
    results
      .filter((v) => v.node === 0)
      .forEach((r) => {
        const electricGeo = r.mesh.userData.electricGeo
        const electricMesh = new THREE.Mesh(electricGeo, electricMaterial)
        meshes.push(electricMesh)
      })
    let finalMesh = combineMeshes(meshes)
    finalMesh.renderOrder = 2
    return finalMesh
  }
}

export const renderElectric = (electricRenderData, strength, position) => {
  const isoLevel = calcThreshold(strength)
  console.log(`幅值${strength}对应的阈值:${isoLevel}`)
  // return renderCloud(electricRenderData.fusionVta, isoLevel)
  if (strength < 0.85) {
    return handleVtaStep1(electricRenderData.fusionVta, isoLevel, position)
  }
  if (strength >= 0.85 && strength <= 1.2) {
    return handleVtaStep2(electricRenderData.splitVta, isoLevel, position)
  }
  if (strength > 1.2) {
    return handleVtaStep3(electricRenderData, isoLevel, position, strength)
  }
}

const renderCloud = (field, isoLevel) => {
  const { values, points } = field
  const positions = []
  values.forEach((v, i) => {
    if (v >= isoLevel) {
      positions.push(...points[i])
    }
  })
  let geo = new THREE.BufferGeometry()
  const positionAttribute = new THREE.Float32BufferAttribute(positions, 3)
  geo.setAttribute('position', positionAttribute)
  const mat = new THREE.PointsMaterial({ size: 0.2, color: 0xffff00 })
  const mesh = new THREE.Points(geo, mat)
  return mesh
}
