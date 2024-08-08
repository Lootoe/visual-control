import init3DAssets from '@/interface'

const init3DAssetsHook = (to, from) => {
  // !在进入页面时，初始化可视化影像数据
  if (from.path === '/') {
    init3DAssets()
  }
}

export const beforeHandle = (to, from, next) => {
  next()
}

export const afterHanle = (to, from) => {
  init3DAssetsHook(to, from)
}
