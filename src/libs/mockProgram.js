/**
 * *根据电极型号和电极配置生成program
 */

import { leadEnum } from '@/enum/leadEnum'
/**
 * *根据电极型号和电极配置生成program
 */
import usePatientStoreHook from '@/store/usePatientStore'

const patientStore = usePatientStoreHook()

let chipIndex = 0

const generateNodes = (leadType) => {
  const targetParams = leadEnum.find((v) => v.name === leadType)
  if (targetParams) {
    const { number } = targetParams
    const nodes = []
    for (let i = 0; i < number; i++) {
      nodes[i] = {
        index: chipIndex,
        node: 0,
        color: '',
        amplitude: 0,
        width: 0,
        rate: 0,
      }
      chipIndex++
    }
    return nodes
  } else {
    throw {
      msg: '电极型号不存在',
      errData: { leadType },
    }
  }
}

// 根据电极配置生成程控参数
// TODO:使用config判断是否是双源、交叉电脉冲、八爪鱼
export const generateProgram = (leads) => {
  chipIndex = 0
  const patientProgram = {}
  const leadLength = Object.keys(leads).length
  for (let position = 1; position <= leadLength; position++) {
    const { lead } = leads[position]
    const nodes = generateNodes(lead, position)
    const program = {
      nodes,
      position,
      display: 1,
      vtaList: [],
    }
    if (program[position]) {
      patientProgram[position].push(program)
    } else {
      patientProgram[position] = [program]
    }
  }
  return patientProgram
}

const processArray = (arr) => {
  let result = new Array(arr.length).fill(0) // 初始化结果数组，全部为0
  let n = arr.length

  // 遍历数组，处理左侧的1
  for (let i = 0; i < n; i++) {
    if (arr[i] === 2) {
      result[i] = 2
      // 向左寻找第一个1
      for (let j = i - 1; j >= 0; j--) {
        if (arr[j] === 1) {
          result[j] = 1
          break
        }
      }
      // 向右寻找第一个1
      for (let j = i + 1; j < n; j++) {
        if (arr[j] === 1) {
          result[j] = 1
          break
        }
      }
    }
  }

  return result
}

const processNiiUrl = (position, arr) => {
  const source = arr.join('')
  const fileName = `Lead_${position}_${source}.nii.gz`
  // 从VTA里寻找对应的下载地址
  const vtaAssets = patientStore.patientAssets.VTA
  const res = vtaAssets.find((v) => v.fileName === fileName)
  if (res) {
    return res.downloadUrl
  } else {
    console.log('找不到VTA文件:', fileName)
    return ''
  }
}

export const generateVtaList = (nodes, position = 1) => {
  if (!nodes) return []
  const length = nodes.length
  let vtaSegments = []
  // 将每个负单独提取出来
  // 如果其它位置是负，那就置为1
  // 如果其他位置是1，那就是1
  for (let i = 0; i < length; i++) {
    const curtNode = nodes[i].node
    if (curtNode === 2) {
      const arr = []
      arr[i] = curtNode
      for (let j = 0; j < length; j++) {
        if (i === j) continue
        const otherNode = nodes[j].node
        const node = otherNode === 2 ? 1 : otherNode
        arr[j] = node
      }
      // 去除多余的1
      const newArr = processArray(arr)
      const url = processNiiUrl(position, newArr)
      vtaSegments.push(url)
    }
  }
  return {
    downloadUrlArr: vtaSegments,
    amplitude: 0,
  }
}

/**
 * 当我们选中某个触点时，我们根据这个触点生成一个新的program.
 * @param {object} params
 * {
 *    position: 触点位于的电极,
 *    index: 触点序号,
 *    node: 触点正负性,
 *    color: 触点颜色
 * }
 * @returns program
 */
export const updateProgramByNode = (params) => {
  if (!params) return null
  // !采用$state访问，是为了不让其成为响应式，而导致无法拷贝
  const currentProgram = JSON.parse(JSON.stringify(patientStore.$state.patientProgram))
  const { position, index, node } = params
  // 正常情况一个program
  // TODO:双源有两个program，两个display都为1，但是所选触点不重复
  // TODO:交叉点脉冲也有两个program，但是只有一个display=1
  // TODO:八爪鱼有更多program，且display都是1
  const leadProgramArr = currentProgram[position]
  leadProgramArr.forEach((leadProgram) => {
    if (leadProgram.display === 1) {
      const target = leadProgram.nodes.find((v) => v.index === index)
      // 根据node确认电极颜色
      // 创建颜色数组
      let colors = ['#27386f', '#0f0', '#f00']
      // 通过 newNode 作为索引直接获取对应的颜色
      let color = colors[node]
      if (target) {
        target.node = node
        // 如果有color就用传入的color，没有就默认
        // Mock数据可以这样使用，正式必须用传入的
        target.color = color
      }
      // !只要改了触点组合，这根电极上所有幅值全都归零
      leadProgram.nodes.forEach((nodeObj) => {
        nodeObj.amplitude = 0
      })
      // !根据触点的正负性生成VTAList
      const vtaList = generateVtaList(leadProgram.nodes, position)
      leadProgram.vtaList = vtaList
    }
  })
  console.log('updateProgramByNode', currentProgram)
  patientStore.$patch((state) => {
    state.patientProgram = currentProgram
  })
  patientStore.amplitude = 0
}

export const updateProgramByAmplitude = (amp = 0) => {
  const currentProgram = JSON.parse(JSON.stringify(patientStore.$state.patientProgram))
  // TODO:双源等待实现，可能需要传入是哪个源
  Object.values(currentProgram).forEach((leadProgramArr) => {
    leadProgramArr.forEach((leadProgram) => {
      if (leadProgram.display === 1) {
        leadProgram.nodes.forEach((nodeObj) => {
          nodeObj.amplitude = amp
        })
        leadProgram.vtaList.forEach((vtaObj) => {
          vtaObj.amplitude = amp
        })
      }
    })
  })
  console.log('updateProgramByAmplitude', currentProgram)
  patientStore.$patch((state) => {
    state.patientProgram = currentProgram
    state.amplitude = amp
  })
}
