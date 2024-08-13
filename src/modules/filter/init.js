import { addMeshes } from '@/modules/scene'
import { generateNucleusCheckList, DISPLAY_ENUM } from '@/enum/filterEnum'
import usePatientStoreHook from '@/store/usePatientStore'
import useFilterStoreHook from '@/store/useFilterStore'
import { loadFilter } from './loadFilter'

const patientStore = usePatientStoreHook()
const filterStore = useFilterStoreHook()

export const initFilter = () => {
  return new Promise((resolve, reject) => {
    const filterAssets = patientStore.$state.patientAssets.filter
    const nucleusAssets = patientStore.$state.patientAssets.nucleus
    Promise.all([initNucleusFilter(nucleusAssets, filterAssets), initChipFilter(filterAssets)])
      .then(([nucleusFilter, chipFilter]) => {
        filterStore.$patch((state) => {
          state.chipFilter = chipFilter
          state.nucleusFilter = nucleusFilter
        })
        resolve()
      })
      .catch(reject)
  })
}

const initNucleusFilter = async (nucleusAssets, filterAssets) => {
  return new Promise((resolve, reject) => {
    let nucleusFilter = []
    const nucleusCheckList = generateNucleusCheckList()
    nucleusCheckList.forEach((checkItem, index) => {
      const { searchName } = checkItem
      // 在核团列表里找核团
      const res_1 = nucleusAssets.find((v) => {
        return v.fileName.search(searchName) !== -1
      })
      // 在filter里找核团
      const res_2 = filterAssets.find((v) => {
        return v.fileName.search(searchName) !== -1
      })
      if (res_1) {
        nucleusCheckList[index].exist = true
        nucleusCheckList[index].url = res_1.downloadUrl
      }
      if (res_2) {
        nucleusCheckList[index].exist = true
        nucleusCheckList[index].url = res_2.downloadUrl
      }
    })
    const actualList = nucleusCheckList.filter((v) => v.exist)
    const urlList = actualList.map((v) => v.url)
    Promise.all(urlList.map((item) => loadFilter(item)))
      .then((meshArr) => {
        addMeshes(meshArr)
        meshArr.forEach((v, i) => {
          actualList[i].mesh = v
        })
        nucleusFilter = actualList
        // 核团的追踪名称为它的英文缩写
        nucleusFilter.forEach((v) => {
          // 该参数用于神经纤维追踪
          v.factor = v.en
        })
        // 根据需求给定的顺序排列
        nucleusFilter.sort((a, b) => a.orderIndex - b.orderIndex)
        nucleusFilter.forEach((v) => {
          v.crossedFibers = []
        })
        resolve(nucleusFilter)
      })
      .catch(reject)
  })
}

const initChipFilter = async (filterAssets) => {
  return new Promise((resolve, reject) => {
    const results = []
    const leadProgram = patientStore.$state.patientProgram
    // fileName里匹配数字的正则
    // 旧的正则表达式
    const oldNumReg = /(?<=(c_))\d+/g
    // 新的正则表达式[电极位置][触点序号]
    const newNumReg = /(?<=(c_))\d+_\d+/g
    filterAssets.forEach((v) => {
      const res1 = v.fileName.match(newNumReg)
      // 判断是新的命名方式、还是旧的命名方式
      if (res1) {
        const [leadPosition, chipNum] = res1[0].split('_')
        // 从program里匹配真正的触点ID
        // 文件名是按照chip_[position]_[index(0,1,2,3)]命名的
        // 0,1,2,3代表position电极从下往上的第几个触点
        const target = leadProgram[leadPosition]
        if (target) {
          const actualNum = target.nodes[Number(chipNum)].index
          results.push({
            index: actualNum,
            exist: true,
            url: v.downloadUrl,
            displayName: '触点' + actualNum,
            side: DISPLAY_ENUM.SIDE,
            position: leadPosition,
          })
        }
      } else {
        // 判断是旧的命名方式，还是非触点filter
        const res2 = v.fileName.match(oldNumReg)
        if (res2) {
          const num = res2[0]
          results.push({
            index: num,
            exist: true,
            url: v.downloadUrl,
            displayName: '触点' + num,
            side: DISPLAY_ENUM.SIDE,
            // 旧的命名方式无法判断位于哪根电极
            position: 'unknow',
          })
        }
      }
    })
    const urlList = results.map((v) => v.url)
    Promise.all(urlList.map((item) => loadFilter(item)))
      .then((meshArr) => {
        addMeshes(meshArr)
        meshArr.forEach((v, i) => {
          results[i].mesh = v
          results[i].factor = 'c_' + results[i].index
        })
        results.sort((a, b) => a.index - b.index)
        const chipFilter = results
        chipFilter.forEach((v) => {
          v.crossedFibers = []
        })
        resolve(chipFilter)
      })
      .catch(reject)
  })
}
