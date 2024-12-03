import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/vitest.setup.ts',
    css: true,
    watch: false,
    coverage: {
      exclude: ['**/node_modules/**', '**/dist/**', '**/your-folder-to-ignore/**', '**/__mocks__/**', '**/__tests__/**', '**/constants/**', '**/interfaces/**', '**/models/**', '**/router/**', '**/deprecated/**', '**/vite.config.ts', '**/eslint.config.js', '**/src/main.tsx', '**/src/vite-env.d.ts'],
    },
  },
  optimizeDeps: {
    include: ['react-pdf']
  },
  build: {
    commonjsOptions: {
      include: [/react-pdf/, /node_modules/]
    }
  },
  server: {
    proxy: {
      '/backend': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, '')
      },
      '/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, '')
      }
    }
  }
})


  /*server: {
    proxy: {
        '/api': {
            target: 'https://duckduckgo.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
        },
    },
  },*/
  /*server: {
    host: true, // Allows access from outside the container
    port: 5173, // Change this if needed
  },*/