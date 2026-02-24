import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        // 入口檔案命名：背景腳本放根目錄，其他放 js/ 資料夾
        entryFileNames: chunkInfo => {
          return chunkInfo.name === 'background' ? '[name].js' : 'js/[name].js';
        },

        // 程式碼分割檔案：統一放 js/ 資料夾
        chunkFileNames: 'js/[name]-[hash].js',

        // 靜態資源檔案：CSS 放 css/，其他放 assets/
        assetFileNames: assetInfo => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
  },
});
