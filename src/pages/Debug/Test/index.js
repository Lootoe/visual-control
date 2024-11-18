import { testAlphaShape } from './testAlphaShape'
import { testRenderTxt } from './testRenderTxt'
import { testSVO } from './testSVO'
import { initScene } from '@/modules/scene'

const handleDebug = () => {
  // testAlphaShape()
  testRenderTxt()
  // testSVO()
}

export const debug = () => {
  const sceneBg = import.meta.env.VITE_SCENE_BG
  initScene({
    mainSceneSelector: '.main-scene',
    mainSceneConfig: { backgroundColor: sceneBg },
    assistSceneSelector: '.assist-scene',
    assistSceneConfig: { backgroundColor: sceneBg },
  }).then(() => {
    return handleDebug()
  })
}
