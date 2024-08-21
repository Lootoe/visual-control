// 可视化不需要channel，直接转换为可视化的结构
// [position]:[childProgram1,childProgram2]
export const convertProgram = (program) => {
  const patientProgram = {}
  const { leftChannel, rightChannel } = program
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
