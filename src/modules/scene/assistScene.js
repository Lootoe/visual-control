import * as THREE from 'three'
import { useSceneStoreHook } from '@/store/useSceneStore'
const { cacheAssistSceneObject } = useSceneStoreHook()

const sceneConfig = {
  // 相机可视距离
  cameraFar: 100,
  // 镜头距离原点距离
  screenDistance: 4,
}

export const initAssistScene = (selector, config) => {
  // config
  let currentConfig = Object.assign(sceneConfig, config)
  const { cameraFar, screenDistance } = currentConfig
  cacheAssistSceneObject('config', currentConfig)

  // render
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  const dom = document.querySelector(selector)
  const width = dom.clientWidth
  const height = dom.clientHeight
  renderer.setSize(width, height)
  dom.appendChild(renderer.domElement)
  renderer.setClearAlpha(0)

  // scene
  const scene = new THREE.Scene()
  cacheAssistSceneObject('scene', scene)

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, cameraFar)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.position.set(0, 0, screenDistance)
  scene.add(camera)

  // ambientLight
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)
  const light = new THREE.DirectionalLight(0xcccccc, currentConfig.screenDistance)
  light.position.set(
    -currentConfig.screenDistance,
    currentConfig.screenDistance,
    currentConfig.screenDistance
  )
  scene.add(light)

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
