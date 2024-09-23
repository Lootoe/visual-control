import './env'
import { createApp } from 'vue'
import router from './router'
import './style/index.less'
import App from './App.vue'
import { setupStore } from '@/store'
import { i18nRegister } from '@/lang'

const app = createApp(App)
app.use(router)
app.use(i18nRegister)
app.mount('#app')
setupStore(app)
window.hack = {}
