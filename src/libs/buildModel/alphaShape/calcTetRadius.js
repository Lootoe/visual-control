// 计算四面体的外接球圆心
function tetCircumcenter(a, b, c, d) {
  // 计算向量 b-a, c-a, d-a
  const xba = b[0] - a[0],
    yba = b[1] - a[1],
    zba = b[2] - a[2]
  const xca = c[0] - a[0],
    yca = c[1] - a[1],
    zca = c[2] - a[2]
  const xda = d[0] - a[0],
    yda = d[1] - a[1],
    zda = d[2] - a[2]

  // 计算长度平方
  const balength = xba * xba + yba * yba + zba * zba
  const calength = xca * xca + yca * yca + zca * zca
  const dalength = xda * xda + yda * yda + zda * zda

  // 叉积计算
  const xcrosscd = yca * zda - yda * zca
  const ycrosscd = zca * xda - zda * xca
  const zcrosscd = xca * yda - xda * yca

  const xcrossdb = yda * zba - yba * zda
  const ycrossdb = zda * xba - zba * xda
  const zcrossdb = xda * yba - xba * yda

  const xcrossbc = yba * zca - yca * zba
  const ycrossbc = zba * xca - zca * xba
  const zcrossbc = xba * yca - xca * yba

  // 分母计算
  let denominator = 0.5 / (xba * xcrosscd + yba * ycrosscd + zba * zcrosscd)

  // 计算外接球圆心的偏移量
  const xcirca = (balength * xcrosscd + calength * xcrossdb + dalength * xcrossbc) * denominator
  const ycirca = (balength * ycrosscd + calength * ycrossdb + dalength * ycrossbc) * denominator
  const zcirca = (balength * zcrosscd + calength * zcrossdb + dalength * zcrossbc) * denominator

  const xCenter = xcirca + a[0]
  const yCenter = ycirca + a[1]
  const zCenter = zcirca + a[2]
  return [xCenter, yCenter, zCenter]
}

// orient3d 实现（用于计算四点的排列顺序）
function orient3d(a, b, c, d) {
  const xba = b[0] - a[0],
    yba = b[1] - a[1],
    zba = b[2] - a[2]
  const xca = c[0] - a[0],
    yca = c[1] - a[1],
    zca = c[2] - a[2]
  const xda = d[0] - a[0],
    yda = d[1] - a[1],
    zda = d[2] - a[2]

  return (
    xba * (yca * zda - zca * yda) - yba * (xca * zda - zca * xda) + zba * (xca * yda - yca * xda)
  )
}

function tetCircumCenter(a, b, c, d) {
  const orient = orient3d(a, b, c, d)
  if (orient < 0.0) {
    return tetCircumcenter(a, c, b, d)
  } else {
    return tetCircumcenter(a, b, c, d)
  }
}

// 计算两个三维点之间的距离
// 点使用数组表示
function distance(p1, p2) {
  return Math.sqrt(
    Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2)
  )
}

export function calcTetRadius(indexes, points) {
  const vertices = []
  indexes.forEach((index) => {
    vertices.push(points[index])
  })
  const center = tetCircumCenter(...vertices)
  const radius = distance(center, vertices[0])
  return radius
}
