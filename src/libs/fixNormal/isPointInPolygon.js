import { rayIntersectsTriangle } from './rayIntersectsTriangle'

export function isPointInPolygon(point, faceNet, points) {
  const direction_1 = [0, 0, 1]
  const direction_2 = [0, 0, -1]
  let success_1 = false
  let success_2 = false
  for (const face of faceNet) {
    const triangle = face.vertices.map((v) => points[v])
    const isCrossedFace = rayIntersectsTriangle(point, direction_1, triangle)
    if (isCrossedFace) {
      success_1 = true
    }
  }
  for (const face of faceNet) {
    const triangle = face.vertices.map((v) => points[v])
    const isCrossedFace = rayIntersectsTriangle(point, direction_2, triangle)
    if (isCrossedFace) {
      success_2 = true
    }
  }
  return success_1 && success_2
}
