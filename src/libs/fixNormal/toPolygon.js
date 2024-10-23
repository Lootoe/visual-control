export const toPolygon = (geometry) => {
  // 创建 points 数组，存储所有顶点
  const points = []

  // 获取 position 属性中的顶点数组
  const positionArray = geometry.attributes.position.array

  // 每三个值表示一个顶点的 x, y, z 坐标
  for (let i = 0; i < positionArray.length; i += 3) {
    const point = [positionArray[i], positionArray[i + 1], positionArray[i + 2]]
    points.push(point)
  }

  // 创建 polygon 数组，存储三角面的顶点索引
  const polygon = []

  // 如果 geometry.index 存在，使用索引表示三角面
  if (geometry.index) {
    const indexArray = geometry.index.array

    // 每三个索引组成一个三角面
    for (let i = 0; i < indexArray.length; i += 3) {
      const triangle = [indexArray[i], indexArray[i + 1], indexArray[i + 2]]
      polygon.push(triangle)
    }
  } else {
    // 如果没有索引，按顶点的顺序直接构建三角面
    for (let i = 0; i < positionArray.length / 3; i += 3) {
      const triangle = [i, i + 1, i + 2]
      polygon.push(triangle)
    }
  }

  return { points, polygon }
}
