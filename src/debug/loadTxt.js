import * as THREE from 'three'

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

export const loadTxt = (url) => {
  return new Promise((resolve, reject) => {
    loadFile(url)
      .then((data) => {
        // 先将每个点区分开
        const reg = /\n/g
        const arr = data.split(reg)
        const arr_notEmpty = arr.filter((v) => v !== '')
        // 再将点取出来，并且得到它的阈值
        const points = []
        const values = []
        arr_notEmpty.forEach((v) => {
          const [a, b, c, strength] = v.split(',')
          // 如果是NaN值，就不管
          const hasNaN = isNaN(a) || isNaN(b) || isNaN(c) || isNaN(strength)
          if (!hasNaN) {
            points.push([parseFloat(a), parseFloat(b), parseFloat(c)])
            values.push(parseFloat(strength))
          }
        })
        resolve({ points, values })
      })
      .catch(reject)
  })
}
