import { buildFaceNet } from './buildFaceNet'

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

// 调整三角形面的法线方向，使得所有相邻面的法线一致
// 修正后的 unifyFaceNormals 方法
export const unifyNormals = (polygons, points) => {
  const faceNet = buildFaceNet(polygons, points)
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
      // 检查相邻面法线方向是否一致
      const areSameDirection = isNormalDirectionConsistent(currentNormal, neighbor.normal)
      if (!areSameDirection) {
        const [a, b, c] = neighbor.vertices
        // 如果不一致，调整相邻面的顶点顺序来翻转法线
        // 更新相邻面的法线，使用翻转后的顶点
        neighbor.vertices = [c, b, a]
        neighbor.normal = reverseNormal(neighbor.normal)
      }
      // 将相邻面加入队列并标记为已访问
      queue.push(neighbor)
      visited.add(neighborIndex)
    }
  }
  console.log('visited.size', visited.size)
  const correctPolygons = faceNet.map((face) => face.vertices)
  return correctPolygons
}
