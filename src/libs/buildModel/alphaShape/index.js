import createWasm from './wasm/alphaShape.js'

let alphaShapeWasm = null

export const initAlphaShapeWasm = () => {
  return new Promise((resolve, reject) => {
    createWasm()
      .then((Module) => {
        alphaShapeWasm = (points, alpha = 1) => {
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
          let tetrahedraPtr = Module._alphaShape(pointsPtr, numPoints, alpha, outNumTetrahedraPtr)

          // 读取输出的四面体数量
          let numFaces = Module.HEAP32[outNumTetrahedraPtr >> 2]

          // 读取并打印四面体的点索引
          let tetrahedra = new Int32Array(Module.HEAP32.buffer, tetrahedraPtr, numFaces * 3)

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

export const alphaShape = (points, alpha) => {
  const results = alphaShapeWasm(points, alpha)
  const faces = []
  for (let i = 0; i < results.length; i += 3) {
    faces.push([results[i], results[i + 1], results[i + 2]])
  }
  return faces
}
