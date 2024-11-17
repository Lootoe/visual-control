import * as THREE from 'three'
import useLeadStoreHook from '@/store/useLeadStore'

const leadStore = useLeadStoreHook()

export const updateChip = (newProgram) => {
  // 在所有操作开始前，重置所有 chip 的 isUpdated 状态
  Object.values(leadStore.leadList).forEach((lead) => {
    lead.chips.forEach((chip) => {
      chip.isUpdated = false
    })
  })
  Object.values(newProgram).forEach((arr) => {
    arr.forEach((program) => {
      const { position, nodes, display } = program
      if (display === 1) {
        const lead = leadStore.leadList[position]
        const chips = lead.chips
        nodes.forEach((obj) => {
          const { node, color, index, amplitude } = obj
          const target = chips.find((v) => v.index === index)
          // 检查 target 是否已经被更新过
          if (target.isUpdated) {
            return // 跳过已经被更新的 chip
          }
          target.node = node
          const defaultColor = '#27386f'
          target.color = color === '' ? defaultColor : color
          target.amplitude = amplitude
          const mesh = target.mesh
          const fixed = { position, node, index }
          const userData = Object.assign(target.mesh.userData, fixed)
          mesh.userData = userData
          mesh.material.color = new THREE.Color(target.color)
          // 标记为已更新
          if (target.node !== 0) {
            target.isUpdated = true
          }
        })
      }
    })
  })
}
