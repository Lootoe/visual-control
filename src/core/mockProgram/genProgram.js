import { leadEnum } from '@/enum/leadEnum'
import { generateVtaCommon } from './genVta'

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
      }
      chipIndex++
    }
    return nodes
  }
}

const generateProgramCommon = (leads) => {
  chipIndex = 0
  const patientProgram = {}
  // 根据电极的数目生成对应的program
  // 这里不考虑双源等其他情况，就是最普通的程序
  // 但是包括八爪鱼在内
  const leadLength = Object.keys(leads).length
  for (let position = 1; position <= leadLength; position++) {
    const { lead } = leads[position]
    const nodes = generateNodes(lead, position)
    const defaultVta = generateVtaCommon(nodes, position)
    // 填充默认的VTA
    // 全是lead_1_0000.nii.gz
    const program = {
      nodes,
      position,
      display: 1,
      vtaList: [defaultVta],
    }
    if (program[position]) {
      patientProgram[position].push(program)
    } else {
      patientProgram[position] = [program]
    }
  }
  return patientProgram
}

export { generateProgramCommon }
