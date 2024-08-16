import { getImageInfo } from '@/utils/api'
import usePatientStoreHook from '@/store/usePatientStore'
import { generateProgram } from '@/core/mockProgram'

const patientStore = usePatientStoreHook()

// 可视化不需要左右通道，直接将PAD的数据结构改为可视化的数据结构
const convertPatient = (params) => {
  const { config, leftChannel, rightChannel } = params
  const patientInfo = {
    leads: {},
    config: {},
  }
  patientInfo.config = JSON.parse(config)
  leftChannel.implantList.forEach((obj) => {
    const { position } = obj
    patientInfo.leads[position] = obj
  })
  rightChannel.implantList.forEach((obj) => {
    const { position } = obj
    patientInfo.leads[position] = obj
  })
  return patientInfo
}

// 统一使用downloadUrl\fileName的数据结构
const convertAssets = (params) => {
  const { modalityResultList } = params
  const assets = {
    nucleus: [],
    lead: [],
    fiber: [],
    head: {},
    matrix: {},
    filter: [],
    VTA: [],
  }
  modalityResultList.forEach((item) => {
    if (item.type === 'nucleus') {
      assets.nucleus = item.downloadUrlList
    }
    if (item.type === 'lead') {
      const reg = new RegExp('Lead.txt')
      const lead = item.downloadUrlList.find((v) => {
        return reg.test(v.fileName)
      })
      assets.lead = lead
    }
    if (item.type === 'fiber') {
      assets.fiber = item.downloadUrlList
    }
    if (item.type === 'matrix') {
      const str1 = 'MNI152_template'
      const globalAffine = item.downloadUrlList.find((v) => {
        return v.fileName.search(str1) !== -1
      })
      assets.matrix[str1] = globalAffine
    }
    if (item.type === 'head') {
      if (item.downloadUrlList.length > 0) {
        assets.head = item.downloadUrlList[0]
      }
    }
    if (item.type === 'filter') {
      assets.filter = item.downloadUrlList
    }
    if (item.type === 'VTA') {
      assets.VTA = item.downloadUrlList
    }
  })
  return assets
}

// 在影像管理系统中，我们只有PatientInfo，因此PatientProgram需要自己造
export default (params) => {
  return new Promise((resolve, reject) => {
    if (!params?.ipgSN) {
      return reject('参数ipgSN不能为空')
    }
    // 路由传啥值就用啥,必须包括IPGSN
    getImageInfo(params)
      .then((apiResult) => {
        if (!apiResult?.data) {
          return reject('该患者尚无影像数据')
        } else {
          const data = apiResult.data.data
          const patientAssets = convertAssets(data)
          // 放到前面，是因为program要依赖于assets生成
          patientStore.$patch((state) => {
            state.patientAssets = patientAssets
          })
          const patientInfo = convertPatient(data)
          const patientProgram = generateProgram(patientInfo.leads)
          patientStore.$patch((state) => {
            state.patientInfo = patientInfo
            state.patientProgram = patientProgram
          })
          resolve()
        }
      })
      .catch(reject)
  })
}
