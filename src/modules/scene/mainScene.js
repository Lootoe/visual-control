import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'
import { useSceneStoreHook } from '@/store/useSceneStore'
const { cacheMainSceneObject } = useSceneStoreHook()

// 加速射线检测的重中之重
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

const sceneConfig = {
  // 场景背景颜色
  backgroundColor: '#232A3B',
  // 相机可视距离
  cameraFar: 1000,
  // 镜头距离原点距离
  screenDistance: 80,
  // control的距离限制
  zoomLimit: [20, 500],
}

export const renderMainScene = (selector, config) => {
  // config
  let currentConfig = Object.assign(sceneConfig, config)
  const { backgroundColor, cameraFar, screenDistance, zoomLimit } = currentConfig
  cacheMainSceneObject('config', currentConfig)

  // render
  const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  const dom = document.querySelector(selector)
  const width = dom.clientWidth
  const height = dom.clientHeight
  renderer.setSize(width, height)
  dom.appendChild(renderer.domElement)

  // scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(backgroundColor)
  cacheMainSceneObject('scene', scene)

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, cameraFar)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.position.set(0, 0, screenDistance)
  scene.add(camera)
  cacheMainSceneObject('camera', camera)

  // controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = zoomLimit[0]
  controls.maxDistance = zoomLimit[1]
  cacheMainSceneObject('controls', controls)

  // resize
  const onWindowResize = () => {
    const dom = document.querySelector(selector)
    const width = dom.clientWidth
    const height = dom.clientHeight
    if (camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
  }
  window.addEventListener('resize', onWindowResize)

  // anim
  const renderLoop = () => {
    requestAnimationFrame(renderLoop)
    controls.update()
    renderer.render(scene, camera)
  }

  renderLoop()
}
