import { brainSyncRotate } from './brainSyncRotate'
import { displayClickedNucleusName } from './displayClickedNucleusName'

export const init3DHooks = () => {
  brainSyncRotate()
  displayClickedNucleusName()
}
