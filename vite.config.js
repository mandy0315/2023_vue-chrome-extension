import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),Components()],
  resolve: {
    alias: {
      "@": resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background'? `[name].js` : `js/[name].js`
        },
        chunkFileNames: `js/[name].js`,
        assetFileNames: (chunkInfo) => {
          const fileExtName = chunkInfo.name.split('.')[chunkInfo.name.split('.').length - 1];
          const filesPath = {
            css: `css/[name].[ext]`
          }
          return fileExtName ? `assets/${filesPath[fileExtName]}`: `assets/[name].[ext]`
        },
      }
    }
  }
})
