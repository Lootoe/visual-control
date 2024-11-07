import { initAlphaShapeWasm, delaunay } from './delaunay.js'

const alphaShape = (points, alpha = 1) => {
  const faces = delaunay(points, alpha)
  return faces
}

export { initAlphaShapeWasm, alphaShape }
