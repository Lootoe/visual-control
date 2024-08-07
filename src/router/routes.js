export const routes = [
  {
    path: '/',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/error/router',
    component: () => import('@/pages/Error/Router.vue'),
  },
]
