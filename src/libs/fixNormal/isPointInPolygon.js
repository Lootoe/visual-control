import { rayIntersectsTriangle } from './rayIntersectsTriangle'

export function isPointInPolygon(point, faceNet, points) {
  const directions = [
    [0, 0, 1], // 正向
    [0, 0, -1], // 反向
  ]

  let success = [false, false] // 分别表示正向和反向的结果
  for (const face of faceNet) {
    const triangle = face.vertices.map((v) => points[v])

    directions.forEach((dir, i) => {
      if (rayIntersectsTriangle(point, dir, triangle)) {
        success[i] = true
      }
    })

    // 如果两个方向都已经相交，提前结束遍历
    if (success[0] && success[1]) break
  }

  return success[0] && success[1]
}
