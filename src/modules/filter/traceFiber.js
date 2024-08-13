import * as THREE from 'three'
import { addMeshes, removeMeshes } from '@/modules/scene'
import { useFilterStoreHook } from '@/store/useFilterStore'
import { useFiberStoreHook } from '@/store/useFiberStore'
import { renderFiber } from '@/modules/fiber'

const { cacheDisplayFiberList, getFiberList, getDisplayFiberList } = useFiberStoreHook()
const { getChipFilter, getNucleusFilter } = useFilterStoreHook()

const tracing = (filters, fiberList) => {
  const raycaster = new THREE.Raycaster()
  raycaster.firstHitOnly = true
  const direction_1 = new THREE.Vector3(0, 0, 1)
  const direction_2 = new THREE.Vector3(0, 0, -1)
  const intersectSuccess = (raycaster, mesh, point) => {
    raycaster.set(point, direction_1)
    const intersects_1 = raycaster.intersectObject(mesh)
    const success_1 = intersects_1.length
    raycaster.set(point, direction_2)
    const intersects_2 = raycaster.intersectObject(mesh)
    const success_2 = intersects_2.length
    return success_1 && success_2
  }
  raycaster.firstHitOnly = true
  filters.forEach((filter) => {
    const { mesh, crossedFibers } = filter
    /**电场可能为空，那些模型就不需要追踪 */
    if (mesh) {
      fiberList.forEach((fiber, index) => {
        // 计算每个核团都有哪些神经纤维经过
        for (let i = 0; i < fiber.length; i++) {
          const point = fiber[i]
          if (intersectSuccess(raycaster, mesh, point)) {
            crossedFibers.push(index)
            break
          }
        }
        // // 计算每个核团都包含了哪些纤维的起始点
        // const pointStart = fiber.matrix[0]
        // if (intersectSuccess(raycaster, mesh, pointStart)) {
        //   startFromFibers.push(index)
        // }
        // // 计算每个核团都包含了哪些纤维的结束点
        // const pointEnd = fiber.matrix[fiber.matrix.length - 1]
        // if (intersectSuccess(raycaster, mesh, pointEnd)) {
        //   endWithFibers.push(index)
        // }
      })
    }
  })
}

export const tracingFiber = () => {
  const fiberList = getFiberList()
  const chipFilter = getChipFilter().value
  const nucleusFilter = getNucleusFilter().value
  console.time('神经纤维追踪计时')
  tracing(chipFilter, fiberList)
  tracing(nucleusFilter, fiberList)
  console.timeEnd('神经纤维追踪计时')
}

export const clearFibers = () => {
  const displayFiberList = getDisplayFiberList()
  removeMeshes(displayFiberList)
  cacheDisplayFiberList([])
}

export const renderTracedFiber = (fiberIndexes) => {
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
