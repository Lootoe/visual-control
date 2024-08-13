/**
 * *根据电极型号和电极配置生成program
 */

import { leadEnum } from '@/enum/leadEnum'

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
