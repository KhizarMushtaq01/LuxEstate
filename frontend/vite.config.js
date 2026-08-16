import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Vite 8's default rolldown minifier drops react-router-dom's React
    // namespace binding, so BrowserRouter hits an undefined `React` and throws
    // "Cannot read properties of undefined (reading 'useRef')" at runtime.
    // Only the minified build is affected. Terser produces correct output.
    minify: 'terser',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true }
    }
  }
})
