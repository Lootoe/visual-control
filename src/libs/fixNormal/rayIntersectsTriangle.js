export function rayIntersectsTriangle(origin, direction, triangle) {
  const [A, B, C] = triangle
  const EPSILON = 1e-9
  // EPSILON用于处理浮点数误差问题

  // 计算三角形的边向量
  const edge1 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]]

  const edge2 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]]

  // 计算射线方向与三角形的一条边的叉积
  const h = [
    direction[1] * edge2[2] - direction[2] * edge2[1],
    direction[2] * edge2[0] - direction[0] * edge2[2],
    direction[0] * edge2[1] - direction[1] * edge2[0],
  ]

  // 计算 edge1 和 h 的点积
  const a = edge1[0] * h[0] + edge1[1] * h[1] + edge1[2] * h[2]

  // 如果 a 近似为 0，则射线与三角形平行
  if (a > -EPSILON && a < EPSILON) return false

  const f = 1.0 / a
  const s = [origin[0] - A[0], origin[1] - A[1], origin[2] - A[2]]

  // 计算 u 参数
  const u = f * (s[0] * h[0] + s[1] * h[1] + s[2] * h[2])
  if (u < 0.0 || u > 1.0) return false

  // 计算 s 和 edge1 的叉积
  const q = [
    s[1] * edge1[2] - s[2] * edge1[1],
    s[2] * edge1[0] - s[0] * edge1[2],
    s[0] * edge1[1] - s[1] * edge1[0],
  ]

  // 计算 v 参数
  const v = f * (direction[0] * q[0] + direction[1] * q[1] + direction[2] * q[2])
  if (v < 0.0 || u + v > 1.0) return false

  // 计算 t，即交点距离射线起点的距离
  const t = f * (edge2[0] * q[0] + edge2[1] * q[1] + edge2[2] * q[2])

  // 如果 t 大于 EPSILON，说明交点位于射线的正方向上
  if (t > EPSILON) {
    return true // 射线与三角形相交
  } else {
    return false // 交点在射线的反方向
  }
}
