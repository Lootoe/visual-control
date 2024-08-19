import * as THREE from 'three'
import '@/libs/buildModel/toIndexed'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

// 预计算邻居顶点及其法线
const precomputeNeighborsAndNormals = (indexes, vertices, vertexNormals) => {
  const neighborsMap = new Map()
  const neighborsNormalsMap = new Map()

  for (let i = 0; i < indexes.count; i += 3) {
    const a = indexes.getX(i),
      b = indexes.getX(i + 1),
      c = indexes.getX(i + 2)

    if (!neighborsMap.has(a)) neighborsMap.set(a, new Set())
    if (!neighborsMap.has(b)) neighborsMap.set(b, new Set())
    if (!neighborsMap.has(c)) neighborsMap.set(c, new Set())

    neighborsMap.get(a).add(b).add(c)
    neighborsMap.get(b).add(a).add(c)
    neighborsMap.get(c).add(a).add(b)

    if (!neighborsNormalsMap.has(a)) neighborsNormalsMap.set(a, [])
    if (!neighborsNormalsMap.has(b)) neighborsNormalsMap.set(b, [])
    if (!neighborsNormalsMap.has(c)) neighborsNormalsMap.set(c, [])

    neighborsNormalsMap.get(a).push(vertexNormals[b], vertexNormals[c])
    neighborsNormalsMap.get(b).push(vertexNormals[a], vertexNormals[c])
    neighborsNormalsMap.get(c).push(vertexNormals[a], vertexNormals[b])
  }
  return { neighborsMap, neighborsNormalsMap }
}

// 计算拉普拉斯算子，采用加权平均
const laplacian = (vertex, neighbors) => {
  const smoothedPosition = new THREE.Vector3()
  const weightSum = neighbors.length
  neighbors.forEach((neighbor) => smoothedPosition.add(neighbor))
  smoothedPosition.divideScalar(weightSum)
  return smoothedPosition.sub(vertex)
}

// 计算曲率（基于法线方向差异）
const computeCurvature = (vertexNormal, neighborNormals) => {
  let curvature = 0
  neighborNormals.forEach((neighborNormal) => {
    curvature += vertexNormal.angleTo(neighborNormal)
  })
  return curvature / neighborNormals.length
}

// 应用拉普拉斯平滑
const laplacianSmoothStep = (
  vertices,
  vertexNormals,
  neighborsMap,
  neighborsNormalsMap,
  lambda
) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])
    const neighborNormals = neighborsNormalsMap.get(vertexIndex)

    // 计算曲率并调整lambda
    const curvature = computeCurvature(vertexNormals[vertexIndex], neighborNormals)
    const adjustedLambda = lambda * Math.min(curvature + 1, 2) // 根据曲率调整平滑因子

    const delta = laplacian(vertex, neighbors).multiplyScalar(adjustedLambda)
    newVertices.push(vertex.clone().add(delta))
  })
  return newVertices
}

// 逆向拉普拉斯平滑
const inverseLaplacianSmoothStep = (
  vertices,
  vertexNormals,
  neighborsMap,
  neighborsNormalsMap,
  mu
) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])
    const neighborNormals = neighborsNormalsMap.get(vertexIndex)

    // 计算曲率并调整mu
    const curvature = computeCurvature(vertexNormals[vertexIndex], neighborNormals)
    const adjustedMu = mu * Math.min(curvature + 1, 2) // 根据曲率调整平滑因子

    const delta = laplacian(vertex, neighbors).multiplyScalar(adjustedMu)
    newVertices.push(vertex.clone().sub(delta))
  })
  return newVertices
}

export const laplacianSmooth = (geometry, iterations = 1, lambda = 1, mu = -1) => {
  const newGeo = geometry.toIndexed()
  const vectors = newGeo.attributes.position.array
  const indexes = newGeo.index

  let vertices = []
  for (let i = 0; i < vectors.length; i += 3) {
    vertices.push(new THREE.Vector3(vectors[i], vectors[i + 1], vectors[i + 2]))
  }

  // 计算法线
  newGeo.computeVertexNormals()
  const normals = newGeo.attributes.normal.array
  let vertexNormals = []
  for (let i = 0; i < normals.length; i += 3) {
    vertexNormals.push(new THREE.Vector3(normals[i], normals[i + 1], normals[i + 2]))
  }

  const { neighborsMap, neighborsNormalsMap } = precomputeNeighborsAndNormals(
    indexes,
    vertices,
    vertexNormals
  )

  for (let i = 0; i < iterations; i++) {
    vertices = laplacianSmoothStep(
      vertices,
      vertexNormals,
      neighborsMap,
      neighborsNormalsMap,
      lambda
    )
    vertices = inverseLaplacianSmoothStep(
      vertices,
      vertexNormals,
      neighborsMap,
      neighborsNormalsMap,
      mu
    )
  }

  const newVertices = []
  vertices.forEach((vertex) => {
    newVertices.push(vertex.x, vertex.y, vertex.z)
  })

  const positionAttribute = new THREE.Float32BufferAttribute(newVertices, 3)
  newGeo.setAttribute('position', positionAttribute)
  const finalGeo = BufferGeometryUtils.mergeVertices(newGeo, 0.1)
  finalGeo.computeVertexNormals()
  return finalGeo
}
