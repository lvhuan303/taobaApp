import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'

createApp(App).use(store).use(router).mount('#app')


const app = createApp(App)
if(import.meta.env.MODE == 'development') {
  if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
  }
}
