import { resolve } from 'path'
import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
const BASE_URL = loadEnv('env', '').VITE_BASE_URL
export default defineConfig({
  plugins: [
    uni()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8088,
    proxy: {
      '/api': {
        target: BASE_URL,
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
