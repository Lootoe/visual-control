import usePatientStoreHook from '@/store/usePatientStore'
import { generateProgram } from '@/core/mockProgram'
import { getImageInfo } from '@/utils/api'
import { convertPatient } from '../convert/convertPatient'
import { convertAssets } from '../convert/convertAssets'

const getImageInfoByIPGSN = (params) => {
  return new Promise((resolve, reject) => {
    getImageInfo(params)
      .then((apiResult) => {
        if (!apiResult?.data) {
          return reject('该患者尚无影像数据')
        } else {
          const data = apiResult.data.data
          const patientAssets = convertAssets(data)
          const patientInfo = convertPatient(data)
          resolve({ patientInfo, patientAssets })
        }
      })
      .catch(reject)
  })
}

const patientStore = usePatientStoreHook()

// 在影像管理系统中，我们只有PatientInfo，因此PatientProgram需要自己造
export default (params) => {
  return new Promise((resolve, reject) => {
    if (!params?.ipgSN) {
      return reject('参数ipgSN不能为空')
    }
    // 路由传啥值就用啥,必须包括IPGSN
    getImageInfoByIPGSN(params)
      .then(({ patientInfo, patientAssets }) => {
        // 放到前面，是因为program要依赖于assets生成
        patientStore.$patch((state) => {
          state.patientAssets = patientAssets
        })
        const patientProgram = generateProgram(patientInfo.leads)
        patientStore.$patch((state) => {
          state.patientInfo = patientInfo
          state.patientProgram = patientProgram
        })
        resolve()
      })
      .catch(reject)
  })
}
