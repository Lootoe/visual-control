import { useRoute } from 'vue-router'
import initAdminPatient from './admin'
import { initScene } from '@/modules/scene'
import { initMatrix } from '@/modules/matrix'
import { initNucleus } from '@/modules/nucleus'
import { initLead } from '@/modules/lead'
import { initFiber } from '@/modules/fiber'
import { initAddons } from '@/modules/addons'

import { useSceneStoreHook } from '@/store/useSceneStore'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useNucleusStoreHook } from '@/store/useNucleusStore'
import { useLeadStoreHook } from '@/store/useLeadStore'
import { useFiberStoreHook } from '@/store/useFiberStore'
import { useAddonStoreHook } from '@/store/useAddonStore'

const { getMainSceneManager } = useSceneStoreHook()
const { getPatientInfo, getPatientProgram, getPatientAssets } = usePatientStoreHook()
const { getNucleusList } = useNucleusStoreHook()
const { getLeadList } = useLeadStoreHook()
const { getFiberList } = useFiberStoreHook()
const { getAddons } = useAddonStoreHook()

const logData = () => {
  console.log('【MainSceneManager】', getMainSceneManager())
  console.log('【PatientInfo】', getPatientInfo())
  console.log('【PatientProgram】', getPatientProgram())
  console.log('【PatientAssets】', getPatientAssets())
  console.log('【NucleusList】', getNucleusList().value)
  console.log('【LeadList】', getLeadList().value)
  console.log('【FiberList】', getFiberList().length)
  console.log('【Addons】', getAddons())
}

const handleAdmin = () => {
  // 从URL获取IPGSN
  const route = useRoute()
  const queryParams = route.query
  initScene({
    selector: '.main-scene',
    config: {},
  })
    .then(() => {
      return initAdminPatient(queryParams)
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      return initNucleus()
    })
    .then(() => {
      return initLead()
    })
    .then(() => {
      return initFiber()
    })
    .then(() => {
      return initAddons()
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
