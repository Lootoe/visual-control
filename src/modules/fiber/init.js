import useFiberStoreHook from '@/store/useFiberStore'
import usePatientStoreHook from '@/store/usePatientStore'
import { loadFiber } from './loadFiber'

const fiberStore = useFiberStoreHook()
const patientStore = usePatientStoreHook()

export const initFiber = () => {
  return new Promise((resolve, reject) => {
    const leadAssets = patientStore.$state.patientAssets.fiber
    // 可能有多个神经纤维文件，我们全部要加载
    const fiberList = []
    // 为了提升速度，我们加载的时候不去构建Mesh，而是到筛选时再构建Mesh
    Promise.all(leadAssets.map((item) => loadFiber(item.downloadUrl)))
      .then((eachFileFiber) => {
        eachFileFiber.forEach((arr) => {
          fiberList.push(...arr)
        })
        // 还需要想办法下次渲染时，删除上一次内容
        fiberStore.fiberList = fiberList
        resolve()
      })
      .catch(reject)
  })
}
