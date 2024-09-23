/**
 * 当所选触点变化、幅值变化、同步异步刺激等变化时
 * 我们决定是否要重新加载新的VTA模型，销毁旧模型，亦或是对现有模型进行Cutoff
 */
import { map } from 'radash'
import { addMesh, removeMesh } from '@/modules/scene'
import { loadElectric } from './loadElectric'
import { renderElectric } from './renderElectric'

const commandEnum = {
  DELETE: 'DeleteMesh',
  UPDATE: 'UpdateMesh',
  HIDE: 'HideMesh',
  CUT: 'CutMesh',
  NONE: 'DoNothing',
}

// 计算触点组合是否变化
const calcCombinationIsChanged = (oldVta, newVta) => {
  // 先对比数组的长度是否变化，如果变了，那说明组合就变了
  // 如果数组的长度没变，那就判断每一个元素的对应的downloadUrl是否变化
  const oldLen = oldVta.downloadUrlArr.length
  const newLen = newVta.downloadUrlArr.length
  let flag = false
  if (oldLen !== newLen) {
    flag = true
  } else {
    newVta.downloadUrlArr.forEach((newUrl, i) => {
      const oldUrl = oldVta.downloadUrlArr[i]
      if (oldUrl !== newUrl) {
        flag = true
      }
    })
  }
  return flag
}

// 计算幅值是否变化
const calcAmplitudeIsChanged = (oldVta, newVta) => {
  // 如果数组对位的vta幅值不一致，那就说明变化了
  // *同一个group的幅值一定相同，所以我们比较第一项即可
  const oldAmp = oldVta.amplitude
  const newAmp = newVta.amplitude
  return oldAmp !== newAmp
}

// 计算幅值是否为0
// !还有一种可能，那就是幅值不为0，但是触点组合全是0，这种情况也当幅值为0处理
const calcAmplitudeIsZero = (newVta) => {
  const isAmpZero = parseFloat(newVta.amplitude) === 0
  const hasUrlZero = newVta.downloadUrlArr.some((url) => calcUrlIsZero(url))
  return isAmpZero || hasUrlZero
}

// 判断触点组合的URL是否为空
const calcUrlIsZero = (downloadUrl = '') => {
  try {
    const str_1 = downloadUrl.split('_').pop()
    const str_2 = str_1.split('.').shift()
    const isZero = parseFloat(str_2) === 0
    return isZero
  } catch (error) {
    return false
  }
}

// 计算旧模型是否已经加载过
const calcMeshIsLoaded = (oldVta) => {
  return !!oldVta.mesh
}

const __createStuff = (newVta, oldVta, str) => {
  return {
    command: str,
    newVta,
    oldVta,
  }
}

// 判断哪些条件要做哪些事
// 并且得到控制台的输出语句
const createStuff = ({
  isCombinationChanged,
  isAmplitudeChanged,
  isAmplitudeZero,
  isMeshLoaded,
  newVta,
  oldVta,
}) => {
  if (isCombinationChanged) {
    if (isAmplitudeChanged) {
      if (isAmplitudeZero) {
        // 医生重选触点组合
        // 触点改变、幅值为0，幅值改变
        // 将原来的模型给销毁
        return __createStuff(newVta, oldVta, commandEnum.DELETE)
      } else {
        // 之前程控过，再次进入程控页面
        // 触点改变、幅值不为0，幅值改变
        // 加载和渲染电场
        return __createStuff(newVta, oldVta, commandEnum.UPDATE)
      }
    } else {
      // 医生只是在切换触点，什么也不做
      return __createStuff(newVta, oldVta, commandEnum.NONE)
    }
  } else {
    if (isAmplitudeZero) {
      // 医生在程控时，将幅值调为0
      // 触点未变、幅值为0，幅值改变
      // 隐藏电场模型
      return __createStuff(newVta, oldVta, commandEnum.HIDE)
    } else {
      // 医生选完触点后，点击程控按钮，然后调节幅值
      // 触点未变、幅值不为0，幅值改变
      // 判断模型是否加载
      if (isAmplitudeChanged) {
        if (!isMeshLoaded) {
          // 如果没加载，那就加载一下
          return __createStuff(newVta, oldVta, commandEnum.UPDATE)
        } else {
          // 如果加载过，那就直接切割
          return __createStuff(newVta, oldVta, commandEnum.CUT)
        }
      } else {
        // 医生反复点击程控按钮，下发指令给IPG
        // 触点未变、幅值不为0，幅值不改变
        // 什么也不做
        return __createStuff(newVta, oldVta, commandEnum.NONE)
      }
    }
  }
}

// 计算需要更新的东西
export const diffVtaList = (newVtaList, oldVtaList) => {
  // 记录了模型应该做哪些事
  let stuffList = []
  // 触点组合是否改变
  let isCombinationChanged = false
  // 幅值是否改变
  let isAmplitudeChanged = false
  // 幅值是否为零
  let isAmplitudeZero = false
  // 是否已经加载过模型
  let isMeshLoaded = false
  // 先遍历获取重要的判断条件
  // 同步刺激和异步刺激的转变会导致长度变化
  if (oldVtaList.length !== newVtaList.length) {
    // 先把老的VTA全部删掉
    oldVtaList.forEach((oldVta) => {
      isCombinationChanged = true
      isAmplitudeChanged = true
      isAmplitudeZero = true
      isMeshLoaded = true
      const stuff = createStuff({
        isCombinationChanged,
        isAmplitudeChanged,
        isAmplitudeZero,
        isMeshLoaded,
        newVta: null,
        oldVta: oldVta,
      })
      stuffList.push(stuff)
    })
    // 再把新的VTA全部更新
    newVtaList.forEach((newVta) => {
      isCombinationChanged = true
      isAmplitudeChanged = true
      isAmplitudeZero = false
      isMeshLoaded = true
      const stuff = createStuff({
        isCombinationChanged,
        isAmplitudeChanged,
        isAmplitudeZero,
        isMeshLoaded,
        newVta,
        oldVta: null,
      })
      stuffList.push(stuff)
    })
  } else {
    newVtaList.forEach((newVta, index) => {
      const oldVta = oldVtaList[index]
      isCombinationChanged = calcCombinationIsChanged(oldVta, newVta)
      isAmplitudeChanged = calcAmplitudeIsChanged(oldVta, newVta)
      isAmplitudeZero = calcAmplitudeIsZero(newVta)
      isMeshLoaded = calcMeshIsLoaded(oldVta)
      const stuff = createStuff({
        isCombinationChanged,
        isAmplitudeChanged,
        isAmplitudeZero,
        isMeshLoaded,
        newVta,
        oldVta,
      })
      stuffList.push(stuff)
    })
  }
  return stuffList
}

export const handleStuff = async (stuffList, position) => {
  await map(stuffList, async (stuff) => {
    const { command, newVta, oldVta } = stuff
    if (command === commandEnum.NONE) {
      newVta.mesh = oldVta.mesh
      newVta.electricRenderData = oldVta.electricRenderData
      oldVta.mesh = null
      oldVta.electricRenderData = null
    }
    if (command === commandEnum.UPDATE) {
      // 先删除旧模型
      if (calcMeshIsLoaded(oldVta)) {
        removeMesh(oldVta.mesh)
        oldVta.mesh = null
        oldVta.electricRenderData = null
      }
      const electricRenderData = await loadElectric(newVta.downloadUrlArr)
      newVta.electricRenderData = electricRenderData
      if (electricRenderData) {
        const newMesh = renderElectric(electricRenderData, newVta.amplitude, position)
        newVta.mesh = newMesh
        addMesh(newMesh)
      }
    }
    if (command === commandEnum.CUT) {
      // 先删除旧模型
      if (calcMeshIsLoaded(oldVta)) {
        removeMesh(oldVta.mesh)
      }
      if (oldVta.electricRenderData) {
        const newMesh = renderElectric(oldVta.electricRenderData, newVta.amplitude, position)
        newVta.mesh = newMesh
        newVta.electricRenderData = oldVta.electricRenderData
        addMesh(newMesh)
        oldVta.mesh = null
        oldVta.electricRenderData = null
      }
    }
    if (command === commandEnum.HIDE) {
      if (calcMeshIsLoaded(oldVta)) {
        oldVta.mesh.visible = false
      }
    }
    if (command === commandEnum.DELETE) {
      if (calcMeshIsLoaded(oldVta)) {
        removeMesh(oldVta.mesh)
      }
    }
  })
}
