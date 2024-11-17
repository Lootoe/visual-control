import { subscribeProgramUpdate } from './subscribeProgramUpdate'
import { updateElectrics } from './updateElectrics'
import usePatientStoreHook from '@/store/usePatientStore.js'
const patientStore = usePatientStoreHook()

const initElectric = () => {
  return new Promise((resolve, reject) => {
    updateElectrics(patientStore.patientProgram)
    subscribeProgramUpdate()
    resolve()
  })
}

export { initElectric }
