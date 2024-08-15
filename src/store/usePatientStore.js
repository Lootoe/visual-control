import { defineStore } from 'pinia'
import { store } from '@/store'

const usePatientStore = defineStore('patientStore', () => {
  let patientInfo = ref({})
  let patientProgram = ref({})
  let patientAssets = ref({})
  let amplitude = ref(0)
  let controlType = ref(0)

  return {
    patientInfo,
    patientProgram,
    patientAssets,
    amplitude,
    controlType,
  }
})

export default () => {
  return usePatientStore(store)
}
