import { genColor } from './genColor'
import { generateVtaCommon } from './genVta'
import usePatientStoreHook from '@/store/usePatientStore'

const patientStore = usePatientStoreHook()

export const updateProgramByNode = (params) => {
  if (!params) return null
  // !采用$state访问，是为了不让其成为响应式，而导致无法拷贝
  const currentProgram = JSON.parse(JSON.stringify(patientStore.$state.patientProgram))
  const { position, index, node } = params
  const leadProgramArr = currentProgram[position]
  leadProgramArr.forEach((leadProgram) => {
    if (leadProgram.display === 1) {
      const target = leadProgram.nodes.find((v) => v.index === index)
      // 根据node确认电极颜色
      if (target) {
        target.node = node
        // 如果有color就用传入的color，没有就默认
        // Mock数据可以这样使用，正式必须用传入的
        target.color = genColor(target.node)
      }
      // 只要改了触点组合，这根电极上所有幅值全都归零
      leadProgram.nodes.forEach((nodeObj) => {
        nodeObj.amplitude = 0
      })
      // 根据触点的正负性生成VTAList
      const vta = generateVtaCommon(leadProgram.nodes, position)
      leadProgram.vtaList = [vta]
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
