// Punto de entrada: crea Vue, instala los plugins globales y monta la aplicación en el HTML.
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()

// Registra navegación y estado global antes de renderizar el componente raíz.
createApp(App).use(router).use(pinia).mount('#app')
