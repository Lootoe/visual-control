import { delaunay } from './delaunay.js'
import { calcTetRadius } from './calcTetRadius.js'
import { getOutterFace } from './getOutterFace.js'
import { buildFaceNet, unifyFaceNormals } from './buildFaceNet.js'

export const alphaShape = (points, alpha = 1) => {
  return new Promise((resolve, reject) => {
    delaunay(points)
      .then((tetras) => {
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
        const polygons = getOutterFace(faces)
        const net = buildFaceNet(polygons, points)
        unifyFaceNormals(net, points)
        const correctPolygons = net.map((face) => face.vertices)
        resolve(correctPolygons)
      })
      .catch(reject)
  })
}
