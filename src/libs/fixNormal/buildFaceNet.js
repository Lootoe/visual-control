const getFaceStruct = (face, index) => {
  const sortedIndexes = face.sort((a, b) => a - b)

  const [a, b, c] = sortedIndexes

  const edge1 = [a, b].join('-')
  const edge2 = [b, c].join('-')
  const edge3 = [a, c].join('-')

  return {
    edges: [edge1, edge2, edge3],
    index: index,
    neighbors: [],
    vertices: [a, b, c],
    center: [],
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
  // 首先提取一个三角形出来作为初始三角形，然后寻找它相邻的三个三角形
  const faceNet = faces.map((face, index) => getFaceStruct(face, index))

  // 计算相邻关系
  // faceNet.forEach((face) => {
  //   face.edges.forEach((edge) => {
  //     const adjacentIndex = faceNet.findIndex(
  //       (struct) =>
  //         struct.edges.includes(edge) &&
  //         !face.neighbors.includes(struct.index) &&
  //         struct.index !== face.index
  //     )
  //     face.neighbors.push(adjacentIndex)
  //   })
  // })

  // 计算法线
  faceNet.forEach((face) => {
    const vertices = face.vertices.map((index) => points[index])
    const normal = computeFaceNormal(vertices)
    face.normal = normal
  })

  // 就算三角面中心点
  faceNet.forEach((face) => {
    const vertices = face.vertices.map((index) => points[index])
    const center = vertices.reduce(
      (acc, cur) => {
        acc[0] += cur[0]
        acc[1] += cur[1]
        acc[2] += cur[2]
        return acc
      },
      [0, 0, 0]
    )
    face.center = center.map((v) => v / 3)
  })
  return faceNet
}
