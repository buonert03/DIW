import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Activa o procesamento de compoñentes .vue en Vite.
export default defineConfig({
  plugins: [vue()],
})
