import * as THREE from 'three'

export const createPoleMaterial = () => {
  return new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.6,
    transparent: true,
    side: THREE.DoubleSide,
  })
}

/**生成发光Alpha贴图 */
const createEmissiveMap = (
  width = 400,
  height = 400,
  text = 'hello',
  fontSize = 80,
  bgColor = '#000000',
  textColor = '#ffffff'
) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)
  ctx.beginPath()
  ctx.translate(0, height / 2)
  ctx.fillStyle = textColor
  const font = 'normal ' + fontSize + 'px' + ' sans-serif'
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let textWidth = ctx.measureText(text).width
  ctx.fillText(text, width / 4 - textWidth / 2, 0)
  ctx.fillText(text, width * (3 / 4) - textWidth / 2, 0)
  return canvas
}

/**生成电极材质，带文字标注 */
export const createChipMaterial = (width, height, text, fontSize) => {
  const texture = new THREE.CanvasTexture(createEmissiveMap(width, height, text, fontSize))
  return new THREE.MeshStandardMaterial({
    color: '#000',
    emissiveMap: texture,
    transparent: false,
    emissive: 0xffffff,
    side: THREE.DoubleSide,
    metalness: 1,
    roughness: 0.6,
  })
}
