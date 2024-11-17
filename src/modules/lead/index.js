import { __initLead, getChipMeshes } from './init'
import { subscribeProgramUpdate } from './subscribeProgramUpdate'
import { updateProgramOnClickedChip } from './updateProgramOnClickedChip'
import { updateChip } from './updateChip'
import usePatientStoreHook from '@/store/usePatientStore.js'
const patientStore = usePatientStoreHook()

const initLead = () => {
  return new Promise((resolve, reject) => {
    __initLead()
      .then(() => {
        updateChip(patientStore.patientProgram)
        subscribeProgramUpdate()
        resolve()
      })
      .catch(reject)
  })
}

// 将updateProgramOnClickedChip导出，是因为PAD\PC端不需要这个功能
export { initLead, updateProgramOnClickedChip, getChipMeshes }
