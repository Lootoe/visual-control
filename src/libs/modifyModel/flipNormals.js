export function flipNormals(geometry) {
  // 确保几何体有 index 属性
  if (geometry.index) {
    const index = geometry.index.array
    // 遍历所有三角面，翻转每个三角形的顶点顺序
    for (let i = 0; i < index.length; i += 3) {
      // 交换每个三角形的第一个和第三个顶点索引
      const temp = index[i]
      index[i] = index[i + 2]
      index[i + 2] = temp
    }
  } else {
    // 如果几何体没有使用 index，直接从 position 属性翻转顶点顺序
    const position = geometry.attributes.position.array
    for (let i = 0; i < position.length; i += 9) {
      // 交换每个三角形的第一个和第三个顶点
      for (let j = 0; j < 3; j++) {
        const temp = position[i + j]
        position[i + j] = position[i + 6 + j]
        position[i + 6 + j] = temp
      }
    }
  }

  // 更新法线
  geometry.computeVertexNormals()

  // 标记需要更新
  geometry.attributes.position.needsUpdate = true
  if (geometry.index) geometry.index.needsUpdate = true
  geometry.attributes.normal.needsUpdate = true
}
