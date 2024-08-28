import * as THREE from 'three'
import { removeMesh, addMesh } from '@/modules/scene'
import useFilterStoreHook from '@/store/useFilterStore'
import useFiberStoreHook from '@/store/useFiberStore'
import { renderFiberInOneMesh } from '@/modules/fiber'

const fiberStore = useFiberStoreHook()
const filterStore = useFilterStoreHook()

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
  const fiberList = fiberStore.fiberList
  const chipFilter = filterStore.chipFilter
  const nucleusFilter = filterStore.nucleusFilter
  console.time('神经纤维追踪计时')
  tracing(chipFilter, fiberList)
  tracing(nucleusFilter, fiberList)
  console.timeEnd('神经纤维追踪计时')
}

export const clearFibers = () => {
  const displayFiberList = fiberStore.displayingFiberList
  removeMesh(displayFiberList)
  fiberStore.displayingFiberList = null
}

export const renderTracedFiber = (fiberIndexes) => {
  clearFibers()
  const fiberList = fiberStore.fiberList
  const needToShowFibers = []
  // 先根据索引拿到纤维素的坐标
  fiberIndexes.forEach((index) => {
    needToShowFibers.push(fiberList[index])
  })
  // 将所有线条合并为一根
  const fiberMeshes = renderFiberInOneMesh(needToShowFibers)
  addMesh(fiberMeshes)
  fiberStore.displayingFiberList = fiberMeshes
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
