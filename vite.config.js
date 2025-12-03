import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    tailwindcss()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    deps: { inline: [/react/, /react-dom/] }
  },
});
