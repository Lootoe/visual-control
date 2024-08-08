import './env'
import { createApp } from 'vue'
import router from './router'
import './style/index.less'
import App from './App.vue'
import { setupStore } from '@/store'

const app = createApp(App)
app.use(router)
app.mount('#app')
setupStore(app)
