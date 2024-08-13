import { defineStore } from 'pinia'
import { store } from '@/store'

const usePatientStore = defineStore('patientStore', () => {
  let patientInfo = {}
  let patientProgram = {}
  let patientAssets = {}

  return {
    patientInfo,
    patientProgram,
    patientAssets,
  }
})

export default () => {
  return usePatientStore(store)
}
