const platformType = globalThis.SRENV.PLATFORM_TYPE
const platform = globalThis.SRENV.PLATFORM

const DebugRoutes = [
  {
    path: '/debug/comsol',
    component: () => import('@/pages/Debug/Comsol/Index.vue'),
  },
  {
    path: '/debug/test',
    component: () => import('@/pages/Debug/Test/Index.vue'),
  },
]

const DEMORoutes = [
  {
    path: '/demo/index',
    component: () => import('@/pages/Demo/Index.vue'),
  },
  {
    path: '/demo/patient',
    component: () => import('@/pages/Demo/SelectPatient.vue'),
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
