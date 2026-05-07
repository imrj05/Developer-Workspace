import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['developer-workspace.rajeshwarkashyap.in'],
  },
  build: {
    rollupOptions: {
      input: ['index.html', '404.html'],
    },
  },
})
