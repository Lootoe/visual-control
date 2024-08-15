import { generateProgramCommon } from './common/genProgram'
import { updateProgramByAmplitudeCommon, updateProgramByNodeCommon } from './common/updateProgram'
import usePatientStoreHook from '@/store/usePatientStore'

const patientStore = usePatientStoreHook()

const generateProgram = (params) => {
  if (patientStore.controlType === 0) {
    return generateProgramCommon(params)
  }
}

const updateProgramByAmplitude = (params) => {
  if (patientStore.controlType === 0) {
    return updateProgramByAmplitudeCommon(params)
  }
}

const updateProgramByNode = (params) => {
  if (patientStore.controlType === 0) {
    return updateProgramByNodeCommon(params)
  }
}

export { generateProgram, updateProgramByAmplitude, updateProgramByNode }
