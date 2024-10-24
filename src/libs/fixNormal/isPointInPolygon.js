import { rayIntersectsTriangle } from './rayIntersectsTriangle'

export const isPointInPolygon = (point, faceNet, points) => {
  const directions = [
    [0, 0, 1],
    [0, 0, -1],
  ]
  let success = [false, false]

  for (const face of faceNet) {
    const triangle = face.vertices.map((v) => points[v])

    for (let i = 0; i < directions.length; i++) {
      if (rayIntersectsTriangle(point, directions[i], triangle)) {
        success[i] = true
      }
      // 提前结束遍历
      if (success[0] && success[1]) return true
    }
  }
  return success[0] && success[1]
}
