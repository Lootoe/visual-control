import * as THREE from 'three'
import '@/libs/buildModel/toIndexed'

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

const laplacian = (vertex, neighbors) => {
  const smoothedPosition = new THREE.Vector3()
  neighbors.forEach((neighbor) => smoothedPosition.add(neighbor))
  smoothedPosition.divideScalar(neighbors.length)
  return smoothedPosition.sub(vertex)
}

// 修正法线梯度的计算方法
const computeNormalGradient = (vertex, neighbors) => {
  let gradientSum = 0
  const referenceNormal = new THREE.Vector3()

  // 计算当前顶点的参考法线
  neighbors.forEach((neighbor) => {
    const edge = neighbor.clone().sub(vertex)
    referenceNormal.add(edge)
  })
  referenceNormal.normalize()

  // 计算每个相邻顶点的法线偏离
  neighbors.forEach((neighbor) => {
    const edge = neighbor.clone().sub(vertex)
    const edgeNormal = edge.clone().normalize()
    const angle = referenceNormal.angleTo(edgeNormal)
    gradientSum += angle
  })

  return gradientSum / neighbors.length
}

const laplacianSmoothStep = (vertices, neighborsMap, lambda) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])

    // 计算法线梯度
    const normalGradient = computeNormalGradient(vertex, neighbors)

    // 调整lambda值，法线梯度越大，平滑强度越高
    const adjustedLambda = lambda * (1 + normalGradient * 0.5)

    const delta = laplacian(vertex, neighbors).multiplyScalar(adjustedLambda)
    newVertices.push(vertex.clone().add(delta))
  })
  return newVertices
}

const inverseLaplacianSmoothStep = (vertices, neighborsMap, mu) => {
  const newVertices = []
  vertices.forEach((vertex, vertexIndex) => {
    const neighbors = Array.from(neighborsMap.get(vertexIndex)).map((index) => vertices[index])

    // 计算法线梯度
    const normalGradient = computeNormalGradient(vertex, neighbors)

    // 调整mu值，法线梯度越大，反向平滑强度越高
    const adjustedMu = mu * (1 + normalGradient * 0.5)
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

  const neighborsMap = precomputeNeighbors(indexes)

  for (let i = 0; i < iterations; i++) {
    vertices = laplacianSmoothStep(vertices, neighborsMap, lambda)
    vertices = inverseLaplacianSmoothStep(vertices, neighborsMap, mu)
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
