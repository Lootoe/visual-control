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
const renderPole = (leadCurvePoints, radius = 1.27 / 2, seq = 128, step = 12) => {
  // 样条曲线
  const curve = new THREE.CatmullRomCurve3(leadCurvePoints)
  // 扫描形状
  const circle = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, true)
  const points = circle.getPoints(seq)
  const shape = new THREE.Shape(points)
  // 扫描成型
  const geometry = new THREE.ExtrudeGeometry(shape, {
    extrudePath: curve,
    steps: step,
  })
  return geometry
}

// 生成底部半球
const renderHalfBall = (leadCurvePoints, radius = 1.27 / 2) => {
  const curve = new THREE.CatmullRomCurve3(leadCurvePoints)
  const startPoint = curve.getPointAt(0)
  const tangent = curve.getTangentAt(0)

  // 创建球体几何体
  const ball = new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI, 0, Math.PI)

  // 创建一个矩阵并根据tangent方向进行旋转
  const matrix = new THREE.Matrix4()

  // 设置朝向
  matrix.lookAt(startPoint, startPoint.clone().add(tangent), new THREE.Vector3(0, 1, 0))

  // 应用旋转矩阵到球体几何体
  ball.applyMatrix4(matrix)

  // 移动球体几何体到startPoint位置
  ball.translate(startPoint.x, startPoint.y, startPoint.z)

  return ball
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

    // 给电极片定位
    const centerPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, 0.5)

    // 补电极用的圆柱
    const electricGeo = renderPole([startPoint, endPoint], radius + 0.04, 64, 6)

    // 创建一个变换矩阵，用于顶点变换
    const transformMatrix = new THREE.Matrix4()

    // 平移矩阵，将顶点移动到目标位置
    transformMatrix.makeTranslation(centerPoint.x, centerPoint.y, centerPoint.z)

    // 计算旋转方向
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint).normalize()
    const up = new THREE.Vector3(0, 1, 0)

    // 计算电极片朝向的四元数
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(up, direction)

    // 将四元数围绕direction旋转2/PI,目的是使文字朝向用户
    quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2))

    // 将四元数转换为旋转矩阵
    const rotationMatrix = new THREE.Matrix4()
    rotationMatrix.makeRotationFromQuaternion(quaternion)

    // 将旋转矩阵和平移矩阵组合
    transformMatrix.multiply(rotationMatrix)

    // 将变换矩阵应用于几何体的每个顶点
    geometry.applyMatrix4(transformMatrix)

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
      electricGeo,
    }
    mesh.userData = userData
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
  const poleMesh = new THREE.Mesh(pole, createPoleMaterial())
  poleMesh.name = 'pole'
  const halfBall = renderHalfBall(lead2Points)
  const halfBallMesh = new THREE.Mesh(halfBall, createPoleMaterial())
  halfBallMesh.name = 'halfBall'
  const group = new THREE.Group()
  group.add(poleMesh, halfBallMesh)
  return group
}

// 根据lead类型来生成电极：环状、分片
export const renderChips = (lead) => {
  return renderCircleChips(lead)
}
