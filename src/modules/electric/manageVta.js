/**
 * 当所选触点变化、幅值变化、同步异步刺激等变化时
 * 我们决定是否要重新加载新的VTA模型，销毁旧模型，亦或是对现有模型进行Cutoff
 */

import {
  isCombinationChanged,
  isAmplitudeChanged,
  isAmplitudeZero,
  calcMeshIsLoaded,
} from './diffVta'

const commandEnum = {
  DELETE: 'DeleteMesh',
  UPDATE: 'UpdateMesh',
  HIDE: 'HideMesh',
  CUT: 'CutMesh',
  NONE: 'DoNothing',
}

export const manageVta = (newVtaTable, oldVtaTable) => {
  return
}
