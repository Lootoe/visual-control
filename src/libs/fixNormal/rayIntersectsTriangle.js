export function rayIntersectsTriangle(origin, direction, triangle) {
  const [A, B, C] = triangle
  const EPSILON = 1e-9

  // 预计算三角形的边向量
  const edge1x = B[0] - A[0]
  const edge1y = B[1] - A[1]
  const edge1z = B[2] - A[2]

  const edge2x = C[0] - A[0]
  const edge2y = C[1] - A[1]
  const edge2z = C[2] - A[2]

  // 计算射线方向与 edge2 的叉积
  const hx = direction[1] * edge2z - direction[2] * edge2y
  const hy = direction[2] * edge2x - direction[0] * edge2z
  const hz = direction[0] * edge2y - direction[1] * edge2x

  // 计算 edge1 和 h 的点积
  const a = edge1x * hx + edge1y * hy + edge1z * hz

  // 检查射线与三角形是否平行
  if (Math.abs(a) < EPSILON) return false

  const f = 1.0 / a

  // 计算原点到三角形顶点 A 的向量
  const sx = origin[0] - A[0]
  const sy = origin[1] - A[1]
  const sz = origin[2] - A[2]

  // 计算 u 参数，提前进行边界检查
  const u = f * (sx * hx + sy * hy + sz * hz)
  if (u < 0.0 || u > 1.0) return false

  // 计算 s 和 edge1 的叉积
  const qx = sy * edge1z - sz * edge1y
  const qy = sz * edge1x - sx * edge1z
  const qz = sx * edge1y - sy * edge1x

  // 计算 v 参数，提前进行边界检查
  const v = f * (direction[0] * qx + direction[1] * qy + direction[2] * qz)
  if (v < 0.0 || u + v > 1.0) return false

  // 计算 t 参数
  const t = f * (edge2x * qx + edge2y * qy + edge2z * qz)

  // 返回结果，减少额外运算
  return t > EPSILON
}
