import { getImageInfo } from '@/utils/api'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { leadEnum } from '@/enum/leadEnum'

const { updatePatientInfo, updatePatientProgram, updatePatientAssets } = usePatientStoreHook()

// 用于生成电极片索引
let chipIndex = 0

// 根据电极型号生成Nodes
const generateNodes = (leadType) => {
  const targetParams = leadEnum.find((v) => v.name === leadType)
  if (targetParams) {
    const { number } = targetParams
    const nodes = []
    for (let i = 0; i < number; i++) {
      nodes[i] = {
        index: chipIndex,
        node: 0,
        color: '',
        amplitude: 0,
        width: 0,
        rate: 0,
      }
      chipIndex++
    }
    return nodes
  } else {
    throw {
      msg: '电极型号不存在',
      errData: { leadType },
    }
  }
}

// 根据电极型号生成程控参数
const convertProgram = (patientInfo) => {
  chipIndex = 0
  const { leads } = patientInfo
  const patientProgram = {}
  const leadLength = Object.keys(leads).length
  for (let position = 1; position <= leadLength; position++) {
    const { lead } = leads[position]
    const nodes = generateNodes(lead, position)
    const program = {
      nodes,
      position,
      display: 1,
      vtaList: [],
    }
    if (program[position]) {
      patientProgram[position].push(program)
    } else {
      patientProgram[position] = [program]
    }
  }
  return patientProgram
}

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
          const patientInfo = convertPatient(data)
          const patientProgram = convertProgram(patientInfo)
          const patientAssets = convertAssets(data)
          updatePatientInfo(patientInfo)
          updatePatientProgram(patientProgram)
          updatePatientAssets(patientAssets)
          resolve()
        }
      })
      .catch(reject)
  })
}
