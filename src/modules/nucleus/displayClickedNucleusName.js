/**
 * *展示点击的核团名称
 * ?点击同一核团就切换名称是否显示
 * ?点击非核团就隐藏名称
 * ?旋转视角就隐藏名称
 * ?点击其核团就隐藏当前核团，并且显示其它核团
 */
import { useMouseRaycast } from '@/hooks/mouseRaycast'
import useSceneStoreHook from '@/store/useSceneStore'

const sceneStore = useSceneStoreHook()

const createNameUI = (name, position) => {
  // 创建一个新的div元素
  const nameUI = document.createElement('div')
  nameUI.id = 'name-ui'
  nameUI.style.position = 'absolute'
  nameUI.style.left = `${position.x}px`
  nameUI.style.top = `${position.y}px`
  nameUI.style.padding = '0.1rem 0.1rem'
  nameUI.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  nameUI.style.color = 'white'
  nameUI.style.fontSize = '0.14rem'
  nameUI.style.borderRadius = '0.2rem'
  nameUI.style.pointerEvents = 'none' // UI不应影响点击
  nameUI.style.zIndex = 999 // UI不应影响点击

  // 设置名称
  nameUI.innerText = name

  // 添加到body
  document.body.appendChild(nameUI)
}

const removeNameUI = () => {
  const nameUI = document.getElementById('name-ui')
  if (nameUI) {
    nameUI.remove()
  }
}

export const displayClickedNucleusName = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const camera = mainSceneManager.camera
  const detectTargets = mainSceneManager.scene.children
  const controls = mainSceneManager.controls
  const dom = mainSceneManager.dom
  dom.addEventListener('click', (event) => {
    removeNameUI()
    useMouseRaycast(
      { event, camera, detectTargets, name: 'nucleus' },
      (raycased, result, mousePos) => {
        if (raycased) {
          const userData = result.userData
          if (!userData) return
          const { displayName } = userData
          createNameUI(displayName, mousePos)
        }
      }
    )
  })
  window.addEventListener('mousewheel', () => {
    removeNameUI()
  })
  controls.addEventListener('change', () => {
    removeNameUI()
  })
  window.onload = () => {
    removeNameUI()
  }
}
