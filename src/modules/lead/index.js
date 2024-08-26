import { __initLead, getChipMeshes } from './init'
import { subscribeProgramUpdate } from './subscribeProgramUpdate'
import { updateProgramOnClickedChip } from './updateProgramOnClickedChip'

const initLead = () => {
  return new Promise((resolve, reject) => {
    __initLead()
      .then(() => {
        subscribeProgramUpdate()
        resolve()
      })
      .catch(reject)
  })
}

// 将updateProgramOnClickedChip导出，是因为PAD\PC端不需要这个功能
export { initLead, updateProgramOnClickedChip, getChipMeshes }
