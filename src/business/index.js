import { brainSyncRotate } from './brainSyncRotate'
import { displayClickedNucleusName } from './displayClickedNucleusName'
import { adjustCameraPosition } from './adjustCameraPosition'

export const init3DHooks = () => {
  brainSyncRotate()
  displayClickedNucleusName()
  adjustCameraPosition()
}
