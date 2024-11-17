import fiberLoadWorker from './fiberLoadWorker.js?worker'

import useSceneStoreHook from '@/store/useSceneStore'

const sceneStore = useSceneStoreHook()

const loadFiberInWorker = (worker, params) => {
  return new Promise((resolve, reject) => {
    try {
      worker.onmessage = (e) => {
        worker.terminate()
        resolve(e.data)
      }
      worker.postMessage(params)
    } catch (error) {
      reject(error)
    }
  })
}

const arrayBufferToObject = (buffer) => {
  // 使用 TextDecoder 将 ArrayBuffer 转换为字符串
  const decoder = new TextDecoder()
  const jsonString = decoder.decode(new Uint8Array(buffer))

  // 将 JSON 字符串解析为对象
  return JSON.parse(jsonString)
}

export const loadFiber = (fiberUrlList) => {
  return new Promise((resolve, reject) => {
    const loadFiberTask = []
    for (let i = 0; i < fiberUrlList.length; i++) {
      const worker = new fiberLoadWorker({ type: 'module' })
      const task = loadFiberInWorker(worker, {
        url: fiberUrlList[i],
        globalAffine: sceneStore.extraData.MNI152_template,
      })
      loadFiberTask.push(task)
    }
    const workerResult = []
    Promise.all(loadFiberTask)
      .then((resultArr) => {
        resultArr.forEach((result) => {
          const arr = arrayBufferToObject(result)
          workerResult.push(...arr)
        })
        const fiberPool = workerResult.map((fiber, index) => {
          const obj = {
            vectors: fiber,
            index,
          }
          return obj
        })
        resolve(fiberPool)
      })
      .catch(reject)
  })
}
