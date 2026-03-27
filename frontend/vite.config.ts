import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

const hostname = "localhost";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3001,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', hostname]
  },
  plugins: [
    react(), 
    reactRefresh(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB (pick a number above your biggest chunk)
      },
    })
  ],
  // ...other config settings
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/utilities/api'),
      '@store': path.resolve(__dirname, './src/utilities/store'),
      '@helpers': path.resolve(__dirname, './src/utilities/helpers'),
      '@components': path.resolve(__dirname, './src/components'),
      '@mui2': path.resolve(__dirname, './src/components/Mui'),
      '@lib': path.resolve(__dirname, './src/utilities/lib'),
      '@hooks': path.resolve(__dirname, './src/utilities/hooks'),
      '@theme': path.resolve(__dirname, './src/utilities/theme'),
      '@utilities': path.resolve(__dirname, './src/utilities'),
      '@config': path.resolve(__dirname, './src/utilities/config'),
      '@types': path.resolve(__dirname, './src/utilities/types')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
