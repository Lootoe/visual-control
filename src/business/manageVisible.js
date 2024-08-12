/**
 * *需要管理电极、坐标轴、皮层的显示和隐藏
 */

import { changeLeadVisible } from '@/modules/lead'
import { changeAddonsVisible } from '@/modules/addons'

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
