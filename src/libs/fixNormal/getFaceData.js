// 计算三角面的法线
const computeFaceNormal = (pointA, pointB, pointC) => {
  const vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1], pointB[2] - pointA[2]]
  const vectorAC = [pointC[0] - pointA[0], pointC[1] - pointA[1], pointC[2] - pointA[2]]

  const normal = [
    vectorAB[1] * vectorAC[2] - vectorAB[2] * vectorAC[1],
    vectorAB[2] * vectorAC[0] - vectorAB[0] * vectorAC[2],
    vectorAB[0] * vectorAC[1] - vectorAB[1] * vectorAC[0],
  ]

  // 计算长度
  const lengthSquared = normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2
  if (lengthSquared === 0) return [0, 0, 0] // 避免除零错误

  const length = Math.sqrt(lengthSquared)
  const invLength = 1 / length

  // 直接归一化
  normal[0] *= invLength
  normal[1] *= invLength
  normal[2] *= invLength

  return normal
}

export const getFaceData = (faces, points) => {
  return faces.map((face, index) => {
    const [a, b, c] = face
    const pointA = points[a]
    const pointB = points[b]
    const pointC = points[c]

    const normal = computeFaceNormal(pointA, pointB, pointC)

    // 直接在循环中计算中心
    const center = [
      (pointA[0] + pointB[0] + pointC[0]) / 3,
      (pointA[1] + pointB[1] + pointC[1]) / 3,
      (pointA[2] + pointB[2] + pointC[2]) / 3,
    ]

    return {
      index,
      vertices: [a, b, c],
      normal,
      center,
    }
  })
}
