import { useRoute } from 'vue-router'
import initAdminPatient from './admin'
import { renderScene } from '@/modules/scene/useSceneHook'

const handleAdmin = () => {
  // 从URL获取IPGSN
  const route = useRoute()
  const queryParams = route.query
  renderScene({
    selector: '.main-scene',
    config: {},
  }).then(() => {
    return initAdminPatient(queryParams)
  })
}

export default () => {
  const SRENV = globalThis.SRENV
  if (SRENV.IS_PLATFORM_ADMIN) {
    handleAdmin()
  }
}
