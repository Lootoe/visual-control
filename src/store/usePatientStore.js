import { defineStore } from 'pinia'
import { store } from '@/store'

const usePatientStore = defineStore('patientStore', () => {
  let patientInfo = null
  let patientProgram = null
  let patientAssets = null
  // !当其他模块在使用数据时，如果报错，说明资源存在问题，则向这里记录
  // !这里记录的内容会汇报给用户
  let invalidAssetsList = []

  const updatePatientInfo = (params) => {
    patientInfo = params
  }
  const updatePatientProgram = (params) => {
    patientProgram = params
  }
  const updatePatientAssets = (params) => {
    patientAssets = params
  }

  const getPatientInfo = () => patientInfo
  const getPatientProgram = () => patientProgram
  const getPatientAssets = () => patientAssets

  // key:资源名称
  // msg:资源错误的原因,比如数据缺失、数据结构不对
  const uploadErrorAssets = (key, msg) => {
    invalidAssetsList.push({ key, msg })
  }

  return {
    getPatientInfo,
    getPatientProgram,
    getPatientAssets,
    updatePatientInfo,
    updatePatientProgram,
    updatePatientAssets,
    uploadErrorAssets,
  }
})

export const usePatientStoreHook = () => {
  return usePatientStore(store)
}
