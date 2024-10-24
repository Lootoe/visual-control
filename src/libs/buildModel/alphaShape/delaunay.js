import createDelaunayWasm from './tetgen.js'

let delaunayWasm = null

export const initDelaunayWasm = () => {
  return new Promise((resolve, reject) => {
    createDelaunayWasm()
      .then((Module) => {
        delaunayWasm = (points) => {
          // 获取点数量
          let numPoints = points.length

          // 将传入的JS数组(points)转换为 Float64Array
          let vertices = new Float64Array(numPoints * 3)
          for (let i = 0; i < numPoints; i++) {
            vertices[i * 3] = points[i][0] // x 坐标
            vertices[i * 3 + 1] = points[i][1] // y 坐标
            vertices[i * 3 + 2] = points[i][2] // z 坐标
          }

          // 为 vertices 分配堆内存并复制数据
          let pointsPtr = Module._malloc(vertices.length * vertices.BYTES_PER_ELEMENT)
          Module.HEAPF64.set(vertices, pointsPtr / vertices.BYTES_PER_ELEMENT)

          // 为四面体数量分配内存
          let outNumTetrahedraPtr = Module._malloc(4) // 4 字节用于存储整数

          // 调用 C++ 封装的函数
          let tetrahedraPtr = Module._delaunay(pointsPtr, numPoints, outNumTetrahedraPtr)

          // 读取输出的四面体数量
          let numTetrahedra = Module.HEAP32[outNumTetrahedraPtr >> 2]

          // 读取并打印四面体的点索引
          let tetrahedra = new Int32Array(Module.HEAP32.buffer, tetrahedraPtr, numTetrahedra * 4)

          // 释放内存
          Module._free(pointsPtr)
          Module._free(tetrahedraPtr)
          Module._free(outNumTetrahedraPtr)

          // 返回四面体剖分结果
          return tetrahedra
        }
        resolve()
      })
      .catch(reject)
  })
}

export const delaunay = (points) => {
  const indexes = delaunayWasm(points)
  // 每四个顶点作为一个斯迈纳提
  const tetrahedra = []
  for (let i = 0; i < indexes.length; i += 4) {
    tetrahedra.push(indexes.slice(i, i + 4))
  }
  return tetrahedra
}
