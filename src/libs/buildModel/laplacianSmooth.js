import * as THREE from 'three'
import '@/libs/buildModel/toIndexed'

// 预计算邻居顶点
const precomputeNeighbors = (indexes) => {
  const neighborsMap = new Map()
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
  }
  return neighborsMap
}

// 计算拉普拉斯算子
const laplacian = (vertex, neighbors) => {
  const smoothedPosition = new THREE.Vector3()
  neighbors.forEach((neighbor) => smoothedPosition.add(neighbor))
  smoothedPosition.divideScalar(neighbors.length)
  return smoothedPosition.sub(vertex)
}

// 计算曲率（基于法线方向差异）
const computeCurvature = (vertex, neighbors, vertexNormals, neighborNormals) => {
  let curvature = 0
  neighbors.forEach((neighbor, index) => {
    const vertexNormal = vertexNormals[index]
    const neighborNormal = neighborNormals[index]
    curvature += vertexNormal.angleTo(neighborNormal)
  })
  return curvature / neighbors.length
}

// 应用拉普拉斯平滑
const laplacianSmoothStep = (vertices, vertexNormals, neighborsMap, lambda) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])
    const neighborNormals = Array.from(neighborsMap.get(vertexIndex)).map(
      (index) => vertexNormals[index]
    )

    // 计算曲率并调整lambda
    const curvature = computeCurvature(vertex, neighbors, vertexNormals, neighborNormals)
    const adjustedLambda = lambda * Math.min(curvature + 1, 2) // 根据曲率调整平滑因子

    const delta = laplacian(vertex, neighbors).multiplyScalar(adjustedLambda)
    newVertices.push(vertex.clone().add(delta))
  })
  return newVertices
}

// 逆向拉普拉斯平滑
const inverseLaplacianSmoothStep = (vertices, vertexNormals, neighborsMap, mu) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])
    const neighborNormals = Array.from(neighborsMap.get(vertexIndex)).map(
      (index) => vertexNormals[index]
    )

    // 计算曲率并调整mu
    const curvature = computeCurvature(vertex, neighbors, vertexNormals, neighborNormals)
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

  const neighborsMap = precomputeNeighbors(indexes)

  for (let i = 0; i < iterations; i++) {
    vertices = laplacianSmoothStep(vertices, vertexNormals, neighborsMap, lambda)
    vertices = inverseLaplacianSmoothStep(vertices, vertexNormals, neighborsMap, mu)
  }

  const newVertices = []
  vertices.forEach((vertex) => {
    newVertices.push(vertex.x, vertex.y, vertex.z)
  })

  const positionAttribute = new THREE.Float32BufferAttribute(newVertices, 3)
  newGeo.setAttribute('position', positionAttribute)
  newGeo.computeVertexNormals()
  return newGeo
}
