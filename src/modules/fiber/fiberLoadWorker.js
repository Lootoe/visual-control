import * as THREE from 'three'

const isFlag = (str) => {
  const flagReg = /#v\d+/
  const isNewVersion = flagReg.test(str)
  // const res = str.match(flagReg)
  // const version = res[0].split('#v')[1]
  return isNewVersion
}

const loadFile = (url) => {
  return new Promise((resolve, reject) => {
    const fileloadr = new THREE.FileLoader()
    fileloadr.load(
      url,
      (data) => {
        resolve(data)
      },
      null,
      reject
    )
  })
}

async function loadFiber({ url, globalAffine }) {
  loadFile(url).then((rowData) => {
    // 每一行表示一条线
    const regExp = /\n/g
    const fiberStrArr = rowData.split(regExp)
    // 最后一个是空的，所以去掉
    fiberStrArr.pop()
    const isNewVersion = isFlag(fiberStrArr[0])
    if (isNewVersion) {
      fiberStrArr.shift()
    }
    const fibers = []
    const m4 = new THREE.Matrix4(-1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1)
    fiberStrArr.forEach((fiberStr) => {
      if (isNewVersion) {
        let vectors = []
        const points = fiberStr.trim().split(/\s/)
        for (let i = 0; i < points.length; i = i + 3) {
          let vector = [Number(points[i]), Number(points[i + 1]), Number(points[i + 2])]
          vectors.push(vector)
        }
        fibers.push(vectors)
      } else {
        // 每3个数字组成一个点的坐标
        let vectors = []
        const points = fiberStr.trim().split(/\s/)
        for (let i = 0; i < points.length; i = i + 3) {
          let vector = new THREE.Vector3(
            Number(points[i]),
            Number(points[i + 1]),
            Number(points[i + 2])
          )
          vector.applyMatrix4(globalAffine)
          vector.applyMatrix4(m4)
          vectors.push(vector.toArray())
        }
        fibers.push(vectors)
      }
    })
    const arrayBuffer = objectToArrayBuffer(fibers)
    self.postMessage(arrayBuffer, [arrayBuffer.buffer])
    self.close()
  })
}

self.addEventListener('message', (e) => {
  loadFiber(e.data)
})

function objectToArrayBuffer(obj) {
  // 将对象序列化为 JSON 字符串
  const jsonString = JSON.stringify(obj)

  // 将字符串转换为 Uint8Array
  const encoder = new TextEncoder()
  const uint8Array = encoder.encode(jsonString)

  // 返回 Uint8Array 的缓冲区
  return uint8Array
}
