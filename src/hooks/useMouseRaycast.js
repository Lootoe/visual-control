import * as THREE from 'three'

export const useMouseRaycast = (event, camera, detectTargets, name, callback) => {
  // 监听点击事件
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  // 计算鼠标或触摸点的位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  // 更新射线
  raycaster.setFromCamera(mouse, camera)
  // 计算与所有对象的交点
  // 处理点击事件
  // 目前只有电极片的点击事件
  const intersects = raycaster.intersectObjects(detectTargets, true)
  if (intersects.length > 0) {
    const res = intersects.find((v) => v.object.name === name && v.object.visible === true)
    if (res) {
      const pos = { x: event.clientX, y: event.clientY }
      callback(true, res.object, pos)
    } else {
      callback(false, null)
    }
  } else {
    callback(false, null)
  }
}
