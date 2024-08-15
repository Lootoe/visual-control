import { subscribeProgramUpdate } from './subscribeProgramUpdate'
import { __initElectric } from './init'

const initElectric = () => {
  return new Promise((resolve, reject) => {
    __initElectric()
    subscribeProgramUpdate()
    resolve()
  })
}

export { initElectric }
