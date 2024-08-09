import * as THREE from 'three'

const calcColors = (curve, len, lightness = 0.6) => {
  const colors = []

  // 提前创建向量并复用
  const x = new THREE.Vector3(1, 0, 0)
  const y = new THREE.Vector3(0, 1, 0)
  const z = new THREE.Vector3(0, 0, 1)

  // 计算向量长度，只需计算一次
  const xLength = x.length()
  const yLength = y.length()
  const zLength = z.length()

  for (let i = 0; i < len; i++) {
    const t = curve.getTangentAt(i / (len - 1)).normalize()

    // 预计算 t 的长度以复用
    const tLength = t.length()

    // 计算各个轴的角度值
    let xAngle = (Math.abs(t.dot(x)) / (tLength * xLength)) * lightness
    let yAngle = (Math.abs(t.dot(y)) / (tLength * yLength)) * lightness
    let zAngle = (Math.abs(t.dot(z)) / (tLength * zLength)) * lightness

    // 将计算结果添加到 colors 数组中
    colors.push(xAngle, zAngle, yAngle)
  }

  return colors
}

const lineMat = new THREE.LineBasicMaterial({ vertexColors: true })

export const renderFiber = (vectors) => {
  const curve = new THREE.CatmullRomCurve3(vectors)
  const len = vectors.length
  const colors = calcColors(curve, len)
  const positions = []
  for (let i = 0; i < len; i++) {
    let v = curve.getPointAt(i / (len - 1))
    positions.push(v.x, v.y, v.z)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const line = new THREE.Line(geometry, lineMat)
  return line
}
