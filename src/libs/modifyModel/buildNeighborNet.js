export const buildNeighborNet = (geometry) => {
  // 获取几何体的索引和顶点数据
  const indexArray = geometry.index.array // 三角形的顶点索引

  // 创建一个边到三角形的映射表
  const edgeToTriangleMap = new Map()

  // 辅助函数：生成边的唯一标识（总是小数在前）
  function getEdgeKey(v1, v2) {
    return v1 < v2 ? `${v1}-${v2}` : `${v2}-${v1}`
  }

  // 遍历每个三角形，构建边映射
  for (let i = 0; i < indexArray.length; i += 3) {
    const v0 = indexArray[i]
    const v1 = indexArray[i + 1]
    const v2 = indexArray[i + 2]

    const triangleIndex = i / 3 // 当前三角形的索引

    // 为每个三角形生成三个边
    const edges = [getEdgeKey(v0, v1), getEdgeKey(v1, v2), getEdgeKey(v2, v0)]

    // 将边与对应的三角形关联
    edges.forEach((edge) => {
      if (!edgeToTriangleMap.has(edge)) {
        edgeToTriangleMap.set(edge, [])
      }
      edgeToTriangleMap.get(edge).push(triangleIndex)
    })
  }

  // 为每个三角形找到其邻居
  const triangles = [] // 存储三角形数据

  for (let i = 0; i < indexArray.length; i += 3) {
    const v0 = indexArray[i]
    const v1 = indexArray[i + 1]
    const v2 = indexArray[i + 2]

    const triangleIndex = i / 3 // 当前三角形的索引
    const neighbors = []

    const edges = [getEdgeKey(v0, v1), getEdgeKey(v1, v2), getEdgeKey(v2, v0)]

    // 查找共享边的三角形，并将它们加入邻居列表
    edges.forEach((edge) => {
      const trianglesSharingEdge = edgeToTriangleMap.get(edge)
      trianglesSharingEdge.forEach((tIdx) => {
        if (tIdx !== triangleIndex && !neighbors.includes(tIdx)) {
          neighbors.push(tIdx)
        }
      })
    })

    // 存储当前三角形的信息
    triangles.push({
      neighbors,
    })
  }

  console.log(triangles)
}
