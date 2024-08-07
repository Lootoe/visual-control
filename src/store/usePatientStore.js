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
    console.log('【update patientInfo】', patientInfo)
  }
  const updatePatientProgram = (params) => {
    patientProgram = params
    console.log('【update patientProgram】', patientProgram)
  }
  const updatePatientAssets = (params) => {
    patientAssets = params
    console.log('【update patientAssets】', patientAssets)
  }

  // key:资源名称
  // msg:资源错误的原因,比如数据缺失、数据结构不对
  const uploadErrorAssets = (key, msg) => {
    invalidAssetsList.push({ key, msg })
  }

  return {
    patientInfo,
    patientProgram,
    patientAssets,
    updatePatientInfo,
    updatePatientProgram,
    updatePatientAssets,
    uploadErrorAssets,
  }
})

export const usePatientStoreHook = () => {
  return usePatientStore(store)
}
