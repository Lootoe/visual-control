import { toPolygon } from './toPolygon'
import { unifyNormal } from './unifyNormal'
import * as THREE from 'three'

export function unifyNormalFromGeometry(geometry) {
  const { points, polygon } = toPolygon(geometry)
  // unifyNormal将polygon中的顶点顺序全都调整为正确的顺序了
  const correctPolygon = unifyNormal(polygon, points)
  // 根据新的顶点顺序，修改原来的geometry
  if (geometry.index) {
    // geometry 有索引，用新的顶点顺序替换旧的索引
    const indexArray = geometry.index.array

    // 遍历 correctPolygon，重新设置 geometry 的索引
    for (let i = 0; i < correctPolygon.length; i++) {
      const [a, b, c] = correctPolygon[i]
      indexArray[i * 3] = a
      indexArray[i * 3 + 1] = b
      indexArray[i * 3 + 2] = c
    }
    // 标记索引属性需要更新
    geometry.index.needsUpdate = true
  } else {
    // 如果 geometry 没有索引，需要直接根据 correctPolygon 重排顶点
    const positionArray = geometry.attributes.position.array
    const newPositionArray = []

    // 遍历 correctPolygon，根据新顺序重排 positionArray
    correctPolygon.forEach((triangle) => {
      triangle.forEach((index) => {
        newPositionArray.push(
          positionArray[index * 3],
          positionArray[index * 3 + 1],
          positionArray[index * 3 + 2]
        )
      })
    })

    // 更新 geometry 的 position 属性
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositionArray, 3))

    // 标记顶点属性需要更新
    geometry.attributes.position.needsUpdate = true
  }
}
