import * as THREE from 'three'
import { toIndexedGeometry } from './toIndexedGeometry'

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

// 基于法线方向的拉普拉斯平滑
const normalBasedLaplacian = (vertex, neighbors, normal) => {
  const smoothedPosition = new THREE.Vector3()
  neighbors.forEach((neighbor) => smoothedPosition.add(neighbor))
  smoothedPosition.divideScalar(neighbors.length)

  // 计算沿法线方向的平滑向量
  const direction = smoothedPosition.sub(vertex).projectOnVector(normal)
  return direction
}

const laplacianSmoothStepWithNormal = (vertices, neighborsMap, normals, lambda) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])
    const normal = normals[vertexIndex]
    const delta = normalBasedLaplacian(vertex, neighbors, normal).multiplyScalar(lambda)
    newVertices.push(vertex.clone().add(delta))
  })
  return newVertices
}

export const laplacianSmooth = (geometry, iterations = 1, lambda = 1) => {
  const newGeo = toIndexedGeometry(geometry)
  const vectors = newGeo.attributes.position.array
  const indexes = newGeo.index

  let vertices = []
  for (let i = 0; i < vectors.length; i += 3) {
    vertices.push(new THREE.Vector3(vectors[i], vectors[i + 1], vectors[i + 2]))
  }

  // 计算法线
  newGeo.computeVertexNormals()
  const normalVectors = newGeo.attributes.normal.array
  const normals = []
  for (let i = 0; i < normalVectors.length; i += 3) {
    normals.push(new THREE.Vector3(normalVectors[i], normalVectors[i + 1], normalVectors[i + 2]))
  }

  const neighborsMap = precomputeNeighbors(indexes)

  for (let i = 0; i < iterations; i++) {
    vertices = laplacianSmoothStepWithNormal(vertices, neighborsMap, normals, lambda)
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
