import { useRoute } from 'vue-router'
import initAdminPatient from './admin'
import { renderScene } from '@/modules/scene'
import { configMNI152 } from '@/modules/matrix'
import { useSceneStoreHook } from '@/store/useSceneStore'
import { usePatientStoreHook } from '@/store/usePatientStore'

const { getExtraData, getMainSceneManager } = useSceneStoreHook()
const { getPatientInfo, getPatientProgram, getPatientAssets } = usePatientStoreHook()

const logData = () => {
  console.log('【SceneExtraData】', getExtraData())
  console.log('【MainSceneManager】', getMainSceneManager())
  console.log('【PatientInfo】', getPatientInfo())
  console.log('【PatientProgram】', getPatientProgram())
  console.log('【PatientAssets】', getPatientAssets())
}

const handleAdmin = () => {
  // 从URL获取IPGSN
  const route = useRoute()
  const queryParams = route.query
  renderScene({
    selector: '.main-scene',
    config: {},
  })
    .then(() => {
      return initAdminPatient(queryParams)
    })
    .then(() => {
      return configMNI152()
    })
    .then(() => {
      logData()
    })
}

export default () => {
  const SRENV = globalThis.SRENV
  if (SRENV.IS_PLATFORM_ADMIN) {
    handleAdmin()
  }
}
