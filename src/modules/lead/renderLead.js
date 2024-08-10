import * as THREE from 'three'
import { createPoleMaterial, createChipMaterial } from './leadMat'

// 根据触点坐标，添加导线首末坐标
const adjustCurveMatrix = (leadPoints, leadLen) => {
  const curve = new THREE.CatmullRomCurve3(leadPoints)
  // 直线的方向向量
  const tangent = curve.getTangentAt(1)
  const endPoint = curve.getPointAt(0)
  const BottomPoint = endPoint.clone()
  // 电极长度 = 切线向量 * 电极长度
  const TopPoint = BottomPoint.clone().addScaledVector(tangent, leadLen)
  return [BottomPoint, TopPoint]
}

// 生成电极柱模型
const renderPole = (leadCurvePoints, radius = 1.27 / 2) => {
  // 样条曲线
  const curve = new THREE.CatmullRomCurve3(leadCurvePoints)
  // 扫描形状
  const circle = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, true)
  const points = circle.getPoints(128)
  const shape = new THREE.Shape(points)
  // 扫描成型
  const geometry = new THREE.ExtrudeGeometry(shape, {
    extrudePath: curve,
    steps: 12,
  })
  const mesh = new THREE.Mesh(geometry, createPoleMaterial())
  mesh.name = 'pole'
  return mesh
}

// 生成底部半球
const renderHalfBall = (leadCurvePoints, radius = 1.27 / 2) => {
  const curve = new THREE.CatmullRomCurve3(leadCurvePoints)
  const startPoint = curve.getPointAt(0)
  // 开始点到结束点的一个向量
  const tangent = curve.getTangentAt(0)
  // 生成一个反方向向量 -0.5随机数 表示方向相反
  const endPoint = startPoint.clone().addScaledVector(tangent, -0.5)
  const ball = new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI, 0, Math.PI)
  const mesh = new THREE.Mesh(ball, createPoleMaterial())
  mesh.position.x = startPoint.x
  mesh.position.y = startPoint.y
  mesh.position.z = startPoint.z
  mesh.lookAt(endPoint)
  return mesh
}

// 生成环状电极
const renderCircleChips = (lead) => {
  const { leadPoints, leadLen, gap, number, len, radius, chips } = lead
  const positions = adjustCurveMatrix(leadPoints, leadLen)
  const curve = new THREE.CatmullRomCurve3(positions)
  let startPos = 0
  const chipArr = []
  for (let i = 0; i < number; i++) {
    // 计算前面的间距总和
    // 电极片起始点的位置 = firstChipDistance + 电极片长度 * (index) + 电极片间距 * (index)
    if (i === 0) {
      startPos += 1
    } else {
      const chipGap = gap[i - 1]
      startPos += chipGap + len
    }

    // 电极片结束点的位置 = 起始点的位置 + 电极片长度
    const endPos = startPos + len
    // 根据起始点百分比，获取点的位置，成线
    const startPoint = curve.getPointAt(startPos / leadLen)
    const endPoint = curve.getPointAt(endPos / leadLen)

    // p1 p2线段沿着Y轴旋转成体
    const p1 = new THREE.Vector2(radius + 0.02, -len / 2)
    const p2 = new THREE.Vector2(radius + 0.02, len / 2)
    const geometry = new THREE.LatheGeometry([p1, p2], 36, 0, Math.PI * 2)

    // 贴图的高度需要根据chipConfig来调整，防止文字被压扁
    const k = len / 3
    const num = chips[i].index
    const mesh = new THREE.Mesh(geometry, createChipMaterial(400, 400 * k, num, 60))
    chips[i].mesh = mesh
    mesh.name = 'chip'
    mesh.updateWorldMatrix(true, true)

    // 为电极定义额外数据
    const userData = {
      index: num,
      node: chips[i].node,
      position: lead.position,
    }
    mesh.userData = userData

    // 给电极片定位
    const centerPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5)
    mesh.position.x = centerPoint.x
    mesh.position.y = centerPoint.y
    mesh.position.z = centerPoint.z

    // 矫正方向
    const direction = curve.getTangentAt(1)
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(mesh.up, direction)
    mesh.quaternion.copy(quaternion)

    // 还要绕导线的方向旋转PI, 贴图默认朝向内侧，旋转180度朝向屏幕
    mesh.rotateOnWorldAxis(direction.normalize(), Math.PI / 2)
    chipArr.push(mesh)
  }

  return chipArr
}

// 渲染导线
export const renderLead = (lead) => {
  // 将其转换为vector3
  const { leadPoints, leadLen } = lead
  // 将其转换为vector3
  const lead2Points = adjustCurveMatrix(leadPoints, leadLen)
  const pole = renderPole(lead2Points)
  const halfBall = renderHalfBall(lead2Points)
  const group = new THREE.Group()
  group.add(pole)
  group.add(halfBall)
  return group
}

// 根据lead类型来生成电极：环状、分片
export const renderChips = (lead) => {
  return renderCircleChips(lead)
}
