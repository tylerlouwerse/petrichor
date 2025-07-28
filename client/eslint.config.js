import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginTypeScript from '@typescript-eslint/eslint-plugin'
import parserTypeScript from '@typescript-eslint/parser'
import parserVue from 'vue-eslint-parser'
import pluginImport from 'eslint-plugin-import'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      'import': pluginImport
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      '@typescript-eslint': pluginTypeScript,
      'import': pluginImport,
      'vue': pluginVue
    },
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/no-reserved-component-names': 0,
      'vue/no-mutating-props': 1,
      'vue/no-v-html': 0,
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    ignores: ['dist/', 'node_modules/', '*.d.ts']
  }
]