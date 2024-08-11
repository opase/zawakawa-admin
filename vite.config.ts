import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'




export default defineConfig({
  server: {
    base: "/admin",
    port: 3003,
    host: '0.0.0.0',
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src/'
    },
  },

  plugins: [vue()],
})
