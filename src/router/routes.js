const platformType = globalThis.SRENV.PLATFORM_TYPE
const platform = globalThis.SRENV.PLATFORM

const DebugRoutes = [
  {
    path: '/debug/index',
    component: () => import('@/pages/Debug/Index.vue'),
  },
]

const DEMORoutes = [
  {
    path: '/demo/index',
    component: () => import('@/pages/Demo/Index.vue'),
  },
]

const PCRoutes = [
  {
    path: '/pc/index',
    component: () => import('@/pages/PC/Index.vue'),
  },
]

const PADRoutes = [
  {
    path: '/pad/index',
    component: () => import('@/pages/Pad/Index.vue'),
  },
]

const ADMINRoutes = [
  {
    path: '/admin/index',
    component: () => import('@/pages/Admin/Index.vue'),
  },
]

const routesManager = {
  [platformType.DEBUG]: DebugRoutes,
  [platformType.DEMO]: DEMORoutes,
  [platformType.PC]: PCRoutes,
  [platformType.PAD]: PADRoutes,
  [platformType.ADMIN]: ADMINRoutes,
}

const allowedRoutes = routesManager[platform]

const defaultRoutes = [
  {
    path: '/',
    redirect: allowedRoutes[0].path,
  },
]

const currentEnvRoutes = [...allowedRoutes, ...defaultRoutes]
export default currentEnvRoutes
