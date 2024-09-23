import * as THREE from 'three'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'
import useSceneStoreHook from '@/store/useSceneStore'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const sceneStore = useSceneStoreHook()

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
  zoomLimit: [1, 500],
}

export const initMainScene = (selector, config) => {
  // config
  let currentConfig = Object.assign(sceneConfig, config)
  const { backgroundColor, cameraFar, screenDistance, zoomLimit } = currentConfig
  sceneStore.mainSceneManager.config = currentConfig

  // render
  const renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  const dom = document.querySelector(selector)
  sceneStore.mainSceneManager.dom = dom

  const width = dom.clientWidth
  const height = dom.clientHeight
  renderer.setSize(width, height)
  dom.appendChild(renderer.domElement)

  // scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(backgroundColor)
  sceneStore.mainSceneManager.scene = scene

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, cameraFar)
  camera.lookAt(new THREE.Vector3(0, 0, 0))
  camera.position.set(0, 0, screenDistance)
  scene.add(camera)
  sceneStore.mainSceneManager.camera = camera

  // controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = zoomLimit[0]
  controls.maxDistance = zoomLimit[1]
  sceneStore.mainSceneManager.controls = controls
  // 解决万向锁
  controls.maxPolarAngle = Math.PI * (170 / 180)
  controls.minPolarAngle = Math.PI * (10 / 180)

  // ambientLight
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  // resize
  const onWindowResize = () => {
    const dom = document.querySelector(selector)
    const width = dom.clientWidth
    const height = dom.clientHeight
    sceneStore.mainSceneManager.dom = dom
    if (camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
  }
  window.addEventListener('resize', onWindowResize)

  const stats = new Stats()
  dom.appendChild(stats.dom)
  stats.dom.style.position = 'fixed'
  stats.dom.style.width = 'fit-content'
  stats.dom.style.right = '0px'
  stats.dom.style.top = '3rem'
  stats.dom.style.left = 'auto'
  stats.dom.style.display = 'none'

  const setStats = (value) => {
    if (value) {
      stats.dom.style.display = 'block'
    } else {
      stats.dom.style.display = 'none'
    }
  }

  window.hack.setStats = setStats

  // anim
  const renderLoop = () => {
    requestAnimationFrame(renderLoop)
    controls.update()
    renderer.render(scene, camera)
    stats.update()
  }

  renderLoop()
}
