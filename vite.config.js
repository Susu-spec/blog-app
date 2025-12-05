import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import istanbulPlugin from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react({ jsxRuntime: "automatic" }),
    istanbulPlugin({
      include: ["src/**"],
      exclude: ["node_modules/**", "cypress/**", "tests/**"],
      extension: [".js", ".jsx", ".ts", ".tsx"],
      cypress: true,
      requireEnv: false,
    }),
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
    deps: { inline: [/react/, /react-dom/] },
    coverage: {
      provider: "v8",
      all: true,
      exclude: [
        "src/components/**/*",
        "src/pages/**/*",
        "src/hooks/**/*",
      ],
    }
  },
});
