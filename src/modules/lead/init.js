import { loadLeadTxt } from './loadLead'
import usePatientStoreHook from '@/store/usePatientStore'
import useLeadStoreHook from '@/store/useLeadStore'
import { addMeshes } from '@/modules/scene'
import { leadEnum } from '@/enum/leadEnum'
import { renderLead, renderChips } from './renderLead'

const patientStore = usePatientStoreHook()
const leadStore = useLeadStoreHook()

export const __initLead = () => {
  // 将电极配置和读取的坐标点结合
  return new Promise((resolve, reject) => {
    const leadAsset = patientStore.patientAssets.lead
    const leadType = patientStore.patientInfo.leads
    const leadProgram = patientStore.patientProgram
    const leadList = {}
    loadLeadTxt(leadAsset.downloadUrl)
      .then((leadPoints) => {
        Object.keys(leadPoints).forEach((position) => {
          // 根据leadType获取电极配置
          const leadConfig = leadEnum.find((item) => item.name === leadType[position].lead)
          leadList[position] = {
            ...leadPoints[position],
            ...leadType[position],
            ...leadConfig,
          }
          // 还需要根据Program来生成电极片的数据结构
          const program = leadProgram[position]
          // 这在以后程控改变电极片颜色时特别有用
          // program[0]，是因为一根电极可能有多源的情况
          leadList[position].chips = program[0].nodes
        })
        leadStore.leadList = leadList
        const leadMeshes = Object.values(leadList).map((lead) => {
          const mesh = renderLead(lead)
          lead.mesh = mesh
          return mesh
        })
        const leadChips = Object.values(leadList)
          .map((item) => renderChips(item))
          .flat()
        addMeshes(leadMeshes)
        addMeshes(leadChips)
        resolve()
      })
      .catch(reject)
  })
}
