import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import * as THREE from 'three'
import useSceneStoreHook from '@/store/useSceneStore'
const sceneStore = useSceneStoreHook()

export const initOutlineEffect = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const renderer = mainSceneManager.renderer
  const scene = mainSceneManager.scene
  const camera = mainSceneManager.camera
  const composer = new EffectComposer(renderer)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  )

  composer.addPass(outlinePass)
  sceneStore.outlinePass = outlinePass
  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  const effectFXAA = new ShaderPass(FXAAShader)
  effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
  composer.addPass(effectFXAA)

  function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight

    composer.setSize(width, height)
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  requestAnimationFrame(() => {
    composer.render()
  })
  return outlinePass
}

export const updateOutlineEffect = (selectedMeshes) => {
  sceneStore.outlinePass.selectedObjects = selectedMeshes
}
