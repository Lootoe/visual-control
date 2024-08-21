import { getImageInfo } from '@/utils/api'
import { convertPatient } from './convertPatient'
import { convertAssets } from './convertAssets'

export const getImageInfoByIPGSN = (params) => {
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
