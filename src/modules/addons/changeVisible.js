/**
 * *需要管理电极、坐标轴、皮层的显示和隐藏
 */

import useAddonStoreHook from '@/store/useAddonStore'
import useLeadStoreHook from '@/store/useLeadStore'

const addnonStore = useAddonStoreHook()
const leadStore = useLeadStoreHook()

const changeLeadVisible = (flag = false) => {
  const leadList = leadStore.leadList
  // 电极柱
  Object.values(leadList).forEach((lead) => {
    lead.mesh.visible = flag
    // 电极片
    const chips = lead.chips
    chips.forEach((chip) => {
      const chipMesh = chip.mesh
      chipMesh.visible = flag
    })
  })
}

const changeAddonsVisible = (key, flag) => {
  let target = null
  if (key === 'axesHelper') {
    target = addnonStore.addnons.axesHelper
  }
  if (key === 'cortex') {
    target = addnonStore.addnons.cortex
  }
  target.mesh.visible = flag
  target.visible = flag
}

export const changeVisible = (type, visible) => {
  if (type === 'lead') {
    changeLeadVisible(visible)
  }
  if (type === 'axesHelper') {
    changeAddonsVisible('axesHelper', visible)
  }
  if (type === 'cortex') {
    changeAddonsVisible('cortex', visible)
  }
}
