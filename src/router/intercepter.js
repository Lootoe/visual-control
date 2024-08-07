import init3DAssets from '@/interface'

const init3DAssetsHook = (to, from) => {
  // !在进入页面时，初始化可视化影像数据
  if (from.path === '/') {
    init3DAssets()
  }
}

const decidePageToGo = (to, from, next) => {
  // !在进入页面之前，根据环境决定要进哪个页面
  // !如果发现进的页面和环境不一致，则进入错误页面
  const platformType = globalThis.SRENV.PLATFORM_TYPE
  const platform = globalThis.SRENV.PLATFORM
  const urlList = {
    [platformType.DEBUG]: '/debug',
    [platformType.DEMO]: '/demo',
    [platformType.PC]: '/pc',
    [platformType.PAD]: '/pad',
    [platformType.ADMIN]: '/admin',
  }
  // 当前环境的首页
  const indexUrl = urlList[platform]
  // 错误路由页面
  const errorRouterUrl = '/error/router'
  // 当前环境允许的页面
  const allowedUrls = [indexUrl, errorRouterUrl]
  if (from.path === '/') {
    if (to.path === '/') {
      next(indexUrl)
    } else if (allowedUrls.includes(to.path)) {
      next()
    } else {
      next(errorRouterUrl)
    }
  }
}

export const beforeHandle = (to, from, next) => {
  decidePageToGo(to, from, next)
}

export const afterHanle = (to, from) => {
  init3DAssetsHook(to, from)
}
