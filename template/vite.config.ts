import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              // Runtime dependencies of the main process resolve from node_modules.
              // Keep this list in sync with "dependencies" in package.json (see AGENTS.md).
              external: [],
            },
          },
        },
      },
      preload: {
        input: path.join(import.meta.dirname, 'electron/preload.ts'),
      },
    }),
  ],
})
