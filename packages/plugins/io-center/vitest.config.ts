import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
    server: {
      deps: {
        inline: ['bits-ui'],
      }
    }
  },
})