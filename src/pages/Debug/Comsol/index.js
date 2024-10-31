import { initScene } from '@/modules/scene'
import useLoadingStoreHook from '@/store/useLoadingStore'
const loadingStore = useLoadingStoreHook()

export const debug = () => {
  const sceneBg = import.meta.env.VITE_SCENE_BG
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  }).then(() => {
    loadingStore.loading = false
    loadingStore.loadingText = '加载完成'
  })
}

export const compileTxt = (text) => {
  // 先将每个点区分开
  const reg = /\n/g
  const arr = text.split(reg)
  const arr_notEmpty = arr.filter((v) => v !== '')
  // 再将点取出来，并且得到它的阈值
  const points = []
  const values = []
  arr_notEmpty.forEach((v) => {
    const [a, b, c, strength] = v.split(',')
    // 如果是NaN值，就不管
    const hasNaN = isNaN(a) || isNaN(b) || isNaN(c) || isNaN(strength)
    if (!hasNaN) {
      points.push([parseFloat(a), parseFloat(b), parseFloat(c)])
      values.push(parseFloat(strength))
    }
  })
  return { points, values }
}
