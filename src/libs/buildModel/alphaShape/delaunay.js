import createAlphaShapeWasm from './tetgen.js'

let alphaShapeWasm = null

export const initAlphaShapeWasm = () => {
  return new Promise((resolve, reject) => {
    createAlphaShapeWasm()
      .then((Module) => {
        alphaShapeWasm = (points, alpha) => {
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

          // 为三角面数量分配内存
          let outNumFacesPtr = Module._malloc(4) // 4 字节用于存储整数

          // 调用 C++ 封装的 alphaShape 函数
          let facesPtr = Module._alphaShape(pointsPtr, numPoints, alpha, outNumFacesPtr)

          // 读取输出的三角面数量
          let numFaces = Module.HEAP32[outNumFacesPtr >> 2]

          // 读取并打印三角面的点索引，每个面有 3 个点
          let faces = new Int32Array(Module.HEAP32.buffer, facesPtr, numFaces * 3)

          // 释放内存
          Module._free(pointsPtr)
          Module._free(facesPtr)
          Module._free(outNumFacesPtr)

          // 返回 alphaShape 结果
          return faces
        }
        resolve()
      })
      .catch(reject)
  })
}

export const delaunay = (points, alpha) => {
  const results = alphaShapeWasm(points, alpha)
  const faces = []
  for (let i = 0; i < results.length; i += 3) {
    faces.push([results[i], results[i + 1], results[i + 2]])
  }
  return faces
}
