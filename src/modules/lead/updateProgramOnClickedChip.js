import { useMouseRaycast } from '@/libs/mouseRaycast'
import { updateProgramByNode } from '@/core/mockProgram'
import useSceneStoreHook from '@/store/useSceneStore'

const sceneStore = useSceneStoreHook()

export const updateProgramOnClickedChip = () => {
  const mainSceneManager = sceneStore.mainSceneManager
  const camera = mainSceneManager.camera
  const detectTargets = mainSceneManager.scene.children
  const dom = mainSceneManager.dom
  dom.addEventListener('click', (event) => {
    useMouseRaycast({ event, camera, detectTargets, name: 'chip' }, (raycased, result) => {
      if (raycased) {
        const userData = result.userData
        if (!userData) return
        const { position, index, node } = userData
        // 0\1\2
        let newNode = (node + 1) % 3
        const params = {
          node: newNode,
          position,
          index,
        }
        // 同时更新电极本身的userData
        updateProgramByNode(params)
      }
    })
  })
}
