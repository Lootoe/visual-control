import dsBridge from 'dsbridge'
import { convertProgram } from '../convert/convertProgram'
import { convertPatient } from '../convert/convertPatient'
import { convertAssets } from '../convert/convertAssets'
import usePatientStoreHook from '@/store/usePatientStore'

const patientStore = usePatientStoreHook()

/**输出安卓端的日志 */
const androidLog = (params) => {
  callAndroid('logAndroid', params)
}

export const isPadExist = () => {
  return dsBridge.hasNativeMethod('fetchPatient')
}

/**调用安卓的通用同步方法 */
const callAndroid = (funcName, params) => {
  if (isPadExist()) {
    dsBridge.call('logAndroid', `前端调用安卓:${funcName}`)
    return dsBridge.call(funcName, params)
  } else {
    throw new Error('未检测到安卓端方法:' + funcName)
  }
}

/**切换全屏 */
export const toggleFullScreen = (params) => {
  const payload = params ? 1 : 0
  callAndroid('resizeScreen', payload)
  androidLog('resizeScreen:' + params)
}

export const switchTo2D = () => {
  callAndroid('load2DModel')
  androidLog('load2DModel')
}

/**为安卓端绑定本地的调用方法 */
const bindUpdateProgram = () => {
  dsBridge.register('updateProgram', (programJson) => {
    androidLog('安卓调用前端:updateProgram')
    const program = JSON.parse(programJson)
    const patientProgram = convertProgram(program)
    patientStore.$patch((state) => {
      state.patientProgram = patientProgram
    })
  })
}

const fetchPatient = () => {
  const result = callAndroid('fetchPatient')
  const patient = JSON.parse(result)
  const patientInfo = convertPatient(patient)
  const patientAssets = convertAssets(patient)
  patientStore.$patch((state) => {
    state.patientAssets = patientAssets
    state.patientInfo = patientInfo
  })
  androidLog('fectchPatient:success')
  return Promise.resolve()
}

const fetchProgram = () => {
  const result = callAndroid('fetchProgram')
  const program = convertProgram(JSON.parse(result))
  patientStore.$patch((state) => {
    state.patientProgram = program
  })
  androidLog('fetchProgram:success')
  return Promise.resolve()
}

export default () => {
  return new Promise((resolve) => {
    fetchPatient().then(() => {
      fetchProgram().then(() => {
        bindUpdateProgram()
        resolve()
      })
    })
  })
}
