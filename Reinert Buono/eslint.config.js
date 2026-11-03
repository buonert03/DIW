import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
  //colocar en la raíz del proyecto

export default [
  // Reglas básicas de JavaScript
  js.configs.recommended,

  // Reglas recomendadas para Vue 3
  ...vue.configs['flat/recommended'],

  {
    // Ficheros a los que se aplica esta configuración
    files: ['**/*.{js,mjs,cjs,vue}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    rules: {
      // Variables declaradas pero no utilizadas
      // Se avisa, pero no se bloquea el proyecto
      'no-unused-vars': 'warn',

      // Variables o funciones que no existen
      'no-undef': 'error',

      // Permitimos console.log durante el desarrollo
      'no-console': 'off',

      // Permitimos nombres de componentes como Home.vue o Login.vue
      'vue/multi-word-component-names': 'off',

      // Variables del template de Vue que no se utilizan
      'vue/no-unused-vars': 'warn',

      // No modificar directamente una prop recibida
      'vue/no-mutating-props': 'error',

      // Obliga a utilizar key en v-for
      'vue/require-v-for-key': 'error'
    }
  },

  {
    // Directorios que no queremos analizar
    ignores: [
      'node_modules/',
      'dist/'
    ]
  }
]