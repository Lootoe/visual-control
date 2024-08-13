/**
 * *需要管理核团
 * ?更改核团颜色
 * ?控制核团显示隐藏
 */
import * as THREE from 'three'
import { useNucleusStoreHook } from '@/store/useNucleusStore'
const { getNucleusList } = useNucleusStoreHook()
import { splitRGBA } from '@/utils/tools'

export const changeNucleusVisible = (name, flag) => {
  const nucleusList = getNucleusList()
  const target = nucleusList.value.find((v) => v.en === name)
  if (target) {
    target.mesh.visible = flag
  }
}

export const changeNucleusColor = (name, color) => {
  const nucleusList = getNucleusList()
  const target = nucleusList.value.find((v) => v.en === name)
  if (target) {
    const { pure, alpha } = splitRGBA(color)
    target.mesh.material.color = new THREE.Color(pure)
    target.mesh.material.opacity = Number(alpha)
  }
}
