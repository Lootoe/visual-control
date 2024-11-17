// 可视化不需要channel，直接转换为可视化的结构
// [position]:[childProgram1,childProgram2]
export const convertProgram = (program) => {
  const patientProgram = {}
  const { leftChannel, rightChannel } = program
  // 防止被object.keys遍历
  Object.defineProperty(patientProgram, 'isControl', {
    value: program.isControl ?? false, // 设置默认值
    enumerable: false, // 不可枚举，防止 Object.keys 遍历
    writable: true, // 可写
    configurable: true, // 可配置
  })
  leftChannel.forEach((item) => {
    if (patientProgram[item.position]) {
      patientProgram[item.position].push(item)
    } else {
      patientProgram[item.position] = [item]
    }
  })
  rightChannel.forEach((item) => {
    if (patientProgram[item.position]) {
      patientProgram[item.position].push(item)
    } else {
      patientProgram[item.position] = [item]
    }
  })
  return patientProgram
}
