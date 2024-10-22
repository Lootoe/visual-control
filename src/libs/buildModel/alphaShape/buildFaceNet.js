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

const reverseNormal = (normal) => {
  return normal.map((v) => -v)
}

// 计算两个向量之间的夹角（返回弧度）
const angleBetweenVectors = (v1, v2) => {
  const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]
  const len1 = Math.sqrt(v1[0] ** 2 + v1[1] ** 2 + v1[2] ** 2)
  const len2 = Math.sqrt(v2[0] ** 2 + v2[1] ** 2 + v2[2] ** 2)
  const cosine = dot / (len1 * len2)

  // 修正浮点误差导致的超出范围问题
  const clampedCosine = Math.max(-1, Math.min(1, cosine))

  return Math.acos(clampedCosine) // 返回弧度
}

// 修改判断逻辑：根据夹角和点积细分情况
const isNormalDirectionConsistent = (v1, v2) => {
  const angle = angleBetweenVectors(v1, v2)
  const dot = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]

  // 处理钝角情况
  if (angle > Math.PI / 2) {
    return dot > 0 // 点积大于0则一致，反之需要翻转
  } else {
    // 处理锐角情况
    return dot < 0 // 点积小于0则一致，反之需要翻转
  }
}

export const buildFaceNet = (faces, points) => {
  // 首先提取一个三角形出来作为初始三角形，然后寻找它相邻的三个三角形
  const faceNet = faces.map((face, index) => getFaceStruct(face, index))
  faceNet.forEach((face) => {
    face.edges.forEach((edge) => {
      const adjacentIndex = faceNet.findIndex(
        (struct) =>
          struct.edges.includes(edge) &&
          !face.neighbors.includes(struct.index) &&
          struct.index !== face.index
      )
      face.neighbors.push(adjacentIndex)
    })
  })
  faceNet.forEach((face) => {
    const vertices = face.vertices.map((index) => points[index])
    const normal = computeFaceNormal(vertices)
    face.normal = normal
  })
  return faceNet
}

// 调整三角形面的法线方向，使得所有相邻面的法线一致
// 修正后的 unifyFaceNormals 方法
export const unifyFaceNormals = (faceNet) => {
  const queue = []
  const visited = new Set()
  queue.push(faceNet[0])
  visited.add(0)
  console.log('faceNet', faceNet)
  // 处理队列中的所有面
  while (queue.length > 0) {
    const face = queue.shift()

    // 获取当前面的相邻面
    const neighbors = face.neighbors.map((index) => faceNet[index])

    const currentNormal = face.normal

    for (let j = 0; j < neighbors.length; j++) {
      const neighbor = neighbors[j]
      const neighborIndex = face.neighbors[j]
      // 如果相邻面已经访问过，则跳过
      if (visited.has(neighborIndex)) continue
      console.log('翻转前', JSON.parse(JSON.stringify(neighbor)))
      // 检查相邻面法线方向是否一致
      const areSameDirection = isNormalDirectionConsistent(currentNormal, neighbor.normal)
      if (!areSameDirection) {
        console.log('-----翻转-----')
        const [a, b, c] = neighbor.vertices
        // 如果不一致，调整相邻面的顶点顺序来翻转法线
        // 更新相邻面的法线，使用翻转后的顶点
        neighbor.vertices = [c, b, a]
        neighbor.normal = reverseNormal(neighbor.normal)
      }
      console.log('翻转后', JSON.parse(JSON.stringify(neighbor)))
      // 将相邻面加入队列并标记为已访问
      queue.push(neighbor)
      visited.add(neighborIndex)
    }
  }
  console.log('visited.size', visited.size)
}
