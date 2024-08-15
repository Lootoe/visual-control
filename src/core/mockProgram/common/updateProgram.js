import { genColor } from './genColor'
import { generateVta } from './genVta'
import usePatientStoreHook from '@/store/usePatientStore'

const patientStore = usePatientStoreHook()

const setAmplitude = (leadProgram, value) => {
  // 只要改了触点组合，这根电极上所有幅值全都归零
  leadProgram.nodes.forEach((nodeObj) => {
    nodeObj.amplitude = value
  })
  leadProgram.vtaList.forEach((vtaObj) => {
    vtaObj.amplitude = value
  })
}

export const updateProgramByNodeCommon = (params) => {
  if (!params) return null
  // !采用$state访问，是为了不让其成为响应式，而导致无法拷贝
  const currentProgram = JSON.parse(JSON.stringify(patientStore.$state.patientProgram))
  const { position, index, node } = params
  Object.values(currentProgram).forEach((leadProgramArr) => {
    leadProgramArr.forEach((leadProgram) => {
      // 只要改了触点组合，这根电极上所有幅值全都归零
      setAmplitude(leadProgram, 0)
      if (leadProgram.display === 1 && leadProgram.position === position) {
        const target = leadProgram.nodes.find((v) => v.index === index)
        // 根据node确认电极颜色
        if (target) {
          target.node = node
          // 如果有color就用传入的color，没有就默认
          // Mock数据可以这样使用，正式必须用传入的
          target.color = genColor(target.node)
        }
        // 根据触点的正负性生成VTAList
        const vta = generateVta(leadProgram.nodes, position)
        leadProgram.vtaList = [vta]
      }
    })
  })
  console.log('updateProgramByNode', currentProgram)
  patientStore.$patch((state) => {
    state.patientProgram = currentProgram
    state.amplitude = 0
  })
}

export const updateProgramByAmplitudeCommon = (amp = 0) => {
  const currentProgram = JSON.parse(JSON.stringify(patientStore.$state.patientProgram))
  Object.values(currentProgram).forEach((leadProgramArr) => {
    leadProgramArr.forEach((leadProgram) => {
      if (leadProgram.display === 1) {
        setAmplitude(leadProgram, amp)
      }
    })
  })
  console.log('updateProgramByAmplitude', currentProgram)
  patientStore.$patch((state) => {
    state.patientProgram = currentProgram
    state.amplitude = amp
  })
}
