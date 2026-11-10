import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

// Configuración plana de ESLint para JavaScript y compoñentes Vue.
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
      // As variables sen uso avisan, pero non bloquean a compilación.
      'no-unused-vars': 'warn',

      // As referencias a variables inexistentes son erros.
      'no-undef': 'error',

      // Permite mensaxes de consola durante o desenvolvemento.
      'no-console': 'off',

      // Permite nomes de compoñente dunha soa palabra.
      'vue/multi-word-component-names': 'off',

      // As variables de template sen uso avisan, pero non bloquean.
      'vue/no-unused-vars': 'warn',

      // Impide modificar directamente unha prop recibida.
      'vue/no-mutating-props': 'error',

      // Esixe unha key estable nos elementos de v-for.
      'vue/require-v-for-key': 'error'
    }
  },

  {
    // Exclúe dependencias instaladas e saída xerada.
    ignores: [
      'node_modules/',
      'dist/'
    ]
  }
]