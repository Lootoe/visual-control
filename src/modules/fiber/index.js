import { useFiberStoreHook } from '@/store/useFiberStore'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { loadFiber } from './loadFiber'
import { renderFiber } from './renderFiber'
import { addMeshes, removeMeshes } from '@/modules/scene'

const { cacheFiberList, cacheDisplayFiberList, getFiberList, getDisplayFiberList } =
  useFiberStoreHook()
const { getPatientAssets } = usePatientStoreHook()

export const initFiber = () => {
  return new Promise((resolve, reject) => {
    const leadAssets = getPatientAssets().fiber
    // 可能有多个神经纤维文件，我们全部要加载
    const fiberList = []
    // 为了提升速度，我们加载的时候不去构建Mesh，而是到筛选时再构建Mesh
    Promise.all(leadAssets.map((item) => loadFiber(item.downloadUrl)))
      .then((eachFileFiber) => {
        eachFileFiber.forEach((arr) => {
          fiberList.push(...arr)
        })
        cacheFiberList(fiberList)
        resolve()
      })
      .catch(reject)
  })
}

export const clearFibers = () => {
  const displayFiberList = getDisplayFiberList()
  removeMeshes(displayFiberList)
  cacheDisplayFiberList([])
}

const renderTracedFiber = (fiberIndexes) => {
  clearFibers()
  const fiberList = getFiberList()
  const needToShowFibers = []
  // 先根据索引拿到纤维素的坐标
  fiberIndexes.forEach((index) => {
    needToShowFibers.push(fiberList[index])
  })
  // 使用坐标构建纤维素
  const fiberMeshes = []
  needToShowFibers.forEach((vectors) => {
    const fiberMesh = renderFiber(vectors)
    fiberMeshes.push(fiberMesh)
  })
  addMeshes(fiberMeshes)
  // 还需要想办法下次渲染时，删除上一次内容
  cacheDisplayFiberList(fiberMeshes)
}
