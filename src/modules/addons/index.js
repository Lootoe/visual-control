import { initAxesHelper, initCortex, __initBrain } from './init'
import { changeVisible } from './changeVisible'
import { brainSyncRotate } from './brainSyncRotate'

// brainSyncRotate依赖于initBrain，所以他俩可以合一块
const initBrain = () => {
  return new Promise((resolve, reject) => {
    __initBrain()
      .then(() => {
        brainSyncRotate()
        resolve()
      })
      .catch(reject)
  })
}

export { initAxesHelper, initCortex, initBrain, changeVisible }
