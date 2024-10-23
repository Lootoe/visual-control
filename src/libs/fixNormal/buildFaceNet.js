// 优化后的 getFaceStruct
const getFaceStruct = (face, index) => {
  const [a, b, c] = face.sort((a, b) => a - b) // 简化排序，直接解构

  return {
    index: index,
    vertices: [a, b, c],
    center: [],
    normal: [], // 这里直接初始化 normal
  }
}

// 计算三角面的法线
const computeFaceNormal = (vertices) => {
  // 根据索引从点数组中获取顶点坐标
  const pointA = vertices[0]
  const pointB = vertices[1]
  const pointC = vertices[2]

  // 计算边向量 AB 和 AC
  const vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1], pointB[2] - pointA[2]]

  const vectorAC = [pointC[0] - pointA[0], pointC[1] - pointA[1], pointC[2] - pointA[2]]

  // 计算叉积 vectorAB × vectorAC，得到法线向量
  const normal = [
    vectorAB[1] * vectorAC[2] - vectorAB[2] * vectorAC[1],
    vectorAB[2] * vectorAC[0] - vectorAB[0] * vectorAC[2],
    vectorAB[0] * vectorAC[1] - vectorAB[1] * vectorAC[0],
  ]

  // 归一化法线向量
  const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2)
  return length === 0 ? [0, 0, 0] : normal.map((v) => v / length)
}

export const buildFaceNet = (faces, points) => {
  const faceNet = faces.map((face, index) => {
    const struct = getFaceStruct(face, index)

    // 获取顶点坐标
    const vertices = struct.vertices.map((index) => points[index])

    // 计算法线
    const normal = computeFaceNormal(vertices)
    struct.normal = normal

    // 计算中心点
    const center = vertices.reduce(
      (acc, cur) => {
        acc[0] += cur[0]
        acc[1] += cur[1]
        acc[2] += cur[2]
        return acc
      },
      [0, 0, 0]
    )
    struct.center = center.map((v) => v / 3)

    return struct
  })

  return faceNet
}
