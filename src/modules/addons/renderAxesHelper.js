import * as THREE from 'three'
import { addMesh } from '@/modules/scene'
import { useAddonStoreHook } from '@/store/useAddonStore'
import { useSceneStoreHook } from '@/store/useSceneStore'

const { cacheAddons, getAddons } = useAddonStoreHook()
const { getMainSceneManager } = useSceneStoreHook()

const createTextByCanvas = (
  width = 400,
  height = 400,
  text = 'x',
  textColor = '#ffffff',
  fontSize = 80
) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.translate(width / 2, height / 2)
  ctx.fillStyle = textColor
  const font = 'normal ' + fontSize + 'px' + ' sans-serif'
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, 0)
  return canvas
}

const createSpriteLabel = (text, color, x, y, z) => {
  const canvas = createTextByCanvas(400, 400, text, color)
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true // 触发纹理更新
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  })
  const sprite = new THREE.Sprite(material)
  sprite.position.x = x
  sprite.position.y = y
  sprite.position.z = z
  sprite.scale.multiplyScalar(15)
  sprite.renderOrder = 9
  return sprite
}

export const renderAxesHelper = (AxesHelperLength = 100) => {
  let axes = new THREE.AxesHelper(AxesHelperLength)
  const axesX = createSpriteLabel('X', '#ff6666', AxesHelperLength + 2, 0, 0)
  const axesY = createSpriteLabel('Y', '#66ff66', 0, AxesHelperLength + 2, 0)
  const axesZ = createSpriteLabel('Z', '#6666ff', 0, 0, AxesHelperLength + 2)
  const group = new THREE.Group()
  group.add(...[axes, axesX, axesY, axesZ])
  cacheAddons('axesHelper', group)
  addMesh(group)
  const mainSceneManager = getMainSceneManager()
  mainSceneManager.controls.addEventListener('change', () => {
    updateTextDisplay(mainSceneManager.camera)
  })
}

// 当坐标轴与视线差不多平行的时候，隐藏坐标轴文字，防止遮挡视野
export const updateTextDisplay = (camera, displaytDistance = 50) => {
  const position = camera.position
  const axesGroup = getAddons().axesHelper
  const [_, axesX, axesY, axesZ] = axesGroup.children
  // 通过计算相机距离文字的距离，来控制文字显示隐藏
  const distanceX = position.distanceTo(axesX.position)
  const distanceY = position.distanceTo(axesY.position)
  const distanceZ = position.distanceTo(axesZ.position)
  axesX.visible = distanceX > displaytDistance
  axesY.visible = distanceY > displaytDistance
  axesZ.visible = distanceZ > displaytDistance
}
