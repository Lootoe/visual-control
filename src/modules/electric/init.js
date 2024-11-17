import usePatientStoreHook from '@/store/usePatientStore'
import useVtaStoreHook from '@/store/useVtaStore'
import { convertToVtaTable } from './updateElectrics'
import { map } from 'radash'
import { addMesh } from '@/modules/scene'
import { loadElectric } from './loadElectric'
import { renderElectric } from './renderElectric'

const patientStore = usePatientStoreHook()
const vtaStore = useVtaStoreHook()

export const __initElectric = async () => {
  // 防止引用导致内存泄漏，直接拷贝一份
  const newProgram = JSON.parse(JSON.stringify(patientStore.patientProgram))
  const vtaTable = convertToVtaTable(newProgram)
  await map(Object.values(vtaTable), async (vtaList) => {
    await map(vtaList, async (vta) => {
      if (vta.amplitude > 0) {
        const electricRenderData = await loadElectric(vta.downloadUrlArr)
        if (electricRenderData) {
          const newMesh = renderElectric(electricRenderData, vta.amplitude)
          vta.electricRenderData = electricRenderData
          vta.mesh = newMesh
          addMesh(newMesh)
        }
      }
    })
  })
  vtaStore.vtaTable = vtaTable
}
