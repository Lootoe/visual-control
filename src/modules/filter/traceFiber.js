import { removeMesh, addMesh } from '@/modules/scene'
import useFilterStoreHook from '@/store/useFilterStore'
import useFiberStoreHook from '@/store/useFiberStore'
import { renderFiberInOneMesh, loadFiber } from '@/modules/fiber'
import fiberTraverseWorker from './fiberTraverseWorker.js?worker'
import usePatientStoreHook from '@/store/usePatientStore'

const fiberStore = useFiberStoreHook()
const filterStore = useFilterStoreHook()
const patientStore = usePatientStoreHook()

// 拆解PLY模型
const splitPLY = (ply) => {
  const data = {
    vertices: Array.from(ply.attributes.position.array),
    indices: ply.index ? Array.from(ply.index.array) : null,
  }
  return data
}

const splitArrayIntoChunks = (arr, numChunks) => {
  const chunkSize = Math.ceil(arr.length / numChunks)
  const chunks = []

  for (let i = 0; i < numChunks; i++) {
    const start = i * chunkSize
    const end = start + chunkSize
    chunks.push(arr.slice(start, end))
  }

  return chunks
}

const arrayBufferToObject = (buffer) => {
  // 使用 TextDecoder 将 ArrayBuffer 转换为字符串
  const decoder = new TextDecoder()
  const jsonString = decoder.decode(new Uint8Array(buffer))

  // 将 JSON 字符串解析为对象
  return JSON.parse(jsonString)
}

const traverse = (worker, filters, fibers) => {
  return new Promise((resolve, reject) => {
    try {
      worker.postMessage({ filters, fibers })
      worker.onmessage = (e) => {
        worker.terminate()
        const result = arrayBufferToObject(e.data)
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  })
}

const tracing = (filters, fiberList) => {
  return new Promise((resolve) => {
    const workerLen = 4
    const workerPool = Array.from(
      { length: workerLen },
      () => new fiberTraverseWorker({ type: 'module' })
    )
    filters.forEach((v) => {
      const ply = v.mesh.geometry
      const plyData = splitPLY(ply)
      v.mesh = plyData
    })
    const chunks = splitArrayIntoChunks(fiberList, workerLen)
    const traverseTask = []
    const traverseResult = []
    chunks.forEach((fibers, i) => {
      const worker = workerPool[i]
      const task = traverse(worker, filters, fibers)
      traverseTask.push(task)
    })
    Promise.all(traverseTask).then((arry) => {
      arry.forEach((res) => {
        traverseResult.push(res)
      })
      // 将所有追踪结果合并起来
      traverseResult.forEach((workerFilters) => {
        workerFilters.forEach((workerFilter, index) => {
          const actualModel = filters[index]
          actualModel.crossedFibers.push(...workerFilter.crossedFibers)
        })
      })
      resolve()
    })
  })
}

export const tracingFiber = () => {
  return new Promise((resolve) => {
    const fiberList = fiberStore.fiberList
    const chipFilter = filterStore.chipFilter
    const nucleusFilter = filterStore.nucleusFilter
    const task1 = tracing(chipFilter, fiberList)
    const task2 = tracing(nucleusFilter, fiberList)
    console.time('神经纤维追踪耗时')
    Promise.all([task1, task2]).then(() => {
      console.timeEnd('神经纤维追踪耗时')
      // 只保留坐标去除Index，Index只是为了多线程追踪时，记录神经纤维编号
      fiberStore.fiberList = fiberList.map((fiber) => fiber.vectors)
      resolve()
    })
  })
}

export const clearFibers = () => {
  const displayFiberList = fiberStore.displayingFiberList
  removeMesh(displayFiberList)
  fiberStore.displayingFiberList = null
}

export const renderTracedFiber = (fiberIndexes) => {
  console.time('渲染神经纤维耗时')
  const fiberSet = new Set(fiberIndexes)
  // 将fiberSet转为数组
  const uniqueFiberIndexes = Array.from(fiberSet)
  console.log('【已追踪到的神经纤维】', uniqueFiberIndexes.length)
  clearFibers()
  const fiberList = fiberStore.fiberList
  const needToShowFibers = []
  // 先根据索引拿到纤维素的坐标
  uniqueFiberIndexes.forEach((index) => {
    needToShowFibers.push(fiberList[index])
  })
  // 将所有线条合并为一根
  const fiberMeshes = renderFiberInOneMesh(needToShowFibers)
  addMesh(fiberMeshes)
  fiberStore.displayingFiberList = fiberMeshes
  console.timeEnd('渲染神经纤维耗时')
}

export const renderAllFiber = () => {
  clearFibers()
  const fiberList = fiberStore.fiberList
  // 将所有线条合并为一根
  const fiberMeshes = renderFiberInOneMesh(fiberList)
  addMesh(fiberMeshes)
  fiberStore.displayingFiberList = fiberMeshes
}

// 显示不能追踪到的神经纤维
export const renderRestFiber = () => {
  clearFibers()
  tracingFiber()
  const fiberList = fiberStore.fiberList
  const nucleusFilter = filterStore.nucleusFilter
  const chipFilter = filterStore.chipFilter
  const nucleusIndexes = []
  const chipIndexes = []
  nucleusFilter.forEach((filter) => {
    nucleusIndexes.push(...filter.crossedFibers)
  })
  chipFilter.forEach((filter) => {
    chipIndexes.push(...filter.crossedFibers)
  })
  const needToShowFibers = []
  // 先根据索引拿到纤维素的坐标
  fiberList.forEach((fiber, index) => {
    if (!nucleusIndexes.includes(index) && !chipIndexes.includes(index)) {
      needToShowFibers.push(fiber)
    }
  })
  const fiberMeshes = renderFiberInOneMesh(needToShowFibers)
  addMesh(fiberMeshes)
  fiberStore.displayingFiberList = fiberMeshes
}

export const renderWholeBrainFiber = () => {
  const wholeBrainFiberAssets = patientStore.patientAssets.wholeBrainFiber
  console.log('wholeBrainFiberAssets', wholeBrainFiberAssets)
  return new Promise((resolve, reject) => {
    const downloadUrlList = wholeBrainFiberAssets.map((item) => item.downloadUrl)
    loadFiber(downloadUrlList)
      .then((fiberPool) => {
        const fiberPoolVectors = fiberPool.map((item) => item.vectors)
        const fiberMesh = renderFiberInOneMesh(fiberPoolVectors)
        fiberStore.displayingFiberList = fiberMesh
        addMesh(fiberMesh)
        resolve()
      })
      .catch(reject)
  })
}
