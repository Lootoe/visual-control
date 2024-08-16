import { useRoute } from 'vue-router'
import initAdminPatient from '@/core/interface/admin'
import { initScene } from '@/modules/scene'
import { initMatrix } from '@/modules/matrix'
import { initNucleus } from '@/modules/nucleus'
import { initLead, updateProgramOnClickedChip } from '@/modules/lead'
import { initFiber } from '@/modules/fiber'
import { initAxesHelper, initCortex, initBrain } from '@/modules/addons'
import { initFilter } from '@/modules/filter'
import { initElectric } from '@/modules/electric'

import useSceneStoreHook from '@/store/useSceneStore'
import usePatientStoreHook from '@/store/usePatientStore'
import useNucleusStoreHook from '@/store/useNucleusStore'
import useLeadStoreHook from '@/store/useLeadStore'
import useFiberStoreHook from '@/store/useFiberStore'
import useAddonStoreHook from '@/store/useAddonStore'
import useLoadingStoreHook from '@/store/useLoadingStore'
import useFilterStoreHook from '@/store/useFilterStore'

const sceneStore = useSceneStoreHook()
const patientStore = usePatientStoreHook()
const nucleusStore = useNucleusStoreHook()
const leadStore = useLeadStoreHook()
const fiberStore = useFiberStoreHook()
const addonStore = useAddonStoreHook()
const loadingStore = useLoadingStoreHook()
const filterStore = useFilterStoreHook()

const logData = () => {
  console.log('【MainSceneManager】', sceneStore.mainSceneManager)
  console.log('【PatientInfo】', patientStore.patientInfo)
  console.log('【PatientProgram】', patientStore.patientProgram)
  console.log('【PatientAssets】', patientStore.patientAssets)
  console.log('【NucleusList】', nucleusStore.nucleusList)
  console.log('【LeadList】', leadStore.leadList)
  console.log('【FiberList】', fiberStore.fiberList.length)
  console.log('【Addons】', addonStore.addons)
  console.log('【ChipFilter】', filterStore.chipFilter)
  console.log('【NucleusFilter】', filterStore.nucleusFilter)
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
  loadingStore.loading = true
  loadingStore.loadingText = '正在初始化场景'
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  })
    .then(() => {
      loadingStore.loadingText = '正在下载患者影像'
      return initAdminPatient(queryParams)
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      loadingStore.loadingText = '正在处理核团'
      return initNucleus()
    })
    .then(() => {
      loadingStore.loadingText = '正在处理电极'
      return initLead()
    })
    .then(() => {
      loadingStore.loadingText = '正在处理神经纤维'
      return initFiber()
    })
    .then(() => {
      return initFilter()
    })
    .then(() => {
      loadingStore.loadingText = '加载成功'
      loadingStore.loading = false
      logData()
    })
    .then(() => {
      // 预览端，采用自己造的Program
      updateProgramOnClickedChip()
      initAxesHelper()
      initBrain()
      initCortex()
      initElectric()
    })
}