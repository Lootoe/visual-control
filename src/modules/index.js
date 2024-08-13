import { useRoute } from 'vue-router'
import initAdminPatient from '@/interface/admin'
import { initScene } from '@/modules/scene'
import { initMatrix } from '@/modules/matrix'
import { initNucleus } from '@/modules/nucleus'
import { initLead } from '@/modules/lead'
import { initFiber } from '@/modules/fiber'
import { initAxesHelper, initCortex, initBrain } from '@/modules/addons'
import { initFilter } from '@/modules/filter'

import { useSceneStoreHook } from '@/store/useSceneStore'
import { usePatientStoreHook } from '@/store/usePatientStore'
import { useNucleusStoreHook } from '@/store/useNucleusStore'
import { useLeadStoreHook } from '@/store/useLeadStore'
import { useFiberStoreHook } from '@/store/useFiberStore'
import { useAddonStoreHook } from '@/store/useAddonStore'
import { useLoadingStoreHook } from '@/store/useLoadingStore'
import { useFilterStoreHook } from '@/store/useFilterStore'

const { getMainSceneManager } = useSceneStoreHook()
const { getPatientInfo, getPatientProgram, getPatientAssets } = usePatientStoreHook()
const { getNucleusList } = useNucleusStoreHook()
const { getLeadList } = useLeadStoreHook()
const { getFiberList } = useFiberStoreHook()
const { getAddons } = useAddonStoreHook()
const { setLoadingProps } = useLoadingStoreHook()
const { getChipFilter, getNucleusFilter } = useFilterStoreHook()

const logData = () => {
  console.log('【MainSceneManager】', getMainSceneManager())
  console.log('【PatientInfo】', getPatientInfo())
  console.log('【PatientProgram】', getPatientProgram())
  console.log('【PatientAssets】', getPatientAssets())
  console.log('【NucleusList】', getNucleusList().value)
  console.log('【LeadList】', getLeadList().value)
  console.log('【FiberList】', getFiberList().length)
  console.log('【Addons】', getAddons())
  console.log('【ChipFilter】', getChipFilter().value)
  console.log('【NucleusFilter】', getNucleusFilter().value)
}

export default () => {
  const SRENV = globalThis.SRENV
  if (SRENV.IS_PLATFORM_ADMIN) {
    handleAdmin()
  }
}

const handleAdmin = () => {
  // 从URL获取IPGSN
  const route = useRoute()
  const queryParams = route.query
  const sceneBg = import.meta.env.VITE_SCENE_BG
  setLoadingProps('loading', true)
  setLoadingProps('loadingText', '正在初始化场景')
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  })
    .then(() => {
      setLoadingProps('loadingText', '正在下载患者影像')
      return initAdminPatient(queryParams)
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      setLoadingProps('loadingText', '正在处理核团')
      return initNucleus()
    })
    .then(() => {
      setLoadingProps('loadingText', '正在处理电极')
      return initLead()
    })
    .then(() => {
      setLoadingProps('loadingText', '正在处理神经纤维')
      return initFiber()
    })
    // .then(() => {
    //   setLoadingProps('loadingText', '正在处理皮层')
    //   return initAddons()
    // })
    // .then(() => {
    //   return initFilters()
    // })
    // .then(() => {
    //   return fiberTracing()
    // })
    .then(() => {
      setLoadingProps('loadingText', '加载成功')
      setLoadingProps('loading', false)
      logData()
    })
}
