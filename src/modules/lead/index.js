import { loadLeadTxt } from './loadLead'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useLeadStoreHook } from '@/store/useLeadStore'
import { addMeshes } from '@/modules/scene'
import { leadEnum } from '@/enum/leadEnum'
import { renderLead, renderChips } from './renderLead'
const { getPatientInfo, getPatientAssets, getPatientProgram } = usePatientStoreHook()
const { cacheLeadList, getLeadList } = useLeadStoreHook()

export const initLead = () => {
  // 将电极配置和读取的坐标点结合
  return new Promise((resolve, reject) => {
    const leadAsset = getPatientAssets().lead
    const leadType = getPatientInfo().leads
    const leadProgram = getPatientProgram()
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
        cacheLeadList(leadList)
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

export const changeLeadVisible = (flag = false) => {
  const leadList = getLeadList().value
  // 电极柱
  Object.values(leadList).forEach((lead) => {
    lead.mesh.visible = flag
    // 电极片
    const chips = lead.chips
    chips.forEach((chip) => {
      const chipMesh = chip.mesh
      chipMesh.visible = flag
    })
  })
}
