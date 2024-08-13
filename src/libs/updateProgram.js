/**
 * *根据电极型号和电极配置生成program
 */
import usePatientStoreHook from '@/store/usePatientStore'

const patientStore = usePatientStoreHook()

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
    }
  })
  patientStore.$patch((state) => {
    state.patientProgram = currentProgram
  })
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
      }
    })
  })
  patientStore.$patch((state) => {
    state.patientProgram = currentProgram
  })
}
