import * as THREE from 'three'
import { useSceneStoreHook } from '@/store/useSceneStore'
const { cacheAssistSceneObject } = useSceneStoreHook()

const sceneConfig = {
  // 场景背景颜色
  backgroundColor: '#232A3B',
  // 相机可视距离
  cameraFar: 1000,
  // 镜头距离原点距离
  screenDistance: 80,
}

export const initAssistScene = (selector, config) => {
  // config
  let currentConfig = Object.assign(sceneConfig, config)
  const { backgroundColor, cameraFar, screenDistance } = currentConfig
  cacheAssistSceneObject('config', currentConfig)

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
  cacheAssistSceneObject('scene', scene)

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, cameraFar)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.position.set(0, 0, screenDistance)
  scene.add(camera)

  // ambientLight
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

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
    renderer.render(scene, camera)
  }

  renderLoop()
}
