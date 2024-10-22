import { buildFaceNet } from './buildFaceNet'
import { isPointInPolygon } from './isPointInPolygon'

// 在法线上，距离三角面中心的distance处取一个点
// 不依靠three.js的API
const getPointOnNormal = (face, distance) => {
  const { center, normal } = face
  const point = [
    center[0] + normal[0] * distance,
    center[1] + normal[1] * distance,
    center[2] + normal[2] * distance,
  ]
  return point
}

// 调整三角形面的法线方向，使得所有相邻面的法线一致
export const unifyNormal = (polygon, points) => {
  const faceNet = buildFaceNet(polygon, points)
  const correctPolygon = []
  for (const face of faceNet) {
    // 在法线上，距离distance处取一个点
    const tempPoint = getPointOnNormal(face, 0.1)
    const inPolygon = isPointInPolygon(tempPoint, faceNet, points)
    if (inPolygon) {
      const [a, b, c] = face.vertices
      correctPolygon.push([c, b, a])
    } else {
      correctPolygon.push(face.vertices)
    }
  }
  return correctPolygon
}
