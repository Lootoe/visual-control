import * as THREE from 'three'
import { edgeTable, triTable } from './marchingCubeTable'

const interpolate = (isolevel, p1, p2, valp1, valp2) => {
  const mu = (isolevel - valp1) / (valp2 - valp1)
  return new THREE.Vector3(
    p1.x + mu * (p2.x - p1.x),
    p1.y + mu * (p2.y - p1.y),
    p1.z + mu * (p2.z - p1.z)
  )
}

// 根据IJK(x,y,z)计算等值面类型
// 等值面类型可以在triTable中找到对应的三角形
const calcCubeIndex = (x, y, z, values, isolevel, colLength, rowLength, depth, step) => {
  // 计算当前立方体体素的索引
  const indices = [
    { dx: 0, dy: 0, dz: 0, mask: 1 },
    { dx: step, dy: 0, dz: 0, mask: 2 },
    { dx: step, dy: step, dz: 0, mask: 4 },
    { dx: 0, dy: step, dz: 0, mask: 8 },
    { dx: 0, dy: 0, dz: step, mask: 16 },
    { dx: step, dy: 0, dz: step, mask: 32 },
    { dx: step, dy: step, dz: step, mask: 64 },
    { dx: 0, dy: step, dz: step, mask: 128 },
  ]
  let cubeIndex = 0
  indices.forEach(({ dx, dy, dz, mask }) => {
    const ix = x + dx
    const iy = y + dy
    const iz = z + dz
    if (
      ix < colLength &&
      iy < rowLength &&
      iz < depth &&
      values[ix + iy * colLength + iz * colLength * rowLength] < isolevel
    ) {
      cubeIndex |= mask
    }
  })

  return cubeIndex
}

const getVertexIndex = (x, y, z, colLength, rowLength) =>
  x + y * colLength + z * colLength * rowLength

// 根据ijk计算体素的12条边上，哪些边需要插值
// 我们后续会根据这些边上的点，来生成三角面片
const getVertexList = (
  x,
  y,
  z,
  colLength,
  rowLength,
  depth,
  isolevel,
  points,
  values,
  edges,
  step
) => {
  const vertList = new Array(12)
  const edgeVertices = [
    [
      [0, 0, 0],
      [step, 0, 0],
    ],
    [
      [step, 0, 0],
      [step, step, 0],
    ],
    [
      [step, step, 0],
      [0, step, 0],
    ],
    [
      [0, step, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, step],
      [step, 0, step],
    ],
    [
      [step, 0, step],
      [step, step, step],
    ],
    [
      [step, step, step],
      [0, step, step],
    ],
    [
      [0, step, step],
      [0, 0, step],
    ],
    [
      [0, 0, 0],
      [0, 0, step],
    ],
    [
      [step, 0, 0],
      [step, 0, step],
    ],
    [
      [step, step, 0],
      [step, step, step],
    ],
    [
      [0, step, 0],
      [0, step, step],
    ],
  ]

  edgeVertices.forEach(([start, end], i) => {
    if (edges & (1 << i)) {
      const [sx, sy, sz] = start
      const [ex, ey, ez] = end
      vertList[i] = interpolate(
        isolevel,
        points[getVertexIndex(x + sx, y + sy, z + sz, colLength, rowLength)],
        points[getVertexIndex(x + ex, y + ey, z + ez, colLength, rowLength)],
        values[getVertexIndex(x + sx, y + sy, z + sz, colLength, rowLength)],
        values[getVertexIndex(x + ex, y + ey, z + ez, colLength, rowLength)]
      )
    }
  })

  return vertList
}

export const calcTriangles = (field, isolevel, step) => {
  const { shape, points, values } = field
  const [colLength, rowLength, depth] = shape
  const trianlges = []

  // 遍历每个立方体
  for (let z = 0; z < depth - step; z += step) {
    for (let y = 0; y < rowLength - step; y += step) {
      for (let x = 0; x < colLength - step; x += step) {
        const cubeIndex = calcCubeIndex(
          x,
          y,
          z,
          values,
          isolevel,
          colLength,
          rowLength,
          depth,
          step
        )

        // 查找边表，判断当前立方体哪些边被穿过
        const edges = edgeTable[cubeIndex]
        if (edges === 0) continue

        // 计算每条被穿过的边的顶点位置
        const vertList = getVertexList(
          x,
          y,
          z,
          colLength,
          rowLength,
          depth,
          isolevel,
          points,
          values,
          edges,
          step
        )

        // 绘制三角形
        for (let i = 0; triTable[cubeIndex][i] !== -1; i += 3) {
          const v1 = vertList[triTable[cubeIndex][i]]
          const v2 = vertList[triTable[cubeIndex][i + 1]]
          const v3 = vertList[triTable[cubeIndex][i + 2]]
          trianlges.push(v1, v2, v3)
        }
      }
    }
  }
  return trianlges
}

// 筛选出散点的表面点，并重建成Geometry
export const marchingCubes = (vtaData, isoLevel, step = 1) => {
  let trianglePoints = calcTriangles(vtaData, isoLevel, step)
  const vertices = Array(3 * trianglePoints.length).fill(0)
  for (let i = 0; i < trianglePoints.length; i++) {
    const x = trianglePoints[i].x
    const y = trianglePoints[i].y
    const z = trianglePoints[i].z
    vertices[i * 3] = x
    vertices[i * 3 + 1] = y
    vertices[i * 3 + 2] = z
  }
  let geo = new THREE.BufferGeometry()
  const positionAttribute = new THREE.Float32BufferAttribute(vertices, 3)
  geo.setAttribute('position', positionAttribute)
  return geo
}
