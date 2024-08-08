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

export const loadMatrix = (url) => {
  return new Promise((resolve, reject) => {
    loadFile(url)
      .then((data) => {
        const reg = /\s/g
        let arr = data.split(reg)
        arr = arr.filter((v) => !!v && v !== '')
        // 去除末尾的空字符串
        const affine = new THREE.Matrix4()
        const numbers = arr.map((v) => Number(v))
        affine.set(...numbers)
        resolve(affine)
      })
      .catch(reject)
  })
}
