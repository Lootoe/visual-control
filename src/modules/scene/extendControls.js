import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 扩展 OrbitControls 以检测 Pan 操作
export class ExtendedOrbitControls extends OrbitControls {
  constructor(camera, domElement) {
    super(camera, domElement)

    this.isPanning = false

    // 监听鼠标或触摸移动事件
    domElement.addEventListener('mousedown', (event) => this.onMouseDown(event))
    domElement.addEventListener('mouseup', (event) => this.onMouseUp(event))

    // 同样处理触摸事件
    domElement.addEventListener('touchstart', (event) => this.onTouchStart(event))
    domElement.addEventListener('touchend', (event) => this.onTouchEnd(event))
  }

  onMouseDown(event) {
    if (event.button === 2 || (event.button === 0 && event.ctrlKey)) {
      // 右键或Ctrl+左键平移
      this.isPanning = true
    }
  }

  onMouseUp() {
    this.isPanning = false
  }

  onTouchStart(event) {
    if (event.touches.length === 2) {
      // 双指触摸平移
      this.isPanning = true
    }
  }

  onTouchEnd() {
    this.isPanning = false
  }
}
