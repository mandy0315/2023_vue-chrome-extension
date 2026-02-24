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
        entryFileNames: chunkInfo => {
          return chunkInfo.name === 'background' ? `[name].js` : `js/[name].js`;
        },
        chunkFileNames: `js/[name].js`,
        assetFileNames: chunkInfo => {
          const fileExtName = chunkInfo.name.split('.')[chunkInfo.name.split('.').length - 1];
          const filesPath = {
            css: `css/[name].[ext]`,
          };
          return fileExtName ? `assets/${filesPath[fileExtName]}` : `assets/[name].[ext]`;
        },
      },
    },
  },
});
