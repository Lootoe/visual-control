import * as THREE from 'three'
import useLeadStoreHook from '@/store/useLeadStore'

const leadStore = useLeadStoreHook()

export const updateChip = (newProgram) => {
  // 解析program，并根据program更新电极片颜色和userData
  // !电场模块也会订阅，但是不在这里处理
  // 第一层forEach是多根电极
  // 第二层forEach一根电极有多个Program
  // 第三层forEach才是遍历nodes更新电极片
  Object.values(newProgram).forEach((arr) => {
    arr.forEach((program) => {
      const { position, nodes, display } = program
      if (display === 1) {
        const lead = leadStore.leadList[position]
        const chips = lead.chips
        nodes.forEach((obj) => {
          const { node, color, index, amplitude } = obj
          const target = chips.find((v) => v.index === index)
          target.node = node
          const defaultColor = '#27386f'
          target.color = color === '' ? defaultColor : color
          target.amplitude = amplitude
          const mesh = target.mesh
          const fixed = { position, node, index }
          const userData = Object.assign(target.mesh.userData, fixed)
          mesh.userData = userData
          mesh.material.color = new THREE.Color(target.color)
        })
      }
    })
  })
}
