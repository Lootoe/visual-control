import { __initLead } from './init'
import { subscribeProgramUpdate } from './updateChipMesh'
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
export { initLead, updateProgramOnClickedChip }
