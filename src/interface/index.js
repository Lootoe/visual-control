import { useRoute } from 'vue-router'
import initAdminPatient from './admin'

export default () => {
  const SRENV = globalThis.SRENV
  if (SRENV.IS_PLATFORM_ADMIN) {
    // 从URL获取IPGSN
    const route = useRoute()
    const queryParams = route.query
    console.log('queryParams', queryParams)
    initAdminPatient(queryParams)
  }
}
