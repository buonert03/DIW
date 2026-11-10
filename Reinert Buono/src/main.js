// Crea a aplicación Vue, rexístra os plugins globais e móntaa no documento.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

// O router e Pinia deben estar rexistrados antes de renderizar os compoñentes.
createApp(App).use(router).use(pinia).mount('#app')
