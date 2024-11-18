import { createVNode, render } from 'vue'
import LoadingCoverComponent from './loadingCover.vue'

const root = document.createElement('div')
root.setAttribute('class', 'loading-cover-root')
document.body.appendChild(root)

export default function useLoadingCover() {
  const state = reactive({
    content: '加载中',
    opacity: 1,
    loading: false,
    failed: false,
    failedReason: '',
  })

  const loadBegin = (config) => {
    reset()
    state.loading = true
    if (config.content) state.content = config.content
    if (config.delay) state.delay = config.delay
    if (config.opacity) state.opacity = config.opacity

    if (root.childNodes.length !== 0) {
      root.innerHTML = ''
    }

    const vNode = createVNode(LoadingCoverComponent, state) // 使用 toRefs
    render(vNode, root)
  }

  const loadUpdate = (config) => {
    if (config.content) state.content = config.content
    if (config.delay) state.delay = config.delay
    if (config.opacity) state.opacity = config.opacity
    const vNode = createVNode(LoadingCoverComponent, state) // 使用 toRefs
    render(vNode, root)
  }

  const loadEnd = () => {
    render(null, root)
    state.loading = false
  }

  const loadFail = (reason) => {
    state.failed = true
    state.failedReason = reason || '加载失败'
  }

  const reset = () => {
    state.content = '加载中'
    state.delay = 500
    state.opacity = 1
    state.loading = false
    state.failed = false
    state.failedReason = ''
  }

  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  return { loadBegin, loadUpdate, loadEnd, loadFail, delay }
}
