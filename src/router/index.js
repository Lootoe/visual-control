import { createRouter, createWebHashHistory } from 'vue-router'
import { beforeHandle, afterHanle } from './intercepter'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
})
router.beforeEach(beforeHandle)
router.afterEach(afterHanle)

export default router
