import usePatientStoreHook from '@/store/usePatientStore'
import { convertPatient } from '../convert/convertPatient'
import { convertAssets } from '../convert/convertAssets'
import { convertProgram } from '../convert/convertProgram'
import { getImageInfo } from '@/utils/api'

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

const msgEnum = {
  fetchPatient: 'fetchPatient',
  fetchProgram: 'fetchProgram',
  updateProgram: 'updateProgram',
}

// 获得远程部署的地址
// 从路由参数中获取
const getRemoteUrl = () => {
  const url = 'http://172.16.54.8:9528/'
  return globalThis.SRENV.IS_MODE_DEV ? url : import.meta.env.VITE_REMOTE_URL
}

const sendMsg = (type, data = {}) => {
  // 因为可视化是iframe
  const remoteUrl = getRemoteUrl()
  const payload = { type, data }
  window.parent.postMessage(payload, { targetOrigin: remoteUrl })
  console.log('【发送消息===>远程】', payload)
}

/**开始接收消息 */
const acceptMsg = () => {
  const remoteUrl = getRemoteUrl()
  window.addEventListener('message', (e) => {
    if (remoteUrl.search(e.origin) !== -1) {
      console.log('【收到消息<===远程】', JSON.parse(e.data.data))
      const { type, data } = e.data
      if (type === msgEnum.fetchPatient) {
        onAcceptPatient(JSON.parse(data))
      }
      if (type === msgEnum.fetchProgram) {
        onAcceptProgram(JSON.parse(data))
      }
      if (type === msgEnum.updateProgram) {
        onAcceptProgramUpdate(JSON.parse(data))
      }
    }
  })
}

// promise句柄
let patientPromiseResolver = null
let programPromiseResolver = null

// 通知PC端发送患者电极配置给我
const onAcceptPatient = (data) => {
  patientPromiseResolver && patientPromiseResolver(data)
}

// 通知PC端发送患者刺激参数给我
const onAcceptProgram = (program) => {
  const patientProgram = convertProgram(program)
  replaceVtaUrl(patientProgram)
  programPromiseResolver && programPromiseResolver(patientProgram)
}

// 响应PC端
// 更新program即可，电极片、电场会自己更新
const onAcceptProgramUpdate = (program) => {
  const patientProgram = convertProgram(program)
  replaceVtaUrl(patientProgram)
  patientStore.$patch((state) => {
    state.patientProgram = patientProgram
  })
}

const fetchPatient = () => {
  return new Promise((resolve) => {
    sendMsg(msgEnum.fetchPatient)
    patientPromiseResolver = resolve
  })
}

const fetchProgram = () => {
  return new Promise((resolve) => {
    sendMsg(msgEnum.fetchProgram)
    programPromiseResolver = resolve
  })
}

// 远程需要把Vta的下载链接换成API接口里拿到的链接
const replaceVtaUrl = (patientProgram) => {
  const VtaAssets = patientStore.patientAssets.VTA
  Object.values(patientProgram).forEach((leadProgramArr) => {
    leadProgramArr.forEach((leadProgram) =>
      leadProgram.vtaList.forEach((vta) => {
        const { downloadUrlArr } = vta
        downloadUrlArr.forEach((fileName, index) => {
          const correctUrl = getDownloadUrl(fileName, VtaAssets)
          if (correctUrl) {
            vta.downloadUrlArr[index] = correctUrl
          }
        })
      })
    )
  })
}

const getDownloadUrl = (fileName, VtaAssets) => {
  const res = VtaAssets.find((v) => v.fileName === fileName)
  if (res) {
    return res.downloadUrl
  } else {
    return fileName
  }
}

export default () => {
  return new Promise((resolve, reject) => {
    acceptMsg()
    fetchPatient()
      .then((patient) => {
        if (patient.patientIPG) {
          return getImageInfoByIPGSN({ ipgSN: patient.patientIPG })
        } else {
          reject({ msg: '无法获取IPG序列号' })
        }
      })
      .then(({ patientInfo, patientAssets }) => {
        // 放到前面，是因为program要依赖于assets生成
        patientStore.$patch((state) => {
          state.patientAssets = patientAssets
          state.patientInfo = patientInfo
        })
      })
      .then(() => {
        fetchProgram().then((patientProgram) => {
          patientStore.$patch((state) => {
            state.patientProgram = patientProgram
          })
          resolve()
        })
      })
      .catch(reject)
  })
}
