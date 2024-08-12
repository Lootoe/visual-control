/**
 * *需要管理核团
 * ?更改核团颜色
 * ?控制核团显示隐藏
 */
import * as THREE from 'three'
import { useNucleusStoreHook } from '@/store/useNucleusStore'
const { getNucleusList } = useNucleusStoreHook()

const splitRGBA = (color) => {
  // 提取单纯的RGB和Alpha
  // 因为emissive不支持alpha，需要设置opacity
  const numReg = /\d+/g
  const arr = color.match(numReg)
  let R, G, B
  R = arr[0]
  G = arr[1]
  B = arr[2]
  const alpha = arr[4] ? `${arr[3]}.${arr[4]}` : `${arr[3]}`
  return { pure: `rgb(${R},${G},${B})`, alpha }
}

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
