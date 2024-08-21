// 可视化不需要左右通道，直接将PAD的数据结构改为可视化的数据结构
export const convertPatient = (params) => {
  const { config, leftChannel, rightChannel } = params
  const patientInfo = {
    leads: {},
    config: {},
  }
  patientInfo.config = JSON.parse(config)
  leftChannel.implantList.forEach((obj) => {
    const { position } = obj
    patientInfo.leads[position] = obj
  })
  rightChannel.implantList.forEach((obj) => {
    const { position } = obj
    patientInfo.leads[position] = obj
  })
  return patientInfo
}
