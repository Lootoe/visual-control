import initAdminPatient from '@/core/interface/admin'
import initPCPatient from '@/core/interface/pc'
import initPadPatient from '@/core/interface/pad'
import { switchTo2D } from '@/core/interface/pad'
import initDemoPatient from '@/core/interface/demo'
import { initScene } from '@/modules/scene'
import { initMatrix } from '@/modules/matrix'
import { initNucleus } from '@/modules/nucleus'
import { initLead, updateProgramOnClickedChip } from '@/modules/lead'
import { initFiber } from '@/modules/fiber'
import { initAxesHelper, initCortex, initBrain } from '@/modules/addons'
import { initFilter } from '@/modules/filter'
import { initElectric } from '@/modules/electric'
import { useRouter } from 'vue-router'

import useSceneStoreHook from '@/store/useSceneStore'
import usePatientStoreHook from '@/store/usePatientStore'
import useNucleusStoreHook from '@/store/useNucleusStore'
import useLeadStoreHook from '@/store/useLeadStore'
import useFiberStoreHook from '@/store/useFiberStore'
import useAddonStoreHook from '@/store/useAddonStore'
import useFilterStoreHook from '@/store/useFilterStore'
import useLoadingCoverHook from '@/components/LoadingCover/useLoadingCover'

const sceneStore = useSceneStoreHook()
const patientStore = usePatientStoreHook()
const nucleusStore = useNucleusStoreHook()
const leadStore = useLeadStoreHook()
const fiberStore = useFiberStoreHook()
const addonStore = useAddonStoreHook()
const filterStore = useFilterStoreHook()
const { loadBegin, loadUpdate, loadEnd, loadFail } = useLoadingCoverHook()

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
  if (SRENV.IS_PLATFORM_ADMIN()) {
    handleAdmin()
  }
  if (SRENV.IS_PLATFORM_PC()) {
    handlePC()
  }
  if (SRENV.IS_PLATFORM_PAD()) {
    if (SRENV.IS_MODE_DEV()) {
      const sceneBg = import.meta.env.VITE_SCENE_BG
      initScene({
        mainSceneSelector: '.main-scene',
        mainSceneConfig: { backgroundColor: sceneBg },
        assistSceneSelector: '.assist-scene',
        assistSceneConfig: { backgroundColor: sceneBg },
      })
    } else {
      handlePad()
    }
  }
  if (SRENV.IS_PLATFORM_DEMO()) {
    handleDemo()
  }
}

const handleAdmin = () => {
  // 从URL获取IPGSN
  const router = useRouter()
  const queryParams = router.currentRoute.value.query
  const sceneBg = import.meta.env.VITE_SCENE_BG
  loadBegin({
    content: '正在初始化场景',
    delay: 500,
    opacity: 0.8,
  })
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  })
    .then(() => {
      loadUpdate({ content: '正在加载患者影像' })
      return initAdminPatient(queryParams)
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      loadUpdate({ content: '正在加载核团' })
      return initNucleus()
    })
    .then(() => {
      loadUpdate({ content: '正在加载电极' })
      return initLead()
    })
    .then(() => {
      loadUpdate({ content: '正在加载神经纤维' })
      return initFiber()
    })
    .then(() => {
      return initFilter()
    })
    .then(() => {
      loadUpdate({ content: '加载完成' })
      loadEnd()
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
    .catch((err) => {
      loadFail(err)
      console.error(err)
    })
}

const handlePC = () => {
  const sceneBg = import.meta.env.VITE_SCENE_BG
  loadBegin({
    content: '正在初始化场景',
    delay: 500,
    opacity: 0.8,
  })
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  })
    .then(() => {
      loadUpdate({ content: '正在加载患者影像' })
      return initPCPatient()
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      loadUpdate({ content: '正在加载核团' })
      return initNucleus()
    })
    .then(() => {
      loadUpdate({ content: '正在加载电极' })
      return initLead()
    })
    .then(() => {
      loadUpdate({ content: '正在加载神经纤维' })
      return initFiber()
    })
    .then(() => {
      return initFilter()
    })
    .then(() => {
      loadUpdate({ content: '加载完成' })
      loadEnd()
      logData()
    })
    .then(() => {
      initAxesHelper()
      initBrain()
      initCortex()
      initElectric()
    })
    .catch((err) => {
      loadFail(err)
      console.error(err)
    })
}

const handlePad = () => {
  const sceneBg = import.meta.env.VITE_SCENE_BG
  loadBegin({
    content: '正在初始化场景',
    delay: 500,
    opacity: 0.8,
  })
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  })
    .then(() => {
      loadUpdate({ content: '正在加载患者影像' })
      return initPadPatient()
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      loadUpdate({ content: '正在加载核团' })
      return initNucleus()
    })
    .then(() => {
      loadUpdate({ content: '正在加载电极' })
      return initLead()
    })
    .then(() => {
      loadUpdate({ content: '正在加载神经纤维' })
      return initFiber()
    })
    .then(() => {
      return initFilter()
    })
    .then(() => {
      loadUpdate({ content: '加载完成' })
      loadEnd()
      logData()
    })
    .then(() => {
      initAxesHelper()
      initBrain()
      initCortex()
      initElectric()
    })
    .catch((err) => {
      switchTo2D()
      loadFail(err)
      console.error(err)
    })
}

const handleDemo = () => {
  // 从URL获取IPGSN
  const router = useRouter()
  const queryParams = router.currentRoute.value.query
  const sceneBg = import.meta.env.VITE_SCENE_BG
  loadBegin({
    content: '正在初始化场景',
    delay: 500,
    opacity: 0.8,
  })
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  })
    .then(() => {
      loadUpdate({ content: '正在加载患者影像' })
      return initDemoPatient({ demoId: queryParams.demoId })
    })
    .then(() => {
      return initMatrix()
    })
    .then(() => {
      loadUpdate({ content: '正在加载核团' })
      return initNucleus()
    })
    .then(() => {
      loadUpdate({ content: '正在加载电极' })
      return initLead()
    })
    .then(() => {
      loadUpdate({ content: '正在加载神经纤维' })
      return initFiber()
    })
    .then(() => {
      return initFilter()
    })
    .then(() => {
      loadUpdate({ content: '加载完成' })
      loadEnd()
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
    .catch((err) => {
      loadFail(err)
      console.error(err)
    })
}
