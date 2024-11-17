import * as THREE from 'three'

const calcColors = (curve, len, tangent, x, y, z) => {
  const colors = []
  const factor = 0.6 // 将乘法因子提取出循环

  for (let i = 0; i < len; i++) {
    tangent.copy(curve.getTangentAt(i / (len - 1))).normalize()
    // 使用乘法因子并减少临时变量
    colors.push(
      Math.abs(tangent.dot(x)) * factor,
      Math.abs(tangent.dot(z)) * factor,
      Math.abs(tangent.dot(y)) * factor
    )
  }
  return colors
}

// 优化后的 renderFiberInOneMesh 函数
export const renderFiberInOneMesh = (sourceFibers) => {
  const allPositions = []
  const allColors = []
  const tangent = new THREE.Vector3() // 重用tangent对象
  const x = new THREE.Vector3(1, 0, 0)
  const y = new THREE.Vector3(0, 1, 0)
  const z = new THREE.Vector3(0, 0, 1)

  for (const arr of sourceFibers) {
    const vectors = arr.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    const curve = new THREE.CatmullRomCurve3(vectors)
    const len = vectors.length
    const colors = calcColors(curve, len, tangent, x, y, z)

    for (let i = 0; i < len; i++) {
      const v = curve.getPointAt(i / (len - 1))
      allPositions.push(v.x, v.y, v.z)
    }

    allColors.push(...colors)
    allPositions.push(NaN, NaN, NaN) // 截断纤维
    allColors.push(0, 0, 0)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(allPositions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(allColors, 3))

  return new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: true }))
}
