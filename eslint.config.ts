import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default [
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off', // Vue 3.5 使用解構預設值語法
      // no-unused-vars 未使用變數不報錯
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  eslintConfigPrettier,
];
