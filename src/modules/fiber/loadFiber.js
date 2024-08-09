import * as THREE from 'three'
import { useSceneStoreHook } from '@/store/useSceneStore'

const { getSceneExtra } = useSceneStoreHook()

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

export const loadFiber = (url) => {
  return new Promise((resolve, reject) => {
    const fiberVectors = []
    const sceneExtra = getSceneExtra()
    loadFile(url)
      .then((data) => {
        // 每一行表示一条线
        const regExp = /\n/g
        const dataRow = data.split(regExp)
        // 最后一个是空的，所以去掉
        dataRow.pop()
        dataRow.forEach((data) => {
          // 每3个数字组成一个点的坐标
          const points = data.trim().split(/\s/)
          let lineVectors = []
          for (let i = 0; i < points.length; i = i + 3) {
            let vector = new THREE.Vector3(
              Number(points[i]),
              Number(points[i + 1]),
              Number(points[i + 2])
            )
            lineVectors.push(vector)
          }
          const curve = new THREE.CatmullRomCurve3(lineVectors)
          const len = lineVectors.length
          const newLineVectors = []
          for (let i = 0; i < len; i += 3) {
            const vec = curve.getPointAt(i / len)
            vec.applyMatrix4(sceneExtra.MNI152_template)
            vec.applyMatrix4(sceneExtra.ras2xyz)
            const x = parseFloat(vec.x.toFixed(3))
            const y = parseFloat(vec.y.toFixed(3))
            const z = parseFloat(vec.z.toFixed(3))
            newLineVectors.push(new THREE.Vector3(x, y, z))
          }
          fiberVectors.push(newLineVectors)
        })
        resolve(fiberVectors)
      })
      .catch(reject)
  })
}
