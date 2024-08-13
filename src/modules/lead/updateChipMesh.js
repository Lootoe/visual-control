/**
 * *当Program改变时，我们实时更新电极片模型
 * ?改变电极片颜色
 */
import * as THREE from 'three'
import usePatientStoreHook from '@/store/usePatientStore'
import useLeadStoreHook from '@/store/useLeadStore'

const patientStore = usePatientStoreHook()
const leadStore = useLeadStoreHook()

export const subscribeProgramUpdate = () => {
  patientStore.$subscribe((mutation, state) => {
    const porgram = state.patientProgram
    // 解析program，并根据program更新电极片颜色和userData
    // !电场模块也会订阅，但是不在这里处理
    // 第一层forEach是多根电极
    // 第二层forEach一根电极有多个Program
    // 第三层forEach才是遍历nodes更新电极片
    Object.values(porgram).forEach((arr) => {
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
            const userData = { position, node, index }
            mesh.userData = userData
            mesh.material.color = new THREE.Color(target.color)
          })
        }
      })
    })
  })
}
