import { initDelaunayWasm, delaunay } from './delaunay.js'
import { calcTetRadius } from './calcTetRadius.js'
import { getOutterFace } from './getOutterFace.js'
import { unifyNormal } from '@/libs/fixNormal'

const alphaShape = (points, alpha = 1) => {
  console.time('四面体剖分耗时')
  const tetras = delaunay(points)
  console.timeEnd('四面体剖分耗时')
  console.time('AlphaShape耗时')
  const alphaTetras = []
  tetras.forEach((t) => {
    const radius = calcTetRadius(t, points)
    if (radius <= alpha && radius > 0) {
      alphaTetras.push(t)
    }
  })
  // 计算每个四面体的外接球半径，判断它是否满足alpha形状的条件
  // 每个四面体按照定点顺序都有四个三角面片
  const faces = []
  alphaTetras.forEach((tetra) => {
    const [a, b, c, d] = tetra
    faces.push([a, b, c])
    faces.push([a, c, d])
    faces.push([a, d, b])
    faces.push([b, c, d])
  })
  console.timeEnd('AlphaShape耗时')
  const polygons = getOutterFace(faces)
  console.time('法线一致化耗时')
  const correctPolygons = unifyNormal(polygons, points)
  console.timeEnd('法线一致化耗时')
  return correctPolygons
}

export { initDelaunayWasm, alphaShape }
