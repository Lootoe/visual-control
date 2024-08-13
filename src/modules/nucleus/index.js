import { __initNucleus } from './init'
import { displayClickedNucleusName } from './displayClickedNucleusName'
import { changeNucleusVisible, changeNucleusColor } from './manageNucleusMesh'

// displayClickedNucleusName可以与initNucleus合一起
const initNucleus = () => {
  return new Promise((resolve, reject) => {
    __initNucleus()
      .then(() => {
        displayClickedNucleusName()
        resolve()
      })
      .catch(reject)
  })
}

export { initNucleus, changeNucleusVisible, changeNucleusColor }
