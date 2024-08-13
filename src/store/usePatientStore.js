import { defineStore } from 'pinia'
import { store } from '@/store'

const usePatientStore = defineStore('patientStore', () => {
  let patientInfo = ref({})
  let patientProgram = ref({})
  let patientAssets = ref({})

  return {
    patientInfo,
    patientProgram,
    patientAssets,
  }
})

export const usePatientStoreHook = () => {
  return usePatientStore(store)
}
